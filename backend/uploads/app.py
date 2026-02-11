from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_bcrypt import Bcrypt
import os, shutil, secrets, datetime

from doc_report import docstring_coverage
from parsor import extract_nodes
from main import analyze_and_generate
from validator import validate_pep257

import mysql.connector

# -------------------- Flask Setup --------------------
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
GENERATED_FOLDER = os.path.join(BASE_DIR, "generated")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# -------------------- MySQL Config --------------------
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "m?PES@23",
    "database": "pydoc_generator"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

# -------------------- USER AUTH --------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username=%s", (username,))
    if cursor.fetchone():
        cursor.close(); conn.close()
        return jsonify({"msg": "Username already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_pw))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = secrets.token_hex(16)
    return jsonify({"token": token, "username": username})

# -------------------- FILE UPLOAD --------------------
@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    username = request.args.get("username")
    if not file or not username:
        return jsonify({"error": "File or username missing"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO user_files (username, filename, file_type) VALUES (%s, %s, %s)",
        (username, filename, "uploaded")
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"filename": filename})


@app.route("/user_files/<username>", methods=["GET"])
def get_user_files(username):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT filename, file_type FROM user_files WHERE username=%s", (username,))
    files = cursor.fetchall()
    cursor.close()
    conn.close()

    uploaded = [f["filename"] for f in files if f["file_type"] == "uploaded"]
    generated = [f["filename"] for f in files if f["file_type"] == "generated"]

    return jsonify({"uploaded": uploaded, "generated": generated})


# -------------------- ANALYZE --------------------
@app.route("/analyze", methods=["POST"])
def analyze_code():
    data = request.get_json()
    filename = data["filename"]
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    _, nod, _, _ = extract_nodes(filepath)
    total_coverage = docstring_coverage(filepath)

    result = [{"name": n["name"], "type": n["type"], "hasDocstring": n["hasDocstring"], "coverage": 100 if n["hasDocstring"] else 0} for n in nod]

    return jsonify({"nodes": result, "tree": nod, "coverage": total_coverage})


@app.route("/upanalyze", methods=["POST"])
def upanalyze_code():
    data = request.get_json()
    filename = data["filename"]
    filepath = os.path.join(GENERATED_FOLDER, filename)

    _, nod, _, _ = extract_nodes(filepath)
    total_coverage = docstring_coverage(filepath)

    result = [{"name": n["name"], "type": n["type"], "hasDocstring": n["hasDocstring"], "coverage": 100 if n["hasDocstring"] else 0} for n in nod]

    return jsonify({"nodes": result, "tree": nod, "coverage": total_coverage})


# -------------------- GENERATE DOCSTRINGS --------------------
@app.route("/generate", methods=["POST"])
def generate_docstrings():
    data = request.get_json()
    filename = data["filename"]
    style = data.get("style", "google")
    username = data.get("username")  # <- get username from request

    original_path = os.path.join(UPLOAD_FOLDER, filename)

    # Add timestamp to avoid filename collisions
    
   
    generated_filename = f"generated_{filename}"
    generated_path = os.path.join(GENERATED_FOLDER, generated_filename)

    shutil.copy(original_path, generated_path)

    # Generate docstrings
    analyze_and_generate(generated_path, style)

    with open(original_path, "r", encoding="utf-8") as f:
        original_code = f.read()
    with open(generated_path, "r", encoding="utf-8") as f:
        updated_code = f.read()

    # ✅ Save generated file in MySQL
    if username:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO user_files (username, filename, file_type) VALUES (%s, %s, %s)",
            (username, generated_filename, "generated")
        )
        conn.commit()
        cursor.close()
        conn.close()

    return jsonify({
        "original": original_code,
        "updated": updated_code,
        "generatedFile": generated_filename
    })



# -------------------- VALIDATE --------------------
@app.route("/validate", methods=["POST"])
def validate_docstrings():
    data = request.get_json()
    filename = data["filename"]
    filetype = data.get("type", "generated")

    folder = UPLOAD_FOLDER if filetype == "original" else GENERATED_FOLDER
    filepath = os.path.join(folder, filename)

    result = validate_pep257(filepath)

    return jsonify({
        "passed": result.get("passed", False),
        "errors": result.get("errors", []),
        "message": result.get("message", "PEP 257 validation completed")
    })


# -------------------- DOWNLOAD --------------------
@app.route("/download/<filename>")
def download_file(filename):
    filepath = os.path.join(GENERATED_FOLDER, filename)
    return send_file(filepath, as_attachment=True, download_name=filename)

# -------------------- RUN SERVER --------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True,use_reloader=False  )

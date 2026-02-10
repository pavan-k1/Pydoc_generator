from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os, uuid, shutil, subprocess, sys

from doc_report import (
docstring_coverage
)
from parsor import (
extract_nodes
)
from main import (
    analyze_and_generate
)
from validator import (
    validate_pep257
)



app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
GENERATED_FOLDER = os.path.join(BASE_DIR, "generated")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    username = request.args.get("username")
    print("UPLOAD route called — username:", username)  # 👈 debug

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    if username:
        print(f"Saving user activity for {username} → {filename}")  # 👈 debug
        save_user_activity(username, uploaded=filename)
    else:
        print("⚠️ No username received!")

    return jsonify({"filename": filename})



@app.route("/analyze", methods=["POST"])
def analyze_code():
    data = request.get_json()
    filename = data["filename"]
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    _, nod, _, _ = extract_nodes(filepath)
    total_coverage = docstring_coverage(filepath)

    result = []
    for n in nod:
        result.append({
            "name": n["name"],
            "type": n["type"],
            "hasDocstring": n["hasDocstring"],
            "coverage": 100 if n["hasDocstring"] else 0
        })

    return jsonify({
        "nodes": result,  
        "tree": nod,     
        "coverage": total_coverage
    })
@app.route("/upanalyze", methods=["POST"])
def upanalyze_code():
    data = request.get_json()
    filename = data["filename"]
    filepath = os.path.join(GENERATED_FOLDER, filename)

    _, nod, _, _ = extract_nodes(filepath)
    total_coverage = docstring_coverage(filepath)

    result = []
    for n in nod:
        result.append({
            "name": n["name"],
            "type": n["type"],
            "hasDocstring": n["hasDocstring"],
            "coverage": 100 if n["hasDocstring"] else 0
        })

    return jsonify({
        "nodes": result,  
        "tree": nod,     
        "coverage": total_coverage
    })


@app.route("/generate", methods=["POST"])
def generate_docstrings():
    try:
        data = request.get_json()
        filename = data["filename"]
        style = data.get("style", "google")

        original_path = os.path.join(UPLOAD_FOLDER, filename)
        generated_filename = f"generated_{filename}"
        generated_path = os.path.join(GENERATED_FOLDER, generated_filename)

        shutil.copy(original_path, generated_path)

        analyze_and_generate(generated_path, style)

        with open(original_path, "r", encoding="utf-8") as f:
            original_code = f.read()
        with open(generated_path, "r", encoding="utf-8") as f:
            updated_code = f.read()

        return jsonify({
            "original": original_code,
            "updated": updated_code,
            "generatedFile": generated_filename
        })

    except Exception as e:
        import traceback
        traceback.print_exc()   # 👈 VERY IMPORTANT
        return jsonify({
            "error": str(e)
        }), 500


@app.route("/coverage", methods=["GET"])
def coverage():
    filename = request.args.get("filename")
    filetype = request.args.get("type", "original")
    folder = UPLOAD_FOLDER if filetype == "original" else GENERATED_FOLDER
    filepath = os.path.join(folder, filename)

    _, nod, _, _ = extract_nodes(filepath)
    total_coverage = docstring_coverage(filepath)

    nodes_result = [
        {"name": name, "coverage": 100 if doc else 0}
        for name, start, end, doc, node_type in nod
    ]

    return jsonify({
        "coverage": total_coverage,
        "nodes": nodes_result
       
    })
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
        "message": result.get(
            "message",
            "PEP 257 validation completed"
        )
    })





@app.route("/download/<generatedfilename>")
def download_file(generatedfilename):
    filepath = os.path.join(GENERATED_FOLDER, generatedfilename)

    return send_file(
        filepath,
        as_attachment=True,
        download_name=generatedfilename
    )







import json

USER_DATA_FOLDER = "user_data"
os.makedirs(USER_DATA_FOLDER, exist_ok=True)

# Save user’s file activity
def save_user_activity(username, uploaded=None, generated=None):
    path = os.path.join(USER_DATA_FOLDER, f"{username}.json")
    data = {"uploaded": [], "generated": []}

    if os.path.exists(path):
        with open(path, "r") as f:
            data = json.load(f)

    if uploaded:
        data["uploaded"].append(uploaded)
    if generated:
        data["generated"].append(generated)

    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# Fetch user activity
@app.route("/user_files/<username>", methods=["GET"])
def get_user_files(username):
    path = os.path.join(USER_DATA_FOLDER, f"{username}.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            data = json.load(f)
    else:
        data = {"uploaded": [], "generated": []}
    return jsonify(data)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        threaded=True,
        use_reloader=False
    )

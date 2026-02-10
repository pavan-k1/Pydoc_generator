import ast
import google.generativeai as genai
import ast
import subprocess
import sys


def get_existing_docstring(node):
    return ast.get_docstring(node)


def get_node_type(node):
    if isinstance(node, ast.Module):
        return "module"
    elif isinstance(node, ast.ClassDef):
        return "class"
    elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        return "function"

def extract_nodes(filename: str):
    with open(filename, "r", encoding="utf-8") as f:
        source = f.read()
        tree = ast.parse(source)
    nodes = []

    for node in tree.body:
        if isinstance(node, ast.ClassDef):
            nodes.append((node.name, node, ast.get_source_segment(source, node), ast.get_docstring(node),get_node_type(node)))
            for child in node.body:
                if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    nodes.append((f"{node.name}.{child.name}", child,ast.get_source_segment(source, child),ast.get_docstring(child),get_node_type(child)))
                   

        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            nodes.append((node.name, node, ast.get_source_segment(source, node), ast.get_docstring(node),get_node_type(node)))
           

    return nodes,source,tree

def generate_docstring(code_segment, style,node_type,existing_docstring=None):
    genai.configure(api_key="AIzaSyDeXXCYTua-ecDjoPQkFeNvCGTHuFbxhy0")
    model = genai.GenerativeModel("gemini-2.5-flash")

    Styles = {
        "google": "Follow Google Python docstring style.",
        "numpy": "Follow NumPy docstring style.",
        "rest": "Follow reStructuredText docstring style."
    }

    if style not in Styles:  
        style = "google"
    
    if node_type=="function":
     if existing_docstring:
      prompt = f'''
           
           You are an expert Python developer.
           Ensure that the following existing docstring fully follows {Styles[style]} style and PEP 257 conventions.
           If it does not match the requested style or is incomplete, rewrite and complete it properly.
           Return only the corrected docstring (no code, no extra quotes)
           Include a summary, parameters with types, return type, and description.
           Do NOT include the function code, code fences, or extra quotes.
           first word should not end with s.
       {Styles[style]}

       Function:
       {code_segment}
     Existing docstring:
  \"\"\"{existing_docstring}\"\"\"
''' 
     else:
       prompt = f'''
           You are an expert Python developer.
           Generate Python docstring (triple-quoted) PEP257 validated for the following function.
           Include a summary, parameters with types, return type, and description.
           Do NOT include the function code, code fences, or extra quotes.
           first word should not end with s.

       {Styles[style]}

       Function:
       {code_segment}
      '''
    elif node_type=="class":
     if existing_docstring:
      prompt = f'''
           
           You are an expert Python developer.
           Ensure that the following existing docstring fully follows {Styles[style]} style and PEP 257 conventions.
           If it does not match the requested style or is incomplete, rewrite and complete it properly.
           Return only the corrected docstring (no code, no extra quotes)
           Do NOT include the function code, code fences, or extra quotes.
           first word should not end with s.
       {Styles[style]}

       Class
       {code_segment}
     Existing docstring:
  \"\"\"{existing_docstring}\"\"\"
''' 
     else:
       prompt = f'''
           You are an expert Python developer.
           Generate Python docstring (triple-quoted) PEP257 validated for the following Class in just 2-3 lines.
           Do NOT include the function code, code fences, or extra quotes.
           first word should not end with s.

       {Styles[style]}

       Class:
       {code_segment}
      '''
    elif node_type=="module":
       prompt = f'''
           You are an expert Python developer.
           Generate Python docstring (triple-quoted) PEP257 validated for the following Module in just two lines.
           Do NOT include the function code, code fences, or extra quotes.
           first word should not end with s.

       {Styles[style]}

       Module:
       {code_segment}
      '''     

    
   
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("Gemini has some problem:", e)
        return "There is some problem in generating docstrings."



def clean_docstring(docstring: str) -> str:
    docstring = docstring.strip()
    docstring = docstring.replace("\\n", "\n")         
    docstring = docstring.replace("```python", "")    
    docstring = docstring.replace("```", "")
    if not (docstring.startswith('"""') and docstring.endswith('"""')):
        docstring = f'"""{docstring}"""'
    return docstring


def insert_docstring_ast(node, docstring):
    docstring = docstring.strip().replace('"""', "")
    docstring = ast.Expr(value=ast.Constant(value=docstring))

    if ast.get_docstring(node):
        node.body[0] = docstring
    else:
        node.body.insert(0, docstring)

    return node




def fix_file_formatting(filename: str):
    try:
        subprocess.run(
            [sys.executable, "-m", "docformatter", "-i", filename], check=True
        )
    except subprocess.CalledProcessError as e:
             pass


def analyze_and_generate(filename, style):
   
    nodes, source,tree = extract_nodes(filename)

    module_doc = generate_docstring(source,style,get_node_type(tree),get_existing_docstring(tree))
    module_doc = clean_docstring(module_doc)
    tree = insert_docstring_ast(tree, module_doc)

    for name,node, code_segment,existing_doc,node_type in nodes:
        is_empty = len(node.body) == 0 or all(isinstance(n, ast.Pass) for n in node.body)

        if is_empty:
             docstring = '"""TODO: Implement this function."""'
            

        else:
            
            docstring = generate_docstring(code_segment, style,node_type,existing_doc)
            docstring = clean_docstring(docstring) 
        node=insert_docstring_ast( node, docstring)

    source = ast.unparse(tree)

    with open(filename, "w", encoding="utf-8") as f:
        f.write(source)
    fix_file_formatting(filename)

def validate_pep257(filename: str) -> None:
    print("\n Running PEP 257 (pydocstyle) validation...\n")
    result = subprocess.run(
        [sys.executable, "-m", "pydocstyle", filename],
        capture_output=True,
        text=True
    )

    output = result.stdout.strip() + "\n" + result.stderr.strip()
    output = output.strip()

    if not output:
        print("All docstrings are valid according to PEP 257")
    else:
        print("According to PEP 257 issues found:\n")
        print(output)


def docstring_coverage(filename: str):
    with open(filename, "r", encoding="utf-8") as f:
        source = f.read()
        tree = ast.parse(source)

    total_nodes = 0
    documented_nodes = 0

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef, ast.Module)):
            total_nodes += 1
            if ast.get_docstring(node):
                documented_nodes += 1

    if total_nodes == 0:
        print("No functions, classes, or modules found.")
        return 0

    coverage = (documented_nodes / total_nodes) * 100
    return coverage




if __name__ == "__main__":
    style = input("Enter the docstring style you want to generate the docstring (google/numpy/rest): ")
    print( "Provided file docstring coverage: ",docstring_coverage("test.py"))
    analyze_and_generate("test.py", style)
    print("Docstrings are generated in the file")
    validate_pep257("test.py")
    print( "Updated file docstring coverage: ",docstring_coverage("test.py"))

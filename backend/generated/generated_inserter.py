"""Perform operations for Python docstring cleaning, insertion, and code
formatting.

Facilitate processing, AST-based insertion, and `docformatter` application to files.
"""
import ast
import subprocess
import sys
import os

def clean_docstring(docstring: str) -> str:
    """Clean a raw string to resemble a valid Python docstring.

    Process a given string, typically originating from a source that might include markdown formatting or inconsistent newline representations, and formats it to be suitable as a Python docstring.

    This function performs the following cleaning steps:
    1.  Strips leading and trailing whitespace from the string.
    2.  Replaces escaped newline characters (`\\
    `) with actual newline characters (`
    `).
    3.  Removes "" and generic "" markdown code fences.
    4.  Ensures the resulting string is wrapped in triple double-quotes (``) if it isn't already.

    The aim is to convert a potentially messy input into a format that closely resembles a PEP257-compliant Python docstring.

    Args:
        docstring (str): The raw string content to clean.

    Returns:
        str: The cleaned and formatted string, wrapped in triple double-quotes.
    """
    docstring = docstring.strip()
    docstring = docstring.replace('\\n', '\n')
    docstring = docstring.replace('```python', '')
    docstring = docstring.replace('```', '')
    if not (docstring.startswith('"""') and docstring.endswith('"""')):
        docstring = f'"""{docstring}"""'
    return docstring

def fix_file_formatting(filename: str):
    """Applies auto-formatting to a specified file using `docformatter`.

    :param filename: (str) The path to the file to be formatted.
    :returns: None

    This function attempts to apply docstring formatting using the `docformatter` tool to the provided `filename`. It executes `docformatter -i <filename>` as a subprocess, which modifies the file in place. The function silently handles any `subprocess.CalledProcessError` that might occur if `docformatter` fails to format the file for any reason (e.g., file not found, syntax errors that prevent parsing).
    """
    try:
        subprocess.run([sys.executable, '-m', 'docformatter', '-i', filename], check=True)
    except subprocess.CalledProcessError as e:
        pass

def insert_docstring_ast(node, docstring):
    """Insert or update a docstring for an AST node.

    Prepares the docstring string by stripping whitespace and removing existing triple quotes.
    Creates an `ast.Expr` node to represent the docstring within the AST. If the target `node`
    already contains a docstring, this function replaces it. Otherwise, it inserts the new
    docstring at the beginning of the `node`'s body.

    Args:
        node (ast.AST): The AST node (e.g., function, class, or module definition) to modify.
        docstring (str): The content of the docstring to insert or update.

    Returns:
        ast.AST: The modified AST node with the new or updated docstring.
    """
    docstring = docstring.strip().replace('"""', '')
    docstring = ast.Expr(value=ast.Constant(value=docstring))
    if ast.get_docstring(node):
        node.body[0] = docstring
    else:
        node.body.insert(0, docstring)
    return node
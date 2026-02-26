"""Utility for cleaning and inserting docstrings using AST and fixing file
formatting.

It processes raw strings to ensure valid documentation structure and
layout.
"""
import ast
import subprocess
import sys
import os

def clean_docstring(docstring: str) -> str:
    """Clean the provided docstring content.

    Performs operations such as stripping whitespace, converting escaped newline
    sequences, removing Python code fences ("" and ""), and ensuring
    the final output is wrapped in triple quotes.

    Args:
        docstring (str): The raw docstring string to be processed.

    Returns:
        str: The cleaned and formatted docstring wrapped in triple quotes.
    """
    docstring = docstring.strip()
    docstring = docstring.replace('\\n', '\n')
    docstring = docstring.replace('```python', '')
    docstring = docstring.replace('```', '')
    if not (docstring.startswith('"""') and docstring.endswith('"""')):
        docstring = f'"""{docstring}"""'
    return docstring

def fix_file_formatting(filename: str):
    """Fix the formatting of a specific file.

    This function executes the `docformatter` module as a subprocess
    to modify the file in-place. If the subprocess fails, the error
    is caught and ignored.

    Args:
        filename (str): The path to the file to be formatted.

    Returns:
        None
    """
    try:
        subprocess.run([sys.executable, '-m', 'docformatter', '-i', filename], check=True)
    except subprocess.CalledProcessError as e:
        pass

def insert_docstring_ast(node, docstring):
    """Insert a docstring into the body of an Abstract Syntax Tree (AST) node.

    This function processes the raw string by stripping whitespace and removing
    occurrences of triple quotes, converting it into an AST expression node. It
    then places this node at the beginning of the target node's body. If a
    docstring is already found within the node, the first statement is replaced;
    otherwise, the new docstring is inserted at the start of the body.

    Args:
        node (ast.AST): The AST node (e.g., Module, FunctionDef, ClassDef) whose
            body will be modified.
        docstring (str): The raw documentation text to insert.

    Returns:
        ast.AST: The modified node with the docstring applied.
    """
    docstring = docstring.strip().replace('"""', '')
    docstring = ast.Expr(value=ast.Constant(value=docstring))
    if ast.get_docstring(node):
        node.body[0] = docstring
    else:
        node.body.insert(0, docstring)
    return node
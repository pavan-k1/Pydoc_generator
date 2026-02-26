"""Calculate the percentage of docstring coverage for a given file.

:return: The calculated coverage percentage.
"""
import ast

def docstring_coverage(filename: str):
    """Calculate the docstring coverage percentage for a given Python file.

    Parse the source file to inspect the Abstract Syntax Tree (AST) for
    modules, classes, and functions. Determine how many of these nodes
    have docstrings defined and return the ratio as a percentage.

    :param filename: Path to the Python source file for analysis.
    :type filename: str
    :return: The percentage of documented entities, or 0 if no entities
        exist.
    :rtype: float
    """
    with open(filename, 'r', encoding='utf-8') as f:
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
        print('No functions, classes, or modules found.')
        return 0
    coverage = documented_nodes / total_nodes * 100
    return coverage
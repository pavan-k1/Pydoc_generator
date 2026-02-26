"""Module for validating PEP 257 compliance using pydocstyle.

This utility executes a subprocess check and returns validation status.
"""
import ast
import google.generativeai as genai
import ast
import subprocess
import sys
import os

def validate_pep257(filename: str):
    """Validate a Python file following PEP 257 docstring standards.

    Executes pydocstyle on the target file to ensure docstring compliance.

    Args:
        filename (str): The path to the Python file to check.

    Returns:
        dict: A dictionary containing a 'passed' boolean and a 'message' string
            indicating the outcome of the validation.
    """
    print('\n Running PEP 257 (pydocstyle) validation...\n')
    result = subprocess.run([sys.executable, '-m', 'pydocstyle', filename], capture_output=True, text=True)
    output = (result.stdout + '\n' + result.stderr).strip()
    if not output:
        return {'passed': True, 'message': '✅ All docstrings are valid according to PEP 257'}
    return {'passed': False, 'message': output}
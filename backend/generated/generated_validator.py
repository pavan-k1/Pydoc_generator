"""Validate Python module docstrings against PEP 257 standards.

This module utilizes `pydocstyle` to perform the validation.
"""
import ast
import google.generativeai as genai
import ast
import subprocess
import sys
import os

def validate_pep257(filename: str):
    """Validate PEP 257 compliance for docstrings in a Python file.

    This function executes `pydocstyle` (PEP 257 validation tool) on the specified Python file.
    It captures the standard output and standard error from the `pydocstyle` process.
    If `pydocstyle` produces no output, it indicates that all docstrings within the
    file adhere to PEP 257 guidelines. Otherwise, the function returns the combined
    output, which typically details the docstring errors found.

    Args:
        filename (str): The path to the Python file to validate.

    Returns:
        dict: A dictionary containing the validation results.
            - `passed` (bool): True if all docstrings are valid, False otherwise.
            - `message` (str): A success message or a detailed error report from `pydocstyle`.
    """
    print('\n Running PEP 257 (pydocstyle) validation...\n')
    result = subprocess.run([sys.executable, '-m', 'pydocstyle', filename], capture_output=True, text=True)
    output = (result.stdout + '\n' + result.stderr).strip()
    if not output:
        return {'passed': True, 'message': '✅ All docstrings are valid according to PEP 257'}
    return {'passed': False, 'message': output}
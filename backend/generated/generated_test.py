"""This module provides a basic greeting and utility functions for file
handling.

It includes a `greet` function and `FileUtils` class for common filename checks.
"""

def greet():
    """Display a greeting message.

    This function outputs the string 'hello everyone' to the standard console.

    Args:
        None.

    Returns:
        None: This function does not return any explicit value; its primary action is to print to standard output.
    """
    print('hello everyone')

class FileUtils:
    """Provides utility methods for file-related operations."""

    @staticmethod
    def get_extension(filename):
        """Get the file extension from a filename.

        Args:
            filename (str): The name of the file, e.g., "document.pdf" or "archive.tar.gz".

        Returns:
            str: The file extension without the leading dot.

        This function splits the filename by the dot (`.`) character and returns the last part.
        It is suitable for filenames with a single extension like "image.jpg" or multiple extensions like "archive.tar.gz" (returning "gz").
        If the filename does not contain a dot, the entire filename is returned as its "extension".
        For filenames starting with a dot, like ".bashrc", it correctly returns "bashrc".
        """
        return filename.split('.')[-1]

    @staticmethod
    def is_python_file(filename):
        """Determine if a filename represents a Python file.

        Args:
            filename: The name of the file to check, including its extension.

        Returns:
            True if the filename ends with '.py', False otherwise.

        This function performs a simple string suffix check to identify files that are typically
        Python source code files. It does not access the file system or validate file existence.
        """
        return filename.endswith('.py')
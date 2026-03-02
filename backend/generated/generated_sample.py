"""Provide module-level functionality.

Contain reusable components and definitions.
"""

def add_numbers(a, b):
    """Perform the add_numbers operation.

    Parameters
    ----------
    a : Any
        Description.
    b : Any
        Description.

    Returns
    -------
    Any
        Description of return value.
    """
    return a + b

def is_even(number):
    """Perform the is_even operation.

    Parameters
    ----------
    number : Any
        Description.

    Returns
    -------
    Any
        Description of return value.
    """
    return number % 2 == 0

def factorial(n):
    """Perform the factorial operation.

    Parameters
    ----------
    n : Any
        Description.

    Returns
    -------
    Any
        Description of return value.
    """
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
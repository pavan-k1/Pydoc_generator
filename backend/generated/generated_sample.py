"""This module offers fundamental mathematical functions.

It covers basic arithmetic, parity checks, and factorial calculations.
"""

def add_numbers(a, b):
    """Add two numbers together.

    This function computes the sum of two input numbers.

    Args:
        a (int | float): The first number to add.
        b (int | float): The second number to add.

    Returns:
        int | float: The sum of the two input numbers.
    """
    return a + b

def is_even(number):
    """Checks if a given number is even.

    Args:
        number (int): The integer to check for evenness.

    Returns:
        bool: True if the number is even, False otherwise.
    """
    return number % 2 == 0

def factorial(n):
    """Compute the factorial of a non-negative integer.

    The factorial of a non-negative integer `n`, denoted by `n!`, is the product of all positive
    integers less than or equal to `n`. For example, `5! = 5 * 4 * 3 * 2 * 1 = 120`.
    By definition, `0! = 1`. This function iteratively calculates `n!`.
    The function expects `n` to be a non-negative integer.

    Args:
        n (int): A non-negative integer for which to compute the factorial.

    Returns:
        int: The factorial of `n`.
    """
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
"""
Sample module for testing docstring generation.
"""

from dataclasses import dataclass
from typing import List, Dict, Optional


# ---------------- MODULE VARIABLES ---------------- #

VERSION = "1.0.0"
DEFAULT_TIMEOUT = 30


# ---------------- FUNCTIONS ---------------- #

def add(a: int, b: int) -> int:
    return a + b


def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"


def process_items(*items: str, uppercase: bool = False) -> List[str]:
    if uppercase:
        return [item.upper() for item in items]
    return list(items)


async def fetch_data(url: str, timeout: int = DEFAULT_TIMEOUT) -> Dict:
    return {"url": url, "status": "success"}


def divide(a: float, b: float) -> Optional[float]:
    if b == 0:
        return None
    return a / b


# ---------------- CLASSES ---------------- #

class Calculator:
    """Basic calculator class."""

    def __init__(self, initial_value: float = 0):
        self.value = initial_value

    def add(self, amount: float) -> float:
        self.value += amount
        return self.value

    def subtract(self, amount: float) -> float:
        self.value -= amount
        return self.value

    @staticmethod
    def multiply(a: float, b: float) -> float:
        return a * b

    @classmethod
    def from_list(cls, numbers: List[float]):
        instance = cls()
        instance.value = sum(numbers)
        return instance


class User:
    def __init__(self, username: str, email: str):
        self.username = username
        self.email = email

    def update_email(self, new_email: str) -> None:
        self.email = new_email

    def to_dict(self) -> Dict[str, str]:
        return {
            "username": self.username,
            "email": self.email
        }


@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0

    def total_value(self) -> float:
        return self.price * self.quantity


# ---------------- MORE FUNCTIONS ---------------- #

def filter_even(numbers: List[int]) -> List[int]:
    return [n for n in numbers if n % 2 == 0]


def summarize_data(data: Dict[str, int]) -> Dict[str, int]:
    total = sum(data.values())
    count = len(data)
    return {
        "total": total,
        "count": count
    }
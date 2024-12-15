import inspect
from typing import List

from pydantic import BaseModel

from .arg import Arg
from .example import Example
from .func import PyFunc, extract_func


class PyClass(BaseModel):
    name: str
    signature: str
    summary: str | None
    desc: str | None
    args: List[Arg]
    examples: List[Example]
    methods: List[PyFunc]


def extract_class(cls: type):
    assert isinstance(cls, type), cls

    methods = inspect.getmembers(cls, predicate=inspect.isfunction)
    for name, method in methods:
        extract_func(method)

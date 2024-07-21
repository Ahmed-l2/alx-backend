#!/usr/bin/env python3
"""Module for index_range function"""


def index_range(page, page_size):
    """Calculate the start and end index for a given page and page size"""
    max_content = page * page_size
    return (max_content - page_size, max_content)

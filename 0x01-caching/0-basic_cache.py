#!/usr/bin/env python3
"""Module for Class BasicCache"""

BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """Class for a basic caching system"""

    def __init__(self):
        """Initialize"""
        super().__init__()

    def put(self, key, item):
        """Add an item in the cache"""
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """Get an item from the cache"""
        if key is None or key not in self.cache_data.keys():
            return None
        return self.cache_data[key]

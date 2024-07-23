#!/usr/bin/env python3
"""Module for Class LRUCache"""

from collections import OrderedDict
BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """Class for a basic caching system"""

    def __init__(self):
        """Initialize"""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Add an item in the cache"""
        if key is None or item is None:
            return

        if key in self.cache_data:
            self.cache_data[key] = item
            self.cache_data.move_to_end(key)
        else:
            self.cache_data[key] = item

        if len(self.cache_data) > self.MAX_ITEMS:
            lru_key = next(iter(self.cache_data))
            self.cache_data.pop(lru_key)
            print(f"DISCARD: {lru_key}")

    def get(self, key):
        """Get an item from the cache"""
        if key is None or key not in self.cache_data.keys():
            return None
        self.cache_data.move_to_end(key)
        return self.cache_data[key]

// src/search/catalog.js

import catalogData from "../data/catalog.json";

export function getCatalog() {
  return catalogData.products;
}
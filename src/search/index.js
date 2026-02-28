// src/search/index.js

import { searchSimilarProducts } from "./searchEngine";

export function search(queryEmbedding, topK = 5) {
  return searchSimilarProducts(queryEmbedding, topK);
}
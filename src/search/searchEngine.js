// src/search/searchEngine.js

import { getCatalog } from "./catalog";
import { cosineSimilarity } from "./similarity";
import { rankResults } from "./ranking";

export function searchSimilarProducts(queryEmbedding, topK = 5, threshold = 0) {
  const startTime = performance.now();

  if (!queryEmbedding || !Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
    console.warn("[Search] Invalid query embedding");
    return [];
  }

  const catalog = getCatalog();

  if (!catalog || catalog.length === 0) {
    console.warn("[Search] Empty catalog");
    return [];
  }

  const results = catalog.map(product => {
    const similarity = cosineSimilarity(queryEmbedding, product.embedding);

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      similarity,
      confidence: Math.round(Math.max(0, Math.min(100, similarity * 100)))
    };
  });

  const filtered = results.filter(r => r.similarity >= threshold);
  const ranked = rankResults(filtered, topK);

  const endTime = performance.now();
  console.log(`[Search] Completed in ${(endTime - startTime).toFixed(2)}ms`);

  return ranked;
}
/**
 * Calculate cosine similarity between two normalized vectors
 * Since vectors are already L2 normalized, cosine similarity = dot product
 * @param {number[]} vectorA - First normalized embedding
 * @param {number[]} vectorB - Second normalized embedding
 * @returns {number} Similarity score between 0 and 1 (higher = more similar)
 */
export function cosineSimilarity(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  // For normalized vectors: cosine_similarity = dot_product
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  
  return dotProduct;
}

/**
 * Find top K most similar items from catalog
 * @param {number[]} queryEmbedding - Query image embedding
 * @param {Array<{embedding: number[], ...}>} catalog - Catalog items with embeddings
 * @param {number} topK - Number of results to return
 * @returns {Array<{item: Object, similarity: number}>} Top K similar items
 */
export function findTopSimilar(queryEmbedding, catalog, topK = 10) {
  // Calculate similarity for each catalog item
  const results = catalog.map(item => ({
    item,
    similarity: cosineSimilarity(queryEmbedding, item.embedding)
  }));

  // Sort by similarity (descending) and return top K
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

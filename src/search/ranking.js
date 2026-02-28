// src/search/ranking.js

export function rankResults(results, topK = 10) {
  const validResults = results.filter(r => r && isFinite(r.similarity));
  
  const sorted = [...validResults].sort((a, b) => b.similarity - a.similarity);
  
  const k = Math.min(Math.max(1, topK), sorted.length);
  
  return sorted.slice(0, k);
}
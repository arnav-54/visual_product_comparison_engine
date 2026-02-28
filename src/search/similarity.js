export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || !Array.isArray(vecA) || !Array.isArray(vecB)) {
    return 0;
  }

  if (vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    
    if (!isFinite(a) || !isFinite(b)) {
      return 0;
    }
    
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0 || !isFinite(normA) || !isFinite(normB)) {
    return 0;
  }

  const similarity = dot / (normA * normB);
  
  if (!isFinite(similarity)) {
    return 0;
  }

  return Math.max(-1, Math.min(1, similarity));
}
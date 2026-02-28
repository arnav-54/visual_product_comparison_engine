/**
 * Normalize vector using L2 normalization
 * Formula: normalized_vector = vector / ||vector||
 * where ||vector|| is the Euclidean norm (L2 norm)
 * @param {number[]} vector - Input vector
 * @returns {number[]} L2 normalized vector
 */
export function normalizeVector(vector) {
  // Calculate L2 norm: sqrt(sum of squared values)
  const norm = Math.sqrt(
    vector.reduce((sum, val) => sum + val * val, 0)
  );

  // Avoid division by zero
  if (norm === 0) {
    return vector;
  }

  // Normalize: divide each element by the norm
  return vector.map(val => val / norm);
}

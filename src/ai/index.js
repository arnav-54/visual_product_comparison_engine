import { getModel } from './modelLoader.js';
import { extractRawEmbedding } from './embeddingExtractor.js';
import { normalizeVector } from './vectorUtils.js';

/**
 * Extract and normalize embedding from image element
 * Main entry point for the AI module
 * @param {HTMLImageElement} imageElement - Image element to process
 * @returns {Promise<number[]>} Normalized 1024-dimensional embedding vector
 */
export async function extractEmbedding(imageElement) {
  try {
    // Ensure model is loaded (singleton pattern ensures it loads only once)
    const model = await getModel();

    // Extract raw embedding from image
    const rawEmbedding = await extractRawEmbedding(model, imageElement);

    // Normalize using L2 normalization for better similarity comparison
    const normalizedEmbedding = normalizeVector(rawEmbedding);

    return normalizedEmbedding;
  } catch (error) {
    console.error('Error extracting embedding:', error);
    throw error;
  }
}

// Export utility functions for advanced use cases
export { normalizeVector } from './vectorUtils.js';
export { getModel } from './modelLoader.js';

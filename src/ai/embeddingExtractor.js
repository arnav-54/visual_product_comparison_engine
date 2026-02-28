import * as tf from '@tensorflow/tfjs';

/**
 * Extract raw embedding vector from image
 * Uses model.infer(image, true) to get embeddings from penultimate layer
 * @param {mobilenet.MobileNet} model - Loaded MobileNet model
 * @param {HTMLImageElement} imageElement - Image element to process
 * @returns {Promise<number[]>} Raw 1024-dimensional embedding vector
 */
export async function extractRawEmbedding(model, imageElement) {
  // tf.tidy() automatically cleans up intermediate tensors to prevent memory leaks
  return tf.tidy(() => {
    // model.infer(image, true) returns embeddings from penultimate layer
    // This gives us a 1024-dimensional feature vector instead of class predictions
    const embeddingTensor = model.infer(imageElement, true);
    
    // Convert tensor to regular JavaScript array
    const embedding = embeddingTensor.arraySync();
    
    // Flatten if needed (MobileNet returns [1, 1024] shape)
    return Array.isArray(embedding[0]) ? embedding[0] : embedding;
  });
}

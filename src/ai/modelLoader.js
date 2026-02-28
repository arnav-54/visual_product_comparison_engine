import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let modelInstance = null;

/**
 * Initialize TensorFlow.js backend and load MobileNet v2
 * Uses singleton pattern to ensure model loads only once
 * @returns {Promise<mobilenet.MobileNet>} Loaded MobileNet model
 */
export async function getModel() {
  if (modelInstance) {
    return modelInstance;
  }

  try {
    // Set WebGL backend for GPU acceleration
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('TensorFlow.js backend initialized:', tf.getBackend());

    // Load MobileNet v2 with alpha 0.5 (faster, smaller model)
    // version: 2, alpha: 0.5 provides good balance of speed and accuracy
    modelInstance = await mobilenet.load({
      version: 2,
      alpha: 0.5,
    });

    console.log('MobileNet v2 loaded successfully');
    return modelInstance;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}

# AI Module Usage Guide

## 📦 Installation

First, install the required dependencies:

```bash
npm install @tensorflow/tfjs @tensorflow-models/mobilenet
```

## ✅ Module Structure

```
src/ai/
├── modelLoader.js       # TensorFlow backend + MobileNet loading
├── embeddingExtractor.js # Raw embedding extraction
├── vectorUtils.js       # L2 normalization
└── index.js            # Main entry point
```

## 🚀 Basic Usage

```javascript
import { extractEmbedding } from './ai';

// In your React component
const handleImageUpload = async (imageElement) => {
  try {
    const embedding = await extractEmbedding(imageElement);
    console.log('Embedding:', embedding);
    console.log('Length:', embedding.length); // Should be 1024
  } catch (error) {
    console.error('Failed to extract embedding:', error);
  }
};
```

## 🧪 Testing in React

### Method 1: Using File Input

```javascript
const img = new Image();
img.onload = async () => {
  const embedding = await extractEmbedding(img);
  console.log(embedding);
};
img.src = URL.createObjectURL(file);
```

### Method 2: Using Image URL

```javascript
const img = new Image();
img.crossOrigin = 'anonymous'; // If loading from external URL
img.onload = async () => {
  const embedding = await extractEmbedding(img);
  console.log(embedding);
};
img.src = 'path/to/image.jpg';
```

### Method 3: Using useRef

```javascript
import { useRef } from 'react';

function MyComponent() {
  const imgRef = useRef(null);

  const handleExtract = async () => {
    if (imgRef.current) {
      const embedding = await extractEmbedding(imgRef.current);
      console.log(embedding);
    }
  };

  return (
    <>
      <img ref={imgRef} src="image.jpg" alt="Product" />
      <button onClick={handleExtract}>Extract Embedding</button>
    </>
  );
}
```

## ⚠️ Common Mistakes to Avoid

### 1. **Not waiting for image to load**
```javascript
// ❌ WRONG
const img = new Image();
img.src = url;
const embedding = await extractEmbedding(img); // Image not loaded yet!

// ✅ CORRECT
const img = new Image();
img.onload = async () => {
  const embedding = await extractEmbedding(img);
};
img.src = url;
```

### 2. **Calling extractEmbedding multiple times unnecessarily**
```javascript
// ❌ WRONG - Model loads on first call, but still inefficient
for (let img of images) {
  await extractEmbedding(img); // Sequential, slow
}

// ✅ CORRECT - Parallel processing
const embeddings = await Promise.all(
  images.map(img => extractEmbedding(img))
);
```

### 3. **Not handling errors**
```javascript
// ❌ WRONG
const embedding = await extractEmbedding(img);

// ✅ CORRECT
try {
  const embedding = await extractEmbedding(img);
} catch (error) {
  console.error('Embedding extraction failed:', error);
  // Handle error appropriately
}
```

### 4. **Forgetting to revoke object URLs**
```javascript
// ❌ WRONG - Memory leak
const url = URL.createObjectURL(file);
img.src = url;

// ✅ CORRECT
const url = URL.createObjectURL(file);
img.onload = async () => {
  await extractEmbedding(img);
  URL.revokeObjectURL(url); // Clean up
};
img.src = url;
```

### 5. **Using wrong image format**
```javascript
// ❌ WRONG - Canvas or Blob
const embedding = await extractEmbedding(canvas); // Won't work

// ✅ CORRECT - HTMLImageElement
const img = new Image();
img.src = canvas.toDataURL();
img.onload = async () => {
  const embedding = await extractEmbedding(img);
};
```

## 📊 Expected Output

### Embedding Characteristics:
- **Length**: Exactly 1024 dimensions
- **Type**: Array of numbers (Float32)
- **Range**: Typically between -1 and 1 (after normalization)
- **L2 Norm**: Should be approximately 1.0 (normalized vector)

### Example Output:
```javascript
[
  0.0234, -0.0567, 0.0891, ..., 0.0123  // 1024 values
]
```

### Verification:
```javascript
const embedding = await extractEmbedding(img);

console.log('Length:', embedding.length); // 1024
console.log('Type:', typeof embedding[0]); // 'number'

// Check L2 norm (should be ~1.0)
const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
console.log('L2 Norm:', norm); // ~1.0
```

## 🔍 Debugging Tips

### 1. Check if model loaded
```javascript
import { getModel } from './ai';

const model = await getModel();
console.log('Model loaded:', model);
```

### 2. Check TensorFlow backend
```javascript
import * as tf from '@tensorflow/tfjs';

console.log('Backend:', tf.getBackend()); // Should be 'webgl'
console.log('Memory:', tf.memory()); // Check for memory leaks
```

### 3. Monitor performance
```javascript
console.time('embedding-extraction');
const embedding = await extractEmbedding(img);
console.timeEnd('embedding-extraction'); // Should be < 500ms
```

## 🎯 Performance Tips

1. **Model loads only once** - First call takes ~2-3 seconds, subsequent calls are fast
2. **Expected latency**: 100-500ms per image (after model load)
3. **Memory usage**: ~150MB peak (model + inference)
4. **Batch processing**: Process multiple images in parallel for better throughput

## 🔗 Integration with Similarity Search

```javascript
// Calculate cosine similarity between two embeddings
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  return dotProduct; // Already normalized, so this is cosine similarity
}

// Example usage
const queryEmbedding = await extractEmbedding(queryImage);
const catalogEmbeddings = await Promise.all(
  catalogImages.map(img => extractEmbedding(img))
);

const similarities = catalogEmbeddings.map(catEmb => 
  cosineSimilarity(queryEmbedding, catEmb)
);

// Sort by similarity (descending)
const sortedIndices = similarities
  .map((sim, idx) => ({ sim, idx }))
  .sort((a, b) => b.sim - a.sim)
  .map(item => item.idx);
```

## 📝 Notes

- The model uses **MobileNet v2** with **alpha 0.5** for optimal browser performance
- Embeddings are **L2 normalized** for consistent similarity comparison
- **WebGL backend** is used for GPU acceleration
- **tf.tidy()** prevents memory leaks by auto-disposing intermediate tensors
- Model is loaded **once** using singleton pattern for efficiency

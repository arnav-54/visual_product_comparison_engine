# AI Module - Quick Reference

## 📁 Files Created

```
src/ai/
├── modelLoader.js          # TensorFlow + MobileNet initialization
├── embeddingExtractor.js   # Raw embedding extraction
├── vectorUtils.js          # L2 normalization
├── similarityUtils.js      # Cosine similarity calculation
└── index.js               # Main entry point

src/
├── EmbeddingTest.jsx      # Test component (example)
└── AI_MODULE_GUIDE.md     # Detailed documentation
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install @tensorflow/tfjs @tensorflow-models/mobilenet
```

### 2. Basic Usage
```javascript
import { extractEmbedding } from './ai';

const img = new Image();
img.onload = async () => {
  const embedding = await extractEmbedding(img);
  console.log('Embedding:', embedding.length); // 1024
};
img.src = 'path/to/image.jpg';
```

### 3. Similarity Search
```javascript
import { extractEmbedding } from './ai';
import { findTopSimilar } from './ai/similarityUtils';

// Extract query embedding
const queryEmbedding = await extractEmbedding(queryImage);

// Find similar products
const results = findTopSimilar(queryEmbedding, catalog, 10);
console.log('Top 10 similar products:', results);
```

## ✅ Key Features

- ✅ **Fully client-side** - No backend required
- ✅ **WebGL accelerated** - GPU-powered inference
- ✅ **Memory efficient** - tf.tidy() prevents leaks
- ✅ **Singleton pattern** - Model loads only once
- ✅ **1024-dim embeddings** - Rich feature vectors
- ✅ **L2 normalized** - Ready for similarity comparison
- ✅ **Fast inference** - <500ms per image

## 📊 Expected Output

```javascript
{
  embedding: [0.0234, -0.0567, ...], // 1024 numbers
  length: 1024,
  normalized: true,
  l2Norm: ~1.0
}
```

## ⚠️ Common Mistakes

1. ❌ Not waiting for image.onload
2. ❌ Forgetting try-catch blocks
3. ❌ Not revoking object URLs
4. ❌ Using canvas instead of HTMLImageElement
5. ❌ Sequential processing (use Promise.all)

## 🔧 Debugging

```javascript
// Check backend
import * as tf from '@tensorflow/tfjs';
console.log('Backend:', tf.getBackend()); // 'webgl'

// Check memory
console.log('Memory:', tf.memory());

// Measure performance
console.time('extract');
await extractEmbedding(img);
console.timeEnd('extract'); // ~100-500ms
```

## 📈 Performance

- **First call**: ~2-3 seconds (model loading)
- **Subsequent calls**: ~100-500ms per image
- **Memory usage**: ~150MB peak
- **Recommended**: Process images in parallel

## 🎯 Next Steps

1. Integrate into your UI components
2. Create product catalog with pre-computed embeddings
3. Implement similarity search UI
4. Add loading states and error handling
5. Test with real product images

## 📚 Resources

- TensorFlow.js: https://www.tensorflow.org/js
- MobileNet: https://github.com/tensorflow/tfjs-models/tree/master/mobilenet
- Full Guide: See `AI_MODULE_GUIDE.md`

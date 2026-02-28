# Prompt for Search Module Developer

## 🎯 Your Task

You are building the **Visual Similarity Search** functionality for the Visual Product Comparison Engine. The AI module is already complete and working. Your job is to create the search interface and similarity comparison logic.

---

## 📦 What You Have (Already Working)

### AI Module (Complete ✅)
```javascript
import { extractEmbedding } from './ai';
import { cosineSimilarity, findTopSimilar } from './ai/similarityUtils';

// Extract embedding from any image
const embedding = await extractEmbedding(imageElement);
// Returns: Array of 1280 numbers (normalized, L2 norm = 1.0)
```

### Test Results (Verified ✅)
- ✅ Model loads successfully (MobileNet v2, alpha 0.5)
- ✅ WebGL backend active (GPU acceleration)
- ✅ Embedding extraction works: 1280 dimensions
- ✅ L2 normalization applied: norm = 1.0
- ✅ Ready for similarity comparison

---

## 🎯 What You Need to Build

### 1. Product Catalog with Pre-computed Embeddings

**File**: `src/data/catalog.json`

```json
{
  "products": [
    {
      "id": "prod_001",
      "name": "Nike Air Max 270",
      "category": "Running Shoes",
      "brand": "Nike",
      "price": 150,
      "image": "/assets/products/nike_air_max_270.jpg",
      "embedding": [0.0234, -0.0567, 0.0891, ..., 0.0123]
    },
    {
      "id": "prod_002",
      "name": "Adidas Ultraboost",
      "category": "Running Shoes",
      "brand": "Adidas",
      "price": 180,
      "image": "/assets/products/adidas_ultraboost.jpg",
      "embedding": [0.0156, -0.0234, 0.0678, ..., 0.0089]
    }
    // ... 150-200 products
  ]
}
```

**Important**: Each product must have a pre-computed 1280-dimensional embedding array.

---

### 2. Image Upload Component

**File**: `src/components/ImageUploader.jsx`

**Requirements**:
- Drag-and-drop support
- File input fallback
- Image preview
- Loading state during embedding extraction
- Error handling
- Accept: JPEG, PNG, WebP
- Max size: 5MB

**Expected Flow**:
```
User uploads image → Preview shown → Extract embedding → Trigger search
```

---

### 3. Similarity Search Engine

**File**: `src/utils/searchEngine.js`

**Core Function**:
```javascript
/**
 * Search for similar products
 * @param {number[]} queryEmbedding - 1280-dim embedding from uploaded image
 * @param {Array} catalog - Product catalog with embeddings
 * @param {number} topK - Number of results (default: 10)
 * @returns {Array} Top K similar products with similarity scores
 */
export function searchSimilarProducts(queryEmbedding, catalog, topK = 10) {
  // 1. Calculate cosine similarity for each product
  // 2. Sort by similarity (descending)
  // 3. Return top K results
  // 4. Include similarity score (0-1 range)
}
```

**Cosine Similarity Formula** (already implemented in `ai/similarityUtils.js`):
```javascript
// For normalized vectors: cosine_similarity = dot_product
similarity = sum(queryEmbedding[i] * catalogEmbedding[i])
```

**Expected Output**:
```javascript
[
  {
    product: { id: "prod_042", name: "Nike Air Max", ... },
    similarity: 0.9234  // 92.34% similar
  },
  {
    product: { id: "prod_015", name: "Adidas Ultraboost", ... },
    similarity: 0.8876  // 88.76% similar
  },
  // ... top 10 results
]
```

---

### 4. Results Display Component

**File**: `src/components/ResultsGrid.jsx`

**Requirements**:
- Display top 10 similar products
- Show product image, name, category, brand, price
- Display similarity percentage (e.g., "92% Match")
- Responsive grid layout (3-4 columns desktop, 1-2 mobile)
- Visual similarity indicator (progress bar or badge)
- Sort by similarity (highest first)

**UI Elements**:
```
┌─────────────────────────────────────┐
│  [Product Image]                    │
│  Nike Air Max 270                   │
│  Running Shoes • Nike               │
│  $150                               │
│  ████████████░░ 92% Match           │
└─────────────────────────────────────┘
```

---

### 5. Main Search Page

**File**: `src/pages/SearchPage.jsx` or update `src/App.jsx`

**Layout**:
```
┌─────────────────────────────────────────────┐
│  Visual Product Comparison Engine           │
├─────────────────────────────────────────────┤
│                                             │
│  [Drag & Drop or Click to Upload]          │
│  [Image Preview if uploaded]                │
│                                             │
├─────────────────────────────────────────────┤
│  Similar Products (10 results)              │
│                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │ 1  │ │ 2  │ │ 3  │ │ 4  │              │
│  └────┘ └────┘ └────┘ └────┘              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │ 5  │ │ 6  │ │ 7  │ │ 8  │              │
│  └────┘ └────┘ └────┘ └────┘              │
│  ┌────┐ ┌────┐                             │
│  │ 9  │ │ 10 │                             │
│  └────┘ └────┘                             │
└─────────────────────────────────────────────┘
```

---

## 🔧 Implementation Steps

### Step 1: Create Product Catalog
```bash
# Create catalog with embeddings
src/data/catalog.json
```

**How to generate embeddings for catalog**:
```javascript
// Script: scripts/generateCatalog.js
import { extractEmbedding } from '../src/ai';

const products = [
  { id: 'prod_001', name: 'Nike Air Max', image: 'path/to/image.jpg' },
  // ... more products
];

for (const product of products) {
  const img = new Image();
  img.src = product.image;
  img.onload = async () => {
    const embedding = await extractEmbedding(img);
    product.embedding = embedding;
  };
}

// Save to catalog.json
```

### Step 2: Build Image Uploader
```javascript
// src/components/ImageUploader.jsx
- Drag & drop zone
- File input
- Image preview
- Call extractEmbedding(img)
- Pass embedding to search function
```

### Step 3: Implement Search Logic
```javascript
// src/utils/searchEngine.js
import { cosineSimilarity } from '../ai/similarityUtils';
import catalog from '../data/catalog.json';

export function searchSimilarProducts(queryEmbedding, topK = 10) {
  const results = catalog.products.map(product => ({
    product,
    similarity: cosineSimilarity(queryEmbedding, product.embedding)
  }));
  
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}
```

### Step 4: Display Results
```javascript
// src/components/ResultsGrid.jsx
- Map over search results
- Display product cards
- Show similarity percentage
- Responsive grid layout
```

### Step 5: Connect Everything
```javascript
// src/App.jsx
const [results, setResults] = useState([]);

const handleImageUpload = async (imageElement) => {
  const embedding = await extractEmbedding(imageElement);
  const searchResults = searchSimilarProducts(embedding, 10);
  setResults(searchResults);
};
```

---

## 📊 Expected Data Flow

```
User uploads image
    ↓
ImageUploader component
    ↓
extractEmbedding(img) → [1280 numbers]
    ↓
searchSimilarProducts(embedding, catalog)
    ↓
Calculate similarity for each product
    ↓
Sort by similarity (highest first)
    ↓
Return top 10 results
    ↓
ResultsGrid displays products
```

---

## 🎨 UI/UX Requirements

### Loading States
- ⏳ "Loading model..." (first time only, 2-3 seconds)
- ⏳ "Extracting features..." (100-500ms per image)
- ⏳ "Finding similar products..." (instant, <50ms)

### Error Handling
- ❌ Invalid file format
- ❌ File too large (>5MB)
- ❌ Model loading failed
- ❌ Embedding extraction failed

### Success States
- ✅ Image uploaded successfully
- ✅ Found 10 similar products
- ✅ Display similarity scores

---

## 🧪 Testing Checklist

- [ ] Upload image and see results
- [ ] Verify similarity scores (0-1 range)
- [ ] Check results are sorted (highest similarity first)
- [ ] Test with different product categories
- [ ] Verify responsive layout (mobile/desktop)
- [ ] Test drag & drop functionality
- [ ] Test error handling (invalid files)
- [ ] Check loading states display correctly
- [ ] Verify similarity percentages are accurate
- [ ] Test with 150-200 products in catalog

---

## 📝 Key Technical Details

### Embedding Specifications
- **Dimensions**: 1280 (not 1024!)
- **Type**: Array of numbers (Float32)
- **Range**: -1 to 1 (normalized)
- **L2 Norm**: 1.0 (verified)

### Similarity Score Interpretation
- **0.9 - 1.0**: Very similar (90-100% match)
- **0.7 - 0.9**: Similar (70-90% match)
- **0.5 - 0.7**: Somewhat similar (50-70% match)
- **< 0.5**: Not similar (<50% match)

### Performance Expectations
- **First image**: 2-3 seconds (model loading)
- **Subsequent images**: 100-500ms (extraction only)
- **Search**: <50ms (for 200 products)
- **Total**: ~500ms per search (after first load)

---

## 🚀 Bonus Features (Optional)

1. **Filter by category** (Running Shoes, Sneakers, Boots, etc.)
2. **Filter by brand** (Nike, Adidas, Puma, etc.)
3. **Price range filter** ($0-$50, $50-$100, etc.)
4. **Similarity threshold slider** (show only >70% matches)
5. **Batch upload** (compare multiple images)
6. **Save search history** (localStorage)
7. **Export results** (JSON/CSV download)
8. **Share results** (generate shareable link)

---

## 📚 Resources Available

### AI Module (Already Complete)
- `src/ai/index.js` - Main entry point
- `src/ai/modelLoader.js` - Model loading
- `src/ai/embeddingExtractor.js` - Embedding extraction
- `src/ai/vectorUtils.js` - L2 normalization
- `src/ai/similarityUtils.js` - Cosine similarity

### Documentation
- `AI_MODULE_GUIDE.md` - Comprehensive AI module guide
- `AI_QUICK_REFERENCE.md` - Quick reference
- `src/AIModuleTest.jsx` - Working test example

### Test Data
- `src/assets/shoe.jpg` - Test image (verified working)
- Embedding extracted: 1280 dimensions, L2 norm = 1.0

---

## ✅ Success Criteria

Your search module is complete when:

1. ✅ User can upload an image (drag & drop or file input)
2. ✅ System extracts embedding from uploaded image
3. ✅ System compares against product catalog
4. ✅ Top 10 similar products are displayed
5. ✅ Similarity scores are shown (percentage)
6. ✅ Results are sorted by similarity (highest first)
7. ✅ UI is responsive and user-friendly
8. ✅ Loading states and errors are handled
9. ✅ Works with 150-200 products in catalog
10. ✅ Search completes in <1 second (after model load)

---

## 🎯 Final Notes

- **AI module is 100% ready** - Focus only on search UI/UX
- **Embeddings are 1280-dimensional** - Not 1024!
- **Use provided similarity functions** - Already optimized
- **Test with real product images** - Verify accuracy
- **Keep it simple** - This is a hackathon MVP
- **Performance is good** - No optimization needed yet

Good luck! 🚀

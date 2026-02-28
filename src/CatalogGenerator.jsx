import { useState } from 'react';
import { extractEmbedding } from './ai';

/**
 * Catalog Embedding Generator
 * Use this to generate real 1280-dimensional embeddings for your product catalog
 */
function CatalogGenerator() {
  const [products, setProducts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    setProcessing(true);
    const newProducts = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentIndex(i + 1);

      try {
        const img = new Image();
        const imageUrl = URL.createObjectURL(file);

        await new Promise((resolve, reject) => {
          img.onload = async () => {
            try {
              const embedding = await extractEmbedding(img);
              
              const product = {
                id: `shoe_${String(i + 1).padStart(3, '0')}`,
                name: file.name.replace(/\.[^/.]+$/, ''),
                category: 'Shoes',
                image: `/assets/shoes/${file.name}`,
                embedding: embedding
              };

              newProducts.push(product);
              console.log(`✅ Processed ${i + 1}/${files.length}: ${file.name}`);
              
              URL.revokeObjectURL(imageUrl);
              resolve();
            } catch (err) {
              console.error(`❌ Failed to process ${file.name}:`, err);
              reject(err);
            }
          };

          img.onerror = () => {
            reject(new Error(`Failed to load ${file.name}`));
          };

          img.src = imageUrl;
        });
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
      }
    }

    setProducts(newProducts);
    setProcessing(false);
    setCurrentIndex(0);
  };

  const downloadCatalog = () => {
    const catalog = {
      products: products
    };

    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalog.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📦 Catalog Embedding Generator</h1>
      
      <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Instructions:</h3>
        <ol style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>Select multiple product images (JPEG/PNG)</li>
          <li>Wait for embeddings to be generated (1280 dimensions each)</li>
          <li>Download the generated catalog.json</li>
          <li>Replace <code>src/data/catalog.json</code> with the downloaded file</li>
        </ol>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        disabled={processing}
        style={{
          padding: '15px',
          fontSize: '16px',
          marginBottom: '20px',
          display: 'block',
          width: '100%',
          border: '2px dashed #2196F3',
          borderRadius: '8px',
          cursor: processing ? 'not-allowed' : 'pointer'
        }}
      />

      {processing && (
        <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ margin: 0, color: '#e65100' }}>
            ⏳ Processing image {currentIndex}... Please wait.
          </p>
        </div>
      )}

      {products.length > 0 && !processing && (
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Generated {products.length} Products</h3>
          
          <div style={{ maxHeight: '300px', overflow: 'auto', marginBottom: '20px' }}>
            {products.map((product, idx) => (
              <div key={product.id} style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '4px', marginBottom: '8px' }}>
                <strong>#{idx + 1}</strong> {product.name}
                <br />
                <small style={{ color: '#666' }}>
                  ID: {product.id} • Embedding: {product.embedding.length} dimensions
                </small>
              </div>
            ))}
          </div>

          <button
            onClick={downloadCatalog}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            📥 Download catalog.json
          </button>
        </div>
      )}

      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '14px' }}>
        <strong>Note:</strong> Each embedding is 1280 dimensions. The generated JSON file will be large 
        (~1-2MB for 150-200 products). This is normal and expected.
      </div>
    </div>
  );
}

export default CatalogGenerator;

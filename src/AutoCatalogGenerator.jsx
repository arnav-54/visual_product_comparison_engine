import { useState } from 'react';
import { extractEmbedding } from './ai';

function AutoCatalogGenerator() {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState({ current: 0, total: 37 });
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState(null);

  // Import all shoe images
  const shoeImages = import.meta.glob('./assets/shoes/shoe*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' });
  const imageUrls = Object.entries(shoeImages).map(([path, url]) => ({
    path,
    url,
    name: path.split('/').pop().replace(/\.[^/.]+$/, '')
  }));

  const generateCatalog = async () => {
    setStatus('processing');
    setError(null);
    const products = [];

    try {
      for (let i = 0; i < imageUrls.length; i++) {
        const { url, name } = imageUrls[i];
        setProgress({ current: i + 1, total: imageUrls.length });

        try {
          const img = new Image();
          
          await new Promise((resolve, reject) => {
            img.onload = async () => {
              try {
                console.log(`Processing ${i + 1}/${imageUrls.length}: ${name}`);
                const embedding = await extractEmbedding(img);
                
                products.push({
                  id: `shoe_${String(i + 1).padStart(3, '0')}`,
                  name: name.replace('shoe', 'Shoe '),
                  category: 'Footwear',
                  brand: 'Various',
                  image: `/assets/shoes/${name}.${url.split('.').pop()}`,
                  embedding: Array.from(embedding)
                });

                console.log(`✅ ${name}: ${embedding.length} dimensions`);
                resolve();
              } catch (err) {
                console.error(`❌ Failed to extract embedding for ${name}:`, err);
                reject(err);
              }
            };

            img.onerror = () => reject(new Error(`Failed to load ${name}`));
            img.crossOrigin = 'anonymous';
            img.src = url;
          });

        } catch (err) {
          console.error(`Error processing ${name}:`, err);
        }
      }

      const catalogData = { products };
      setCatalog(catalogData);
      setStatus('complete');
      console.log('✅ Catalog generation complete!', catalogData);

    } catch (err) {
      console.error('❌ Catalog generation failed:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  const downloadCatalog = () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalog.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCatalog = () => {
    navigator.clipboard.writeText(JSON.stringify(catalog, null, 2));
    alert('Catalog JSON copied to clipboard!');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>🏭 Auto Catalog Generator</h1>
      
      <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Found {imageUrls.length} shoe images</h3>
        <p>Click "Generate Catalog" to extract embeddings for all shoes</p>
      </div>

      <button
        onClick={generateCatalog}
        disabled={status === 'processing'}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: status === 'processing' ? '#ccc' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: status === 'processing' ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
          width: '100%'
        }}
      >
        {status === 'processing' 
          ? `⏳ Processing ${progress.current}/${progress.total}...` 
          : status === 'complete'
          ? '✅ Catalog Generated!'
          : '▶️ Generate Catalog'}
      </button>

      {status === 'processing' && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            width: '100%', 
            height: '30px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '15px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(progress.current / progress.total) * 100}%`,
              height: '100%',
              backgroundColor: '#4CAF50',
              transition: 'width 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {Math.round((progress.current / progress.total) * 100)}%
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
            This may take 2-3 minutes... Check console for details
          </p>
        </div>
      )}

      {error && (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#c62828', marginTop: 0 }}>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {status === 'complete' && catalog && (
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <h3 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Catalog Generated Successfully!</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Products:</strong> {catalog.products.length}</p>
            <p><strong>Embedding Dimensions:</strong> {catalog.products[0]?.embedding.length}</p>
            <p><strong>File Size:</strong> ~{Math.round(JSON.stringify(catalog).length / 1024)}KB</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={downloadCatalog}
              style={{
                flex: 1,
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              📥 Download catalog.json
            </button>

            <button
              onClick={copyCatalog}
              style={{
                flex: 1,
                padding: '12px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#FF9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              📋 Copy to Clipboard
            </button>
          </div>

          <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '6px', fontSize: '14px' }}>
            <strong>Next Steps:</strong>
            <ol style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Download the catalog.json file</li>
              <li>Replace <code>src/data/catalog.json</code> with the downloaded file</li>
              <li>Switch to IntegratedTest component to test search</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoCatalogGenerator;

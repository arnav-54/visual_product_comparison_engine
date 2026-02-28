import { useState } from 'react';
import { extractEmbedding } from './ai';
import { search } from './search';
import shoeImage from './assets/shoe.jpg';

function IntegratedTest() {
  const [status, setStatus] = useState('idle');
  const [embedding, setEmbedding] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [timings, setTimings] = useState({});

  const runIntegratedTest = async () => {
    setStatus('running');
    setError(null);
    const timings = {};

    try {
      // Step 1: Extract embedding from test image
      console.log('🔍 Step 1: Extracting embedding from image...');
      const t1 = performance.now();
      
      const img = new Image();
      
      img.onload = async () => {
        try {
          const embeddingVector = await extractEmbedding(img);
          const t2 = performance.now();
          timings.embedding = (t2 - t1).toFixed(2);
          
          console.log('✅ Embedding extracted:', {
            length: embeddingVector.length,
            first5: embeddingVector.slice(0, 5),
            time: timings.embedding + 'ms'
          });
          
          setEmbedding(embeddingVector);

          // Step 2: Search for similar products
          console.log('🔍 Step 2: Searching for similar products...');
          const t3 = performance.now();
          
          const results = search(embeddingVector, 5);
          
          const t4 = performance.now();
          timings.search = (t4 - t3).toFixed(2);
          timings.total = (t4 - t1).toFixed(2);
          
          console.log('✅ Search completed:', {
            resultsCount: results.length,
            time: timings.search + 'ms',
            results
          });
          
          setSearchResults(results);
          setTimings(timings);
          setStatus('success');
          
        } catch (err) {
          console.error('❌ Error:', err);
          setError(err.message);
          setStatus('error');
        }
      };

      img.onerror = () => {
        setError('Failed to load test image');
        setStatus('error');
      };

      img.src = shoeImage;
      
    } catch (err) {
      console.error('❌ Test failed:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>🔬 AI + Search Integration Test</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Test Flow:</h3>
        <ol style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>Extract 1280-dim embedding from test image using AI module</li>
          <li>Search catalog using extracted embedding</li>
          <li>Display top 5 similar products with similarity scores</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <img 
          src={shoeImage} 
          alt="Test shoe" 
          style={{ maxWidth: '300px', border: '2px solid #ddd', borderRadius: '8px' }}
        />
        <p style={{ fontSize: '14px', color: '#666' }}>Test Image: shoe.jpg</p>
      </div>

      <button 
        onClick={runIntegratedTest}
        disabled={status === 'running'}
        style={{
          padding: '15px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: status === 'running' ? '#ccc' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: status === 'running' ? 'not-allowed' : 'pointer',
          marginBottom: '30px'
        }}
      >
        {status === 'running' ? '⏳ Running Test...' : '▶️ Run Integration Test'}
      </button>

      {status === 'running' && (
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ margin: 0, color: '#1976d2' }}>⏳ Processing... Check console for details</p>
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#c62828', marginTop: 0 }}>❌ Error</h3>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {status === 'success' && embedding && (
        <div style={{ marginBottom: '30px' }}>
          <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Step 1: Embedding Extracted</h3>
            <div style={{ textAlign: 'left' }}>
              <p><strong>Dimensions:</strong> {embedding.length}</p>
              <p><strong>Time:</strong> {timings.embedding}ms</p>
              <p><strong>L2 Norm:</strong> {Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)).toFixed(6)}</p>
              <p><strong>Sample values:</strong></p>
              <code style={{ display: 'block', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
                [{embedding.slice(0, 10).map(v => v.toFixed(4)).join(', ')}, ...]
              </code>
            </div>
          </div>

          {searchResults && (
            <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <h3 style={{ color: '#1976d2', marginTop: 0 }}>✅ Step 2: Search Results</h3>
              <div style={{ textAlign: 'left' }}>
                <p><strong>Results Found:</strong> {searchResults.length}</p>
                <p><strong>Search Time:</strong> {timings.search}ms</p>
                <p><strong>Total Time:</strong> {timings.total}ms</p>
                
                {searchResults.length > 0 ? (
                  <div style={{ marginTop: '20px' }}>
                    <h4>Top {searchResults.length} Similar Products:</h4>
                    {searchResults.map((result, idx) => (
                      <div 
                        key={result.id} 
                        style={{ 
                          padding: '15px', 
                          backgroundColor: '#fff', 
                          borderRadius: '6px', 
                          marginBottom: '10px',
                          border: '1px solid #ddd'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>#{idx + 1} {result.name}</strong>
                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                              {result.category} • ID: {result.id}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              fontSize: '20px', 
                              fontWeight: 'bold', 
                              color: result.confidence > 70 ? '#2e7d32' : result.confidence > 50 ? '#f57c00' : '#666'
                            }}>
                              {result.confidence}%
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              similarity: {result.similarity.toFixed(4)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '6px', marginTop: '15px' }}>
                    <p style={{ margin: 0, color: '#e65100' }}>
                      ⚠️ No results found. The catalog may have incompatible embeddings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
        <h4 style={{ marginTop: 0, color: '#c62828' }}>❌ CRITICAL ISSUE: Dimension Mismatch</h4>
        <div style={{ fontSize: '14px', lineHeight: '1.8', textAlign: 'left' }}>
          <p><strong>Problem:</strong></p>
          <ul>
            <li>Your AI extracts: <strong>1280-dimensional</strong> embeddings</li>
            <li>Current catalog has: <strong>4-dimensional</strong> mock embeddings</li>
            <li>Result: Search will fail or give meaningless results</li>
          </ul>
          
          <p><strong>Solution:</strong></p>
          <ol>
            <li>Use <code>CatalogGenerator</code> component to generate real embeddings</li>
            <li>Upload your product images (150-200 images)</li>
            <li>Download the generated catalog.json</li>
            <li>Replace <code>src/data/catalog.json</code></li>
          </ol>

          <p><strong>Quick Fix for Testing:</strong></p>
          <p>The integration code works! Just needs real catalog data with 1280 dimensions.</p>
        </div>
      </div>
    </div>
  );
}

export default IntegratedTest;

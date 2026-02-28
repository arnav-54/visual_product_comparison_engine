import { useState, useEffect } from 'react';
import { extractEmbedding } from './ai';
import shoeImage from './assets/shoe.jpg';

function AIModuleTest() {
  const [status, setStatus] = useState('idle');
  const [embedding, setEmbedding] = useState(null);
  const [error, setError] = useState(null);
  const [loadTime, setLoadTime] = useState(null);

  const testEmbedding = async () => {
    setStatus('loading');
    setError(null);
    
    const startTime = performance.now();

    try {
      const img = new Image();
      
      img.onload = async () => {
        try {
          console.log('Image loaded, extracting embedding...');
          const embeddingVector = await extractEmbedding(img);
          const endTime = performance.now();
          
          setEmbedding(embeddingVector);
          setLoadTime((endTime - startTime).toFixed(2));
          setStatus('success');
          
          console.log('✅ Embedding extracted successfully!');
          console.log('Length:', embeddingVector.length);
          console.log('First 10 values:', embeddingVector.slice(0, 10));
          console.log('L2 norm:', Math.sqrt(embeddingVector.reduce((s, v) => s + v * v, 0)));
        } catch (err) {
          setError(err.message);
          setStatus('error');
          console.error('❌ Embedding extraction failed:', err);
        }
      };

      img.onerror = () => {
        setError('Failed to load image');
        setStatus('error');
      };

      img.src = shoeImage;
    } catch (err) {
      setError(err.message);
      setStatus('error');
      console.error('❌ Test failed:', err);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🧪 AI Module Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <img 
          src={shoeImage} 
          alt="Test shoe" 
          style={{ maxWidth: '300px', border: '2px solid #ddd', borderRadius: '8px' }}
        />
      </div>

      <button 
        onClick={testEmbedding}
        disabled={status === 'loading'}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: status === 'loading' ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer'
        }}
      >
        {status === 'loading' ? 'Extracting...' : 'Test Embedding Extraction'}
      </button>

      {status === 'loading' && (
        <div style={{ marginTop: '20px', color: '#2196F3' }}>
          <p>⏳ Loading model and extracting embedding...</p>
          <p style={{ fontSize: '14px' }}>First run may take 2-3 seconds</p>
        </div>
      )}

      {status === 'error' && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <p style={{ color: '#c62828', margin: 0 }}>❌ Error: {error}</p>
        </div>
      )}

      {status === 'success' && embedding && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', textAlign: 'left' }}>
          <h3 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Success!</h3>
          <p><strong>Embedding Length:</strong> {embedding.length} dimensions</p>
          <p><strong>Extraction Time:</strong> {loadTime}ms</p>
          <p><strong>L2 Norm:</strong> {Math.sqrt(embedding.reduce((s, v) => s + v * v, 0)).toFixed(6)}</p>
          <p><strong>First 5 values:</strong></p>
          <code style={{ display: 'block', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', fontSize: '12px' }}>
            [{embedding.slice(0, 5).map(v => v.toFixed(6)).join(', ')}, ...]
          </code>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#555' }}>
            ✓ Check browser console for full output
          </p>
        </div>
      )}
    </div>
  );
}

export default AIModuleTest;

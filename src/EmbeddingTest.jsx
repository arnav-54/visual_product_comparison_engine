import { useState } from 'react';
import { extractEmbedding } from './ai';

/**
 * Example component showing how to use the AI module
 * This is for testing purposes - integrate into your actual UI
 */
function EmbeddingTest() {
  const [embedding, setEmbedding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Create image element from uploaded file
      const img = new Image();
      const imageUrl = URL.createObjectURL(file);

      img.onload = async () => {
        try {
          // Extract embedding
          const embeddingVector = await extractEmbedding(img);
          
          console.log('Embedding extracted:', embeddingVector);
          console.log('Embedding length:', embeddingVector.length);
          console.log('First 10 values:', embeddingVector.slice(0, 10));
          
          setEmbedding(embeddingVector);
          setLoading(false);
          
          // Clean up
          URL.revokeObjectURL(imageUrl);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      img.onerror = () => {
        setError('Failed to load image');
        setLoading(false);
      };

      img.src = imageUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Embedding Extraction Test</h2>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
        disabled={loading}
      />

      {loading && <p>Extracting embedding...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {embedding && (
        <div>
          <p>✅ Embedding extracted successfully!</p>
          <p>Length: {embedding.length} dimensions</p>
          <p>First 5 values: {embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default EmbeddingTest;

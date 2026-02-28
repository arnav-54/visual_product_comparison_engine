import { useState } from 'react';
import { extractEmbedding } from './ai';
import { search } from './search';
import './App.css';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      const img = new Image();
      
      img.onload = async () => {
        try {
          console.log('🔍 Extracting embedding...');
          const embedding = await extractEmbedding(img);
          console.log('✅ Embedding extracted:', embedding.length, 'dimensions');

          console.log('🔍 Searching for similar products...');
          const searchResults = search(embedding, 10);
          console.log('✅ Found', searchResults.length, 'results');

          setResults(searchResults);
          setLoading(false);
          URL.revokeObjectURL(imageUrl);
        } catch (err) {
          console.error('❌ Error:', err);
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
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>👟 Visual Product Search</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
        Upload a shoe image to find visually similar products
      </p>

      {/* Upload Section */}
      <div style={{ 
        border: '3px dashed #2196F3', 
        borderRadius: '12px', 
        padding: '40px', 
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        marginBottom: '40px'
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={loading}
          style={{ display: 'none' }}
          id="imageUpload"
        />
        <label 
          htmlFor="imageUpload" 
          style={{ 
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'inline-block'
          }}
        >
          <div style={{
            padding: '20px 40px',
            backgroundColor: loading ? '#ccc' : '#2196F3',
            color: 'white',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            {loading ? '⏳ Processing...' : '📤 Upload Image'}
          </div>
        </label>

        {uploadedImage && (
          <div style={{ marginTop: '20px' }}>
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              style={{ 
                maxWidth: '300px', 
                maxHeight: '300px',
                borderRadius: '8px',
                border: '2px solid #ddd'
              }} 
            />
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, color: '#1976d2', fontSize: '16px' }}>
            🔍 Analyzing image and finding similar products...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffebee', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, color: '#c62828' }}>❌ Error: {error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !loading && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>
            🎯 Found {results.length} Similar Products
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {results.map((result, idx) => (
              <div 
                key={result.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  padding: '15px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Rank Badge */}
                <div style={{
                  position: 'relative',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    zIndex: 1
                  }}>
                    #{idx + 1}
                  </div>
                  
                  <img 
                    src={result.image} 
                    alt={result.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5'
                    }}
                  />
                </div>

                {/* Product Info */}
                <h3 style={{ 
                  margin: '10px 0 5px 0', 
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {result.name}
                </h3>
                
                <p style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '14px', 
                  color: '#666' 
                }}>
                  {result.category}
                </p>

                {/* Similarity Score */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      Similarity
                    </span>
                    <span style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: result.confidence > 70 ? '#4CAF50' : result.confidence > 50 ? '#FF9800' : '#666'
                    }}>
                      {result.confidence}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${result.confidence}%`,
                      height: '100%',
                      backgroundColor: result.confidence > 70 ? '#4CAF50' : result.confidence > 50 ? '#FF9800' : '#666',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && !loading && !error && uploadedImage && (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            No similar products found. Try uploading a different image.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;

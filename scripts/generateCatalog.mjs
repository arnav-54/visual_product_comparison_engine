/**
 * Generate catalog.json with embeddings for all shoe images
 * Run: node scripts/generateCatalog.mjs
 */

import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SHOES_DIR = join(__dirname, '../src/assets/shoes');
const OUTPUT_FILE = join(__dirname, '../src/data/catalog.json');

async function generateCatalog() {
  console.log('🚀 Loading MobileNet v2...');
  const model = await mobilenet.load({ version: 2, alpha: 0.5 });
  console.log('✅ Model loaded\n');

  const shoeFiles = readdirSync(SHOES_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
    .sort();

  console.log(`📦 Found ${shoeFiles.length} shoe images\n`);

  const products = [];

  for (let i = 0; i < shoeFiles.length; i++) {
    const filename = shoeFiles[i];
    const filepath = join(SHOES_DIR, filename);
    
    try {
      console.log(`[${i + 1}/${shoeFiles.length}] Processing ${filename}...`);
      
      const imageBuffer = readFileSync(filepath);
      const tfimage = tf.node.decodeImage(imageBuffer, 3);
      
      const embedding = model.infer(tfimage, true);
      const embeddingArray = await embedding.array();
      const flatEmbedding = embeddingArray.flat();
      
      const norm = Math.sqrt(flatEmbedding.reduce((sum, val) => sum + val * val, 0));
      const normalized = flatEmbedding.map(val => val / norm);
      
      products.push({
        id: `shoe_${String(i + 1).padStart(3, '0')}`,
        name: filename.replace(/\.[^/.]+$/, '').replace(/shoe(\d+)/, 'Shoe $1'),
        category: 'Footwear',
        brand: 'Various',
        image: `/assets/shoes/${filename}`,
        embedding: normalized
      });
      
      console.log(`✅ ${filename}: ${normalized.length} dimensions\n`);
      
      tfimage.dispose();
      embedding.dispose();
      
    } catch (error) {
      console.error(`❌ Failed to process ${filename}:`, error.message, '\n');
    }
  }

  const catalog = { products };
  writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2));
  
  console.log(`\n✅ Catalog generated!`);
  console.log(`📁 ${OUTPUT_FILE}`);
  console.log(`📊 ${products.length} products`);
  console.log(`📏 ${products[0]?.embedding.length} dimensions`);
}

generateCatalog().catch(console.error);

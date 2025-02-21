import fetch from "node-fetch";
import fs from "fs/promises";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const cardImagesDir = join(rootDir, 'public', 'card_images');

async function ensureDirectoryExists() {
  try {
    await fs.access(cardImagesDir);
  } catch {
    await fs.mkdir(cardImagesDir, { recursive: true });
  }
}

async function downloadCardImage(cardId) {
  try {
    const imagePath = join(cardImagesDir, `${cardId}.jpg`);
    
    // Check if image already exists
    try {
      await fs.access(imagePath);
      console.log(`Image for card ${cardId} already exists`);
      return true;
    } catch {
      // Image doesn't exist, continue with download
    }

    // Fetch image from YGOPRODeck API
    const response = await fetch(`https://images.ygoprodeck.com/images/cards/${cardId}.jpg`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image for card ${cardId}`);
    }

    const buffer = await response.buffer();
    await fs.writeFile(imagePath, buffer);

    console.log(`Successfully downloaded image for card ${cardId}`);
    return true;
  } catch (error) {
    console.error(`Error downloading image for card ${cardId}:`, error);
    return false;
  }
}

async function migrateCards() {
  try {
    await ensureDirectoryExists();
    
    const response = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
    if (!response.ok) throw new Error(`Failed to fetch card data. Status: ${response.status}`);
    const data = await response.json();
    const cards = data.data;

    console.log(`Fetched ${cards.length} cards from YGOPRODeck`);

    const batchSize = 10;
    for (let i = 0; i < cards.length; i += batchSize) {
      const batch = cards.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(cards.length / batchSize)}`);

      for (const card of batch) {
        await downloadCardImage(card.id);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration error:", err);
  }
}

migrateCards();

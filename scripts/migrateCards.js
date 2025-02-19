import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load .env.local file
dotenv.config({ path: join(rootDir, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadCardImage(cardId) {
  try {
    // Check if image already exists
    const { data: existingFile } = await supabase
      .storage
      .from('yugioh_spreadsheet_maker_cards')
      .list('', {
        search: `${cardId}.jpg`
      });

    if (existingFile && existingFile.length > 0) {
      console.log(`Image for card ${cardId} already exists in storage`);
      return true;
    }

    // Fetch image from YGOPRODeck API
    const response = await fetch(`https://images.ygoprodeck.com/images/cards/${cardId}.jpg`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image for card ${cardId}`);
    }

    const buffer = await response.buffer();
    
    // Upload to Supabase
    const { error } = await supabase
      .storage
      .from('yugioh_spreadsheet_maker_cards')
      .upload(`${cardId}.jpg`, buffer, {
        contentType: 'image/jpeg'
      });

    if (error) {
      throw error;
    }

    console.log(`Successfully uploaded image for card ${cardId}`);
    return true;
  } catch (error) {
    console.error(`Error uploading image for card ${cardId}:`, error);
    return false;
  }
}

async function migrateCards() {
  try {
    const response = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
    if (!response.ok) throw new Error(`Failed to fetch card data. Status: ${response.status}`);
    const data = await response.json();
    const cards = data.data;

    console.log(`Fetched ${cards.length} cards from YGOPRODeck`);

    const { data: existingCards, error: fetchError } = await supabase
      .from("cards")
      .select("id");

    if (fetchError) throw fetchError;

    const existingIds = new Set(existingCards?.map(card => card.id) || []);
    const newCards = cards.filter(card => !existingIds.has(card.id));

    console.log(`Found ${newCards.length} new cards to add`);

    const batchSize = 10;
    for (let i = 0; i < newCards.length; i += batchSize) {
      const batch = newCards.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(newCards.length / batchSize)}`);

      for (const card of batch) {
        // Upload image to Supabase storage
        await uploadCardImage(card.id);

        const { error } = await supabase
          .from("cards")
          .insert([{
            id: card.id,
            name: card.name,
            type: card.type,
            description: card.desc,
            card_data: card,
            image_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/yugioh_spreadsheet_maker_cards/${card.id}.jpg`,
          }]);

        if (error) {
          console.error(`Error inserting card ${card.id}:`, error);
        } else {
          console.log(`Processed card ${card.id}: ${card.name}`);
        }
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

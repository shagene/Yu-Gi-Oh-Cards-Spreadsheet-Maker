import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadMissingCardImage(cardId: number) {
  try {
    // Check if image already exists
    const { data: existingFile } = await supabase
      .storage
      .from('yugioh_spreadsheet_maker_cards')
      .list('', {
        search: `${cardId}.jpg`
      });

    if (existingFile && existingFile.length > 0) {
      return true;
    }

    // Fetch image from YGOPRODeck API
    const response = await fetch(`https://images.ygoprodeck.com/images/cards/${cardId}.jpg`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image for card ${cardId}`);
    }

    const blob = await response.blob();
    const file = new File([blob], `${cardId}.jpg`, { type: 'image/jpeg' });

    // Upload to Supabase
    const { error } = await supabase
      .storage
      .from('yugioh_spreadsheet_maker_cards')
      .upload(`${cardId}.jpg`, file);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`Error uploading image for card ${cardId}:`, error);
    return false;
  }
}

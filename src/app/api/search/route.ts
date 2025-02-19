import { NextResponse } from 'next/server';
import type { Card } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  console.log('Search query:', query);

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}`;
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log('API response:', data);

    if (!data.data) {
      console.log('No data in response');
      return NextResponse.json([]);
    }

    // Transform the YGOPRODeck response to match our Card type
    const cards: Card[] = data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      type: card.type,
      description: card.desc,
      card_data: JSON.stringify(card),
      image_url: card.card_images?.[0]?.image_url ?? ''
    }));

    console.log('Transformed cards:', cards.length);
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([]);
  }
}

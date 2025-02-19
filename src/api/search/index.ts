import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

type Card = {
  id: number;
  name: string;
  type: string;
  description: string;
  card_data: string; // stored as JSON string
  image_url: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`) as unknown as { data: Card[]; error: Error };

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    let errorMessage = 'Unknown error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

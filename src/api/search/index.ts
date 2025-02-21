import { NextResponse } from 'next/server';

type Card = {
  id: number;
  name: string;
  type: string;
  description: string;
  card_data: string;
  image_url: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const data: Card[] = [];
    
    return NextResponse.json(data);
  } catch (err: unknown) {
    let errorMessage = 'Unknown error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

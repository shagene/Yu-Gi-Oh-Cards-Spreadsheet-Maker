import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CardPage({ params }: { params: { id: string } }) {
  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !card) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col items-center">
            <Image
              src={card.image_url}
              alt={card.name}
              width={300}
              height={440}
              className="rounded-lg shadow-lg mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{card.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{card.type}</p>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p>{card.description}</p>
            </div>
            {card.card_data && (
              <div className="mt-6 w-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Card Details</h2>
                <pre className="bg-gray-50 rounded-lg p-4 overflow-auto">
                  {JSON.stringify(JSON.parse(card.card_data), null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

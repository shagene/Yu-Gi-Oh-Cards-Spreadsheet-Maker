import Image from 'next/image';
import { Card } from '../types';
import { Button } from './Button';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

interface CardGridProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  failedImages: Set<number>;
  setFailedImages: (callback: (prev: Set<number>) => Set<number>) => void;
}

export function CardGrid({ cards, onCardClick, failedImages, setFailedImages }: CardGridProps) {
  const [visibleCards, setVisibleCards] = useState<Card[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const batchSize = 20;

  useEffect(() => {
    console.log('CardGrid received cards:', cards.length);
    setVisibleCards(cards.slice(0, batchSize));
  }, [cards]);

  useEffect(() => {
    console.log('Visible cards updated:', visibleCards.length);
    if (!loadMoreRef.current || !cards.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCards.length < cards.length) {
          console.log('Loading more cards:', visibleCards.length, 'to', Math.min(visibleCards.length + batchSize, cards.length));
          setVisibleCards(prev => [
            ...prev,
            ...cards.slice(prev.length, prev.length + batchSize)
          ]);
        }
      },
      {
        rootMargin: '50px',
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [cards, visibleCards.length, batchSize]);

  return (
    <>
      <ul role="list" className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 mt-4">
        {visibleCards.map((card) => (
          <li key={card.id} className="relative">
            <div className="group aspect-[2/3] overflow-hidden rounded-lg">
              <Image
                src={failedImages.has(card.id)
                  ? 'https://dummyimage.com/96x140/000/fff'
                  : card.image_url}
                alt={card.name}
                width={96}
                height={140}
                className="h-full w-full object-contain object-center"
                loading="lazy"
                onError={() => setFailedImages(prev => new Set([...prev, card.id]))}
              />
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(card);
                }}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/70 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200"
              >
                <span className="text-gray-900 dark:text-white text-sm font-medium">Add to Step</span>
              </div>
            </div>
            <p className="pointer-events-none mt-1 block truncate text-xs font-medium text-gray-900 dark:text-white">
              {card.name}
            </p>
            <p className="pointer-events-none block text-xs font-medium text-gray-400 dark:text-gray-500">
              {card.type}
            </p>
          </li>
        ))}
      </ul>
      {visibleCards.length < cards.length && (
        <div ref={loadMoreRef} className="h-10 w-full" />
      )}
    </>
  );
}
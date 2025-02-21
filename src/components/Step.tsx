import Image from 'next/image';
import { Step as StepType } from '../types';
import { Button } from './Button';
import { ArrowUpIcon, ArrowDownIcon, DocumentDuplicateIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

interface StepProps {
  step: StepType;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onNoteChange: (note: string) => void;
  onMoveCard: (cardIndex: number, direction: 'left' | 'right') => void;
  onDeleteCard: (cardIndex: number) => void;
  onMoveStep: (direction: 'up' | 'down') => void;
  onDuplicate: () => void;
  onDelete: () => void;
  failedImages: Set<number>;
  setFailedImages: (callback: (prev: Set<number>) => Set<number>) => void;
}

export function Step({
  step,
  index,
  isSelected,
  onSelect,
  onNoteChange,
  onMoveCard,
  onDeleteCard,
  onMoveStep,
  onDuplicate,
  onDelete,
  failedImages,
  setFailedImages,
}: StepProps) {
  return (
    <div
      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
        isSelected ? 'border-white ring-2 ring-blue-500' : 'border-gray-600'
      }`}
      onClick={onSelect}
    >
      <div className="mb-4">
        <div className="sm:col-span-4">
          <label htmlFor={`step-${index}-title`} className="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Step {index + 1}
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white/5 dark:bg-black/5 px-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
              <input
                id={`step-${index}-title`}
                type="text"
                value={step.note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Click to add title..."
                className="block w-full bg-transparent py-1.5 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {step.cards.map((card, cardIndex) => (
          <div key={cardIndex} className="group relative">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
              <Image
                src={failedImages.has(card.id)
                  ? 'https://dummyimage.com/96x140/000/fff'
                  : `/card_images/${card.id}.jpg`}
                alt={card.name}
                width={100}
                height={146}
                className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                onError={() => {
                  // If local image fails, try YGOPRODeck as fallback
                  const img = document.createElement('img');
                  img.src = `https://images.ygoprodeck.com/images/cards/${card.id}.jpg`;
                  img.onload = () => {
                    const imgElement = document.querySelector(`img[alt="${card.name}"]`) as HTMLImageElement;
                    if (imgElement) {
                      imgElement.src = img.src;
                    }
                  };
                  img.onerror = () => {
                    setFailedImages(prev => new Set([...prev, card.id]));
                  };
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCard(cardIndex, 'left');
                    }}
                    className="rounded-full bg-white/20 p-1.5 text-white shadow-sm hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <ArrowLeftIcon className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveCard(cardIndex, 'right');
                    }}
                    className="rounded-full bg-white/20 p-1.5 text-white shadow-sm hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <ArrowRightIcon className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCard(cardIndex);
                    }}
                    className="rounded-full bg-red-500/20 p-1.5 text-white shadow-sm hover:bg-red-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <TrashIcon className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <p className="pointer-events-none block truncate text-sm font-medium text-gray-900 dark:text-white">
                {card.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={() => onMoveStep('up')}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-100 dark:bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-white shadow-xs hover:bg-gray-200 dark:hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <ArrowUpIcon className="size-4" aria-hidden="true" />
          Move Above
        </button>
        <button
          type="button"
          onClick={() => onMoveStep('down')}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-100 dark:bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-white shadow-xs hover:bg-gray-200 dark:hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <ArrowDownIcon className="size-4" aria-hidden="true" />
          Move Below
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-100 dark:bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-white shadow-xs hover:bg-gray-200 dark:hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <DocumentDuplicateIcon className="size-4" aria-hidden="true" />
          Duplicate
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-red-50 dark:bg-red-500/10 px-2.5 py-1.5 text-sm font-semibold text-red-700 dark:text-red-500 shadow-xs hover:bg-red-100 dark:hover:bg-red-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
        >
          <TrashIcon className="size-4" aria-hidden="true" />
          Delete
        </button>
      </div>
    </div>
  );
}

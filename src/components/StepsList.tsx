import { Step as StepComponent } from './Step'
import { Card, Step } from '../types'

interface StepsListProps {
  steps: Step[]
  selectedStep: number | null
  onSelect: (index: number) => void
  onNoteChange: (index: number, note: string) => void
  onMoveCard: (stepIndex: number, cardIndex: number, direction: 'left' | 'right') => void
  onDeleteCard: (stepIndex: number, cardIndex: number) => void
  onMoveStep: (index: number, direction: 'up' | 'down') => void
  onDuplicate: (index: number) => void
  onDelete: (index: number) => void
  failedImages: Set<number>
  setFailedImages: (callback: (prev: Set<number>) => Set<number>) => void
}

export function StepsList({
  steps,
  selectedStep,
  onSelect,
  onNoteChange,
  onMoveCard,
  onDeleteCard,
  onMoveStep,
  onDuplicate,
  onDelete,
  failedImages,
  setFailedImages,
}: StepsListProps) {
  if (steps.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          No cards added yet. Click the Import button to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${
            steps.length % 2 !== 0 && index === steps.length - 1
              ? 'sm:col-span-2'
              : ''
          }`}
        >
          <StepComponent
            step={step}
            index={index}
            isSelected={selectedStep === index}
            onSelect={() => onSelect(index)}
            onNoteChange={(note) => onNoteChange(index, note)}
            onMoveCard={(cardIndex, direction) => onMoveCard(index, cardIndex, direction)}
            onDeleteCard={(cardIndex) => onDeleteCard(index, cardIndex)}
            onMoveStep={(direction) => onMoveStep(index, direction)}
            onDuplicate={() => onDuplicate(index)}
            onDelete={() => onDelete(index)}
            failedImages={failedImages}
            setFailedImages={setFailedImages}
          />
        </div>
      ))}
    </div>
  )
}
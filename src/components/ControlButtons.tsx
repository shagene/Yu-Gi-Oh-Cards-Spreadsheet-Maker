import { Button } from './Button'
import {
  PrinterIcon,
  DocumentArrowDownIcon,
  ArrowUpOnSquareIcon,
} from '@heroicons/react/20/solid'
import { Step } from '../types'

interface ControlButtonsProps {
  steps: Step[]
  exportSteps: () => void
  importSteps: (e: React.ChangeEvent<HTMLInputElement>) => void
  printSteps: () => void
}

export function ControlButtons({
  steps,
  exportSteps,
  importSteps,
  printSteps,
}: ControlButtonsProps) {
  return (
    <div className="flex justify-center gap-4 control-buttons">
      <Button
        variant="primary"
        onClick={exportSteps}
        className="inline-flex items-center gap-2"
      >
        <DocumentArrowDownIcon className="h-5 w-5" />
        Export
      </Button>
      <label className="cursor-pointer">
        <div
          role="button"
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-sm ring-gray-300 ring-inset hover:bg-gray-50"
        >
          <ArrowUpOnSquareIcon className="h-5 w-5" />
          Import
        </div>
        <input
          type="file"
          className="hidden"
          accept=".json"
          onChange={importSteps}
        />
      </label>
      <Button
        variant="primary"
        onClick={printSteps}
        className="inline-flex items-center gap-2"
      >
        <PrinterIcon className="h-5 w-5" />
        Print Steps
      </Button>
    </div>
  )
}
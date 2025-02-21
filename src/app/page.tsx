'use client'

import { useState, useEffect, useCallback } from 'react'
import { SearchBar } from '../components/SearchBar'
import { CardGrid } from '../components/CardGrid'
import { Step as StepComponent } from '../components/Step'
import { Card, Step } from '../types'
import { Button } from '../components/Button'
import {
  PlusIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  ArrowUpOnSquareIcon,
} from '@heroicons/react/20/solid'
import { StepsList } from '../components/StepsList'

export default function Home() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)

  // Steps management
  const [steps, setSteps] = useState<Step[]>([])
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  // Search function calling YGOPRODeck API directly
  const searchCards = async (query: string) => {
    if (!query.trim()) {
      console.log('Empty search query, clearing results')
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      console.log('Fetching results for:', query)
      // Search by name first
      const nameApiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(query)}`
      console.log('Name API URL:', nameApiUrl)

      const nameRes = await fetch(nameApiUrl)
      console.log('Name search response status:', nameRes.status)

      if (!nameRes.ok) {
        console.error('Name search failed:', nameRes.status, nameRes.statusText)
        throw new Error('Search failed')
      }

      const nameData = await nameRes.json()
      
      // Search by description
      const descApiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?desc=${encodeURIComponent(query)}`
      console.log('Description API URL:', descApiUrl)

      const descRes = await fetch(descApiUrl)
      console.log('Description search response status:', descRes.status)

      let descData = { data: [] }
      if (descRes.ok) {
        descData = await descRes.json()
      }

      // Combine and deduplicate results
      const allCards = [...(nameData.data || []), ...(descData.data || [])]
      const uniqueCards = new Map()
      
      allCards.forEach((card: any) => {
        if (!uniqueCards.has(card.id)) {
          uniqueCards.set(card.id, {
            id: card.id,
            name: card.name,
            type: card.type,
            description: card.desc,
            card_data: JSON.stringify(card),
            image_url: card.card_images?.[0]?.image_url ?? '',
          })
        }
      })

      const cards = Array.from(uniqueCards.values())
      console.log('Transformed cards:', cards.length)
      setSearchResults(cards)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  // Handle search input changes
  useEffect(() => {
    console.log('Search query changed:', searchQuery)

    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        console.log('Executing search for:', searchQuery)
        searchCards(searchQuery)
      } else {
        console.log('Clearing search results')
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Step functions
  const createStep = () => {
    setSteps((prev) => [...prev, { note: '', cards: [] }])
  }

  const addCardToStep = (card: Card) => {
    console.log('Adding card:', card.name, 'to step:', selectedStep)
    if (selectedStep === null) {
      alert('Please select a step first!')
      return
    }
    setSteps((prev) => {
      console.log('Previous step cards:', prev[selectedStep].cards.length)
      const newSteps = prev.map((step, index) =>
        index === selectedStep
          ? { ...step, cards: [...step.cards, card] }
          : step,
      )
      console.log('New step cards:', newSteps[selectedStep].cards.length)
      return newSteps
    })
  }

  const updateStepNote = (index: number, note: string) => {
    setSteps((prev) => {
      const newSteps = [...prev]
      newSteps[index].note = note
      return newSteps
    })
  }

  const deleteCard = (stepIndex: number, cardIndex: number) => {
    setSteps((prev) =>
      prev.map((step, idx) =>
        idx === stepIndex
          ? { ...step, cards: step.cards.filter((_, i) => i !== cardIndex) }
          : step,
      ),
    )
  }

  const moveCardLeft = (stepIndex: number, cardIndex: number) => {
    if (cardIndex > 0) {
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx !== stepIndex) return step
          const newCards = [...step.cards]
          const temp = newCards[cardIndex]
          newCards[cardIndex] = newCards[cardIndex - 1]
          newCards[cardIndex - 1] = temp
          return { ...step, cards: newCards }
        }),
      )
    }
  }

  const moveCardRight = (stepIndex: number, cardIndex: number) => {
    setSteps((prev) => {
      const step = prev[stepIndex]
      if (cardIndex >= step.cards.length - 1) return prev

      return prev.map((step, idx) => {
        if (idx !== stepIndex) return step
        const newCards = [...step.cards]
        const temp = newCards[cardIndex]
        newCards[cardIndex] = newCards[cardIndex + 1]
        newCards[cardIndex + 1] = temp
        return { ...step, cards: newCards }
      })
    })
  }

  const moveStepLeft = (index: number) => {
    if (index > 0) {
      setSteps((prev) => {
        const newSteps = [...prev]
        ;[newSteps[index - 1], newSteps[index]] = [
          newSteps[index],
          newSteps[index - 1],
        ]
        return newSteps
      })
    }
  }

  const moveStepRight = (index: number) => {
    setSteps((prev) => {
      const newSteps = [...prev]
      if (index < newSteps.length - 1) {
        ;[newSteps[index], newSteps[index + 1]] = [
          newSteps[index + 1],
          newSteps[index],
        ]
      }
      return newSteps
    })
  }

  const duplicateStep = (index: number) => {
    setSteps((prev) => {
      const newSteps = [...prev]
      const duplicated = JSON.parse(JSON.stringify(newSteps[index]))
      newSteps.splice(index + 1, 0, duplicated)
      return newSteps
    })
  }

  const deleteStep = (index: number) => {
    setSteps((prev) => {
      const newSteps = [...prev]
      newSteps.splice(index, 1)
      if (selectedStep === index) setSelectedStep(null)
      return newSteps
    })
  }

  // Export / Import Steps
  const exportSteps = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(steps, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', 'combo_steps.json')
    downloadAnchor.click()
  }

  const importSteps = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        try {
          const result = ev.target?.result
          if (typeof result === 'string') {
            const importedSteps = JSON.parse(result)
            setSteps(importedSteps)
          }
        } catch (error) {
          console.error('Import failed:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const printSteps = () => {
    window.print()
  }

  return (
    <div className="flex min-h-full flex-col gap-8">
      <SearchBar
        value={searchQuery}
        onChange={(e) => {
          console.log('Search input changed:', e.target.value)
          setSearchQuery(e.target.value)
        }}
      />
      <div className="flex justify-center gap-4">
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
      <div className="max-h-[600px] overflow-y-auto">
        <CardGrid
          cards={searchResults}
          onCardClick={addCardToStep}
          failedImages={failedImages}
          setFailedImages={setFailedImages}
        />
      </div>
      <StepsList
        steps={steps}
        selectedStep={selectedStep}
        onSelect={setSelectedStep}
        onNoteChange={updateStepNote}
        onMoveCard={(stepIndex, cardIndex, direction) => {
          if (direction === 'left') moveCardLeft(stepIndex, cardIndex)
          else moveCardRight(stepIndex, cardIndex)
        }}
        onDeleteCard={deleteCard}
        onMoveStep={(index, direction) => {
          if (direction === 'up') moveStepLeft(index)
          else moveStepRight(index)
        }}
        onDuplicate={duplicateStep}
        onDelete={deleteStep}
        failedImages={failedImages}
        setFailedImages={setFailedImages}
      />
      <div className="flex justify-center">
        <Button
          variant="primary"
          onClick={createStep}
          className="inline-flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Step
        </Button>
      </div>
    </div>
  )
}

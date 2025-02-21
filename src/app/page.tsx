'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '../components/SearchBar'
import { CardGrid } from '../components/CardGrid'
import { Card, Step } from '../types'
import { Button } from '../components/Button'
import {
  PlusIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  ArrowUpOnSquareIcon,
} from '@heroicons/react/20/solid'
import { StepsList } from '../components/StepsList'
import { handlePrint } from '../utils/printUtils'

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
      // Get all cards and filter client-side to match SQL LIKE behavior
      const apiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
      console.log('API URL:', apiUrl)
  
      const response = await fetch(apiUrl)
      console.log('Search response status:', response.status)
  
      let allCards = []
      if (response.ok) {
        const data = await response.json()
        allCards = data.data || []
      }
  
      // Filter results to match SQL LIKE %query% behavior
      const uniqueCards = new Map()
      const queryLower = query.toLowerCase()
      allCards.forEach((card: any) => {
        const nameMatch = card.name.toLowerCase().includes(queryLower)
        const descMatch = card.desc.toLowerCase().includes(queryLower)
        
        if ((nameMatch || descMatch) && !uniqueCards.has(card.id)) {
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
  
  useEffect(() => {
    console.log('Search query changed:', searchQuery);
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        console.log('Executing search for:', searchQuery);
        searchCards(searchQuery);
      } else {
        console.log('Clearing search results');
        setSearchResults([]);
      }
    }, 500); // Debounce to reduce API calls
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  
  // Increase debounce timeout to reduce API calls
  useEffect(() => {
    console.log('Search query changed:', searchQuery);
  
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        console.log('Executing search for:', searchQuery);
        searchCards(searchQuery);
      } else {
        console.log('Clearing search results');
        setSearchResults([]);
      }
    }, 500); // Increased from 300ms to 500ms
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Increase debounce timeout to reduce API calls
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
    }, 500) // Increased from 300ms to 500ms
  
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
  // Update the printSteps function
  const printSteps = () => {
    handlePrint()
  }
  return (
    <div className="flex min-h-full flex-col gap-8">
      <SearchBar
        className="search-bar"
        value={searchQuery}
        onChange={(e) => {
          console.log('Search input changed:', e.target.value)
          setSearchQuery(e.target.value)
        }}
        loading={loading}
      />
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
      <div className="max-h-[600px] overflow-y-auto card-pool">
        <CardGrid
          cards={searchResults}
          onCardClick={addCardToStep}
          failedImages={failedImages}
          setFailedImages={setFailedImages}
        />
      </div>
      <StepsList
        className="steps-list"
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
      <div className="flex justify-center pb-8 add-step-button">
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

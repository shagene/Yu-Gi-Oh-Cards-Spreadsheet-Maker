import { Step } from '../types'

export const handlePrint = () => {
  const style = document.createElement('style')
  style.id = 'print-styles'
  style.innerHTML = `
    @media print {
      /* Hide non-essential elements */
      .search-bar,
      .control-buttons,
      .card-pool,
      .add-step-button {
        display: none !important;
      }

      /* Adjust layout for printing */
      .steps-list {
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Ensure each step starts on a new page */
      .step {
        page-break-inside: avoid;
        margin-bottom: 2rem;
      }
    }
  `
  document.head.appendChild(style)

  // Trigger print
  window.print()

  // Cleanup
  window.addEventListener('afterprint', () => {
    document.getElementById('print-styles')?.remove()
  })
}
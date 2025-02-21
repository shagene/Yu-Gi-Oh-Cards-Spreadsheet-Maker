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
      .add-step-button,
      .theme-toggle,
      button,
      [role="button"],
      .step-footer {
        display: none !important;
      }

      /* Remove borders and styling */
      .step {
        border: none !important;
        box-shadow: none !important;
        padding: 1rem !important;
        margin-bottom: 2rem !important;
        page-break-inside: avoid;
      }

      /* Clean layout */
      .steps-list {
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Adjust card grid */
      .card-grid {
        gap: 1rem !important;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
      }

      /* Hide pagination controls */
      .pagination-controls {
        display: none !important;
      }

      /* Hide footer */
      footer {
        display: none !important;
      }
    }
  `
  document.head.appendChild(style)
  window.print()
  window.addEventListener('afterprint', () => {
    document.getElementById('print-styles')?.remove()
  })
}
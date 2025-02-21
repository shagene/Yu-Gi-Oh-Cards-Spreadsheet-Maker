import { Step } from '../types'

export const handlePrint = () => {
  // Add print-specific styles
  const style = document.createElement('style')
  style.id = 'print-styles'
  style.innerHTML = `
    @media print {
      /* Hide search bar and controls */
      .search-bar,
      .control-buttons,
      .card-pool {
        display: none !important;
      }

      /* Ensure steps are visible */
      .steps-list {
        display: block !important;
        page-break-inside: avoid;
      }

      /* Adjust step layout for printing */
      .step {
        page-break-inside: avoid;
        margin-bottom: 20px;
      }

      /* Remove any fixed positioning */
      .sticky {
        position: static !important;
      }
    }
  `
  document.head.appendChild(style)

  // Trigger print
  window.print()

  // Clean up print styles after printing
  window.addEventListener('afterprint', () => {
    const printStyle = document.getElementById('print-styles')
    if (printStyle) {
      printStyle.remove()
    }
  })
}
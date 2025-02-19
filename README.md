# Yu-Gi-Oh! Cards Spreadsheet Maker

A modern web application for creating and organizing Yu-Gi-Oh! card combinations and exporting them to spreadsheets. Built with Next.js, TypeScript, and TailwindCSS.

## Features

- 🎴 Search and browse Yu-Gi-Oh! cards from the official database
- 📝 Create multiple steps to organize card combinations
- 📊 Export combinations to spreadsheet format
- 💾 Import/Export functionality to save and share combinations
- 🌓 Dark mode support
- 🎨 Modern, responsive UI with TailwindUI components
- ⚡ Fast and efficient card loading with infinite scroll

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/yugioh-maker.git
cd yugioh-maker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
yugioh-maker/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable React components
│   ├── styles/          # Global styles and Tailwind config
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── prisma/             # Database schema (if used)
```

## Key Components

### `page.tsx`
The main application page that handles:
- Card search and filtering
- Step management (create, update, delete)
- Import/Export functionality
- Card grid display

### `CardGrid.tsx`
Displays cards with:
- Infinite scroll loading
- Error handling for failed images
- Card selection interface

### `Step.tsx`
Manages individual steps with:
- Card organization
- Step title editing
- Card removal

### `Layout.tsx`
Provides the application structure with:
- Responsive navigation
- Dark mode support
- Footer content

## Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| NEXT_PUBLIC_YGOPRODECK_API_URL | Yu-Gi-Oh! API endpoint | Yes |
| NEXT_PUBLIC_APP_URL | Application URL | Yes |
| REDIS_URL | Redis cache URL | No |
| CACHE_TTL | Cache time-to-live | No |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [YGOPRODeck](https://db.ygoprodeck.com/api-guide/) for providing the card database API
- [TailwindUI](https://tailwindui.com/) for the design components
- [Next.js](https://nextjs.org/) for the framework

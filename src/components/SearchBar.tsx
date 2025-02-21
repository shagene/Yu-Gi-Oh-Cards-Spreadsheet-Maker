import { ChangeEvent } from 'react';

function SearchIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
    </svg>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
  className?: string;
}

export function SearchBar({ value, onChange, loading, className = '' }: SearchBarProps) {
  return (
    <div className={`mx-auto mt-10 flex max-w-4xl gap-x-4 ${className}`}>
      <div className="group relative flex h-12 w-full">
        <SearchIcon className="pointer-events-none absolute top-0 left-3 h-full w-5 stroke-zinc-500" />
        <input
          id="card-search"
          type="text"
          placeholder="Search for a card..."
          value={value}
          onChange={onChange}
          className="flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none border border-zinc-700/50 rounded-md focus:border-blue-500 placeholder:text-zinc-500 focus:w-full focus:flex-none sm:text-sm dark:text-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700/50 border-t-blue-500 dark:border-zinc-500/50 dark:border-t-blue-400"></div>
          </div>
        )}
      </div>
    </div>
  );
}

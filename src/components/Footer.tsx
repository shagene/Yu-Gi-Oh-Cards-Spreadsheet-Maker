'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'




function PageNavigation() {
  const pathname = usePathname()

  if (!pathname.startsWith('/cards/')) {
    return null
  }
  return null
}

function SmallPrint() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        &copy; Yu-Gi-Oh Cards Spreadsheet Maker. All rights reserved.
      </p>
      <div className="flex gap-4">
        <Link
          href="#"
          className="text-xs text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  )
}


export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <PageNavigation />
      <SmallPrint />
    </footer>
  )
}

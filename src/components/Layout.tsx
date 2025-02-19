'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import Navigation from '@/components/Navigation'
import { type Section, SectionProvider } from '@/components/SectionProvider'
import { ScrollToTop } from '@/components/ScrollToTop'

export function Layout({
  children,
  allSections,
}: {
  children: React.ReactNode
  allSections: Record<string, Array<Section>>
}) {
  let pathname = usePathname()

  return (
    <SectionProvider sections={allSections[pathname] ?? []}>
      <div className="min-h-screen flex">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 xl:w-80 lg:dark:border-white/10">
            <div className="hidden lg:flex lg:pt-4 lg:justify-center">
              <Link href="/" aria-label="Home">
                <Logo className="h-24 w-auto" />
              </Link>
            </div>
            <div className="hidden lg:block lg:mt-4">
              <Navigation className="lg:mt-6" />
            </div>
          </div>
        </motion.header>
        <div className="flex-1 flex flex-col min-h-screen lg:pl-72 xl:pl-80">
          <div className="flex-1">
            <div className="relative flex flex-col px-4 pt-14 sm:px-6 lg:px-8">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </div>
          <Footer />
          <ScrollToTop />
        </div>
      </div>
    </SectionProvider>
  )
}

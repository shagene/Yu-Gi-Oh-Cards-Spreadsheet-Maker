'use client'
import { usePathname } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { type Section, SectionProvider } from '@/components/SectionProvider'
import { ScrollToTop } from '@/components/ScrollToTop'

export function Layout({
  children,
  allSections,
}: {
  children: React.ReactNode
  allSections: Record<string, Array<Section>>
}) {
  const pathname = usePathname()

  return (
    <SectionProvider sections={allSections[pathname] ?? []}>
      <div className="min-h-screen flex flex-col max-w-7xl mx-auto">
  <div className="flex-1">
    <div className="relative flex flex-col px-4 pt-14 sm:px-6 lg:px-8">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  </div>
  <Footer />
  <ScrollToTop />
</div>
    </SectionProvider>
  )
}
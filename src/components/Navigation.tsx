'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'
import { Card } from '@/types'

// Test Supabase connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Immediately test the connection
console.log('Testing Supabase connection...');
Promise.resolve(
  supabase
    .from('cards')
    .select('count', { count: 'exact' })
).then(({ count, error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection successful, total cards:', count);
    }
  })
  .catch(err => {
    console.error('Supabase connection test error:', err);
  });

const CARDS_PER_PAGE = 200

interface NavGroup {
  title: string
  links: Array<{
    title: string
    href: string
  }>
}

function useInitialValue<T>(value: T, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false,
}: {
  href: string
  children: React.ReactNode
  tag?: string
  active?: boolean
  isAnchorLink?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function VisibleSectionHighlight({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    typeof window !== 'undefined'
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0]
    )
  )
  let itemHeight = remToPx(2)
  let height = isPresent ? Math.max(1, visibleSections.length) * itemHeight : itemHeight
  let top =
    isPresent && visibleSections.length > 0
      ? remToPx(2) * firstVisibleSectionIndex
      : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function CardNavigationGroup() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef(new Set<string>());

  const loadMoreCards = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const from = page * CARDS_PER_PAGE;
      const to = from + CARDS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('name')
        .range(from, to);

      if (error) throw error;

      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      // Filter out duplicates and map to typed cards
      const newCards = data.reduce<Card[]>((acc, card) => {
        if (!seenIds.current.has(card.id.toString())) {
          seenIds.current.add(card.id.toString());
          acc.push({
            id: card.id,
            name: card.name,
            type: card.type || '',
            description: card.description || '',
            card_data: card.card_data || {},
            image_url: card.image_url || ''
          });
        }
        return acc;
      }, []);

      if (newCards.length === 0) {
        // If all cards were duplicates, try loading the next page
        setPage(prev => prev + 1);
        return;
      }

      setCards(prev => [...prev, ...newCards]);
      setHasMore(data.length === CARDS_PER_PAGE);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading cards:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // Handle intersection observer
  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      loadMoreCards();
    }
  }, [hasMore, loading, loadMoreCards]);

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { rootMargin: '100px' });
    const currentRef = loadingRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onIntersect]);

  // Initial load
  useEffect(() => {
    loadMoreCards();
  }, []); // Only run once on mount

  if (error) {
    return (
      <div className="text-sm text-red-600 dark:text-red-400 p-4">
        Error loading cards: {error}
      </div>
    );
  }

  const group: NavGroup = {
    title: `Cards (${cards.length}${hasMore ? '+' : ''})`,
    links: cards.map(card => ({
      title: card.name,
      href: `/cards/${card.id}`
    }))
  };

  return (
    <div className="flex flex-col min-h-0 overflow-auto">
      {cards.length > 0 && (
        <>
          <NavigationGroup group={group} />
          <div className="text-xs text-zinc-600 dark:text-zinc-400 px-4 py-1">
            Loaded {cards.length} of 13,566 cards
          </div>
        </>
      )}
      <div
        ref={loadingRef}
        className="py-2 text-center text-sm text-zinc-600 dark:text-zinc-400"
      >
        {loading ? (
          'Loading more cards...'
        ) : hasMore ? (
          'Scroll for more cards'
        ) : (
          `Loaded all ${cards.length} cards`
        )}
      </div>
    </div>
  );
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroup
  className?: string
}) {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [pathname, setPathname] = useState(usePathname())

  useEffect(() => {
    if (!isInsideMobileNavigation) {
      setPathname(window.location.pathname)
    }
  }, [isInsideMobileNavigation])

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {!isInsideMobileNavigation && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {!isInsideMobileNavigation && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === pathname}>
                {link.title}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Navigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">API</TopLevelNavItem>
        <CardNavigationGroup />
      </ul>
    </nav>
  )
}

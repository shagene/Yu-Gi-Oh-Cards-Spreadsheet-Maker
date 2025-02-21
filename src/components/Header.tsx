import { forwardRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { Logo } from './Logo'

export const Header = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(function Header({ className, ...props }, ref) {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  return (
    <motion.div
  {...props}
  ref={ref}
  className={clsx(
    className,
    'flex h-16 items-center relative border-b border-zinc-900/10 bg-white px-4 dark:border-white/10 dark:bg-zinc-900 sm:px-6 lg:px-8',
    !isInsideMobileNavigation && 'backdrop-blur-sm'
  )}
  style={
    {
      '--bg-opacity-light': bgOpacityLight,
      '--bg-opacity-dark': bgOpacityDark,
    } as React.CSSProperties
  }
>
  <div className="absolute left-1/2 -translate-x-1/2">
    <Logo className="h-18 w-auto" />
  </div>
  <div className="ml-auto">
    <ThemeToggle />
  </div>
</motion.div>
  )
})

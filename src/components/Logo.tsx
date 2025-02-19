export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 700 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="yugiohGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#FFD700' }} />
          <stop offset="100%" style={{ stopColor: '#FFA500' }} />
        </linearGradient>
      </defs>
      <path
        d="M40 40L70 25L100 40V70L70 85L40 70V40Z"
        fill="url(#yugiohGradient)"
        className="dark:fill-white"
      />
      <path
        d="M120 50H150L165 80L150 110H120L105 80L120 50Z"
        fill="url(#yugiohGradient)"
        className="dark:fill-white"
      />
      <g style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))' }}>
        <text
          x="180"
          y="85"
          fontSize="56"
          fontWeight="bold"
          fontFamily="sans-serif"
          fill="url(#yugiohGradient)"
          className="dark:fill-white"
        >
          Yu-Gi-Oh! Cards
        </text>
        <text
          x="180"
          y="140"
          fontSize="42"
          fontWeight="semibold"
          fontFamily="sans-serif"
          fill="url(#yugiohGradient)"
          className="dark:fill-white"
        >
          Spreadsheet Maker
        </text>
      </g>
    </svg>
  )
}

'use client'

import { useState } from 'react'

function SicoobLogo({ size = 52 }: { size?: number }) {
  const w = Math.round(size * 1.35)
  return (
    <svg width={w} height={size} viewBox="0 0 135 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="0,0 67,0 34,54" fill="#009E8E" />
      <polygon points="68,0 135,0 101,54" fill="#00725E" />
      <polygon points="34,54 101,54 68,100" fill="#9DC31A" />
    </svg>
  )
}

export default function LogoDisplay({ src }: { src: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3">
        <SicoobLogo size={56} />
        <span className="font-bold text-2xl tracking-wide" style={{ color: '#003641' }}>
          Aracoop
        </span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Logo Sicoob Aracoop"
      className="h-20 object-contain"
      onError={() => setError(true)}
    />
  )
}

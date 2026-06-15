'use client'

import { useState } from 'react'

function FallbackIcon() {
  return (
    <div
      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
      style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    </div>
  )
}

export default function LogoDisplay({ src }: { src: string }) {
  const [error, setError] = useState(false)

  if (error) return <FallbackIcon />

  return (
    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Logo Sicoob Aracoop"
        className="w-16 h-16 object-contain"
        onError={() => setError(true)}
      />
    </div>
  )
}

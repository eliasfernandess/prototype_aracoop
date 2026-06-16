'use client'

import { useEffect, useState } from 'react'

interface Props {
  finalUrl: string
  eventoTitulo: string
  linkTitulo: string
}

export default function EventoRedirect({ finalUrl, eventoTitulo, linkTitulo }: Props) {
  const [count, setCount] = useState(3)
  const safeUrl = /^https?:\/\//i.test(finalUrl) ? finalUrl : `https://${finalUrl}`

  useEffect(() => {
    const safeUrl = /^https?:\/\//i.test(finalUrl) ? finalUrl : `https://${finalUrl}`
    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(interval)
          window.location.href = safeUrl
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [finalUrl])

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(160deg, #004F62 0%, #003641 50%, #001C24 100%)' }}
    >
      <div className="w-full max-w-xs flex flex-col items-center text-center gap-6">

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Sicoob Aracoop" className="h-16 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />

        {/* Evento badge */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs font-medium uppercase tracking-widest">{eventoTitulo}</span>
          <h1 className="text-white font-bold text-2xl leading-tight">{linkTitulo}</h1>
        </div>

        {/* Spinner + countdown */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke="#00B4A0"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (count / 3)}`}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              {count}
            </span>
          </div>
          <p className="text-white/50 text-sm">Redirecionando...</p>
        </div>

        {/* Fallback */}
        <a
          href={safeUrl}
          className="text-[#00B4A0] text-sm underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Clique aqui se não for redirecionado
        </a>

        {/* Footer */}
        <p className="text-white/20 text-xs mt-4">Sicoob Aracoop · {new Date().getFullYear()}</p>
      </div>
    </main>
  )
}

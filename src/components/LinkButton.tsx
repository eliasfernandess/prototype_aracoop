'use client'

import { ICON_MAP } from '@/lib/icons'
import { ChevronRight } from 'lucide-react'

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

interface Props {
  id: number
  titulo: string
  descricao?: string | null
  url: string
  campanha?: string | null
  icone?: string | null
  corIcone?: string | null
}

export default function LinkButton({ id, titulo, descricao, url, campanha, icone, corIcone }: Props) {
  const IconComponent = ICON_MAP[icone ?? 'link'] ?? ICON_MAP['link']
  const iconBg = corIcone ?? '#00B4A0'

  function handleClick() {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'clique_botao', {
        nome_botao: titulo,
        destino: url,
        campanha: campanha ?? 'sem_campanha',
        link_id: id,
      })
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex items-center gap-4 bg-white rounded-2xl shadow-md hover:shadow-lg px-4 py-3.5 transition-all active:scale-[0.98] group"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ background: iconBg }}
      >
        <IconComponent size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm leading-tight">{titulo}</div>
        {descricao && (
          <div className="text-gray-400 text-xs mt-0.5 truncate">{descricao}</div>
        )}
      </div>
      <ChevronRight
        size={16}
        className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors"
      />
    </a>
  )
}

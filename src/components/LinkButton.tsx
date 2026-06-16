'use client'

import { useState } from 'react'
import { ICON_MAP } from '@/lib/icons'
import { MoreVertical, Share2, ExternalLink } from 'lucide-react'
import ShareModal from './ShareModal'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

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
    <>
      <div className="relative flex items-center gap-3 bg-white rounded-2xl shadow-md hover:shadow-lg px-4 py-3.5 transition-all group">
        {/* Main link area */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex items-center gap-4 flex-1 min-w-0"
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
        </a>

        {/* 3-dots button */}
        <button
          onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen) }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
        >
          <MoreVertical size={16} />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-2 top-12 z-20 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[160px]">
              <button
                onClick={() => { setMenuOpen(false); setShareOpen(true) }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Share2 size={14} className="text-gray-400" />
                Compartilhar
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { setMenuOpen(false); handleClick() }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ExternalLink size={14} className="text-gray-400" />
                Abrir link
              </a>
            </div>
          </>
        )}
      </div>

      {shareOpen && (
        <ShareModal
          url={url}
          titulo={titulo}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  )
}

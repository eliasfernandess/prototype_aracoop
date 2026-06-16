'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import ShareModal from './ShareModal'

export default function SharePublicButton() {
  const [open, setOpen] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.origin : 'https://prototype-aracoop.vercel.app'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ background: 'rgba(255,255,255,0.15)' }}
        aria-label="Compartilhar"
      >
        <Share2 size={18} className="text-white" />
      </button>
      {open && (
        <ShareModal
          url={url}
          titulo="Sicoob Aracoop — Links"
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

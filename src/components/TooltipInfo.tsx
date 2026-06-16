'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'

interface Props {
  text: string
}

export default function TooltipInfo({ text }: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        className="text-gray-300 hover:text-[#00B4A0] transition-colors"
        tabIndex={-1}
      >
        <Info size={12} />
      </button>
      {visible && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 z-50 w-56 bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl leading-relaxed pointer-events-none">
          {text}
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </span>
      )}
    </span>
  )
}

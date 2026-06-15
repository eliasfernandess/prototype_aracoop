'use client'

import { Globe, BarChart2, ExternalLink } from 'lucide-react'

export default function AnalisesPage() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análises</h1>
          <p className="text-gray-400 text-sm mt-0.5">Acompanhe os cliques e campanhas em tempo real</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Globe size={15} /> Página pública
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#00B4A0]/10 flex items-center justify-center">
          <BarChart2 size={28} className="text-[#00B4A0]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Análises via Google Analytics 4</h2>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            Os dados de cliques e campanhas são rastreados pelo GA4. Acesse o painel do Google Analytics para ver os relatórios em tempo real.
          </p>
        </div>
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2"
          style={{ background: '#00B4A0' }}
        >
          Abrir Google Analytics
          <ExternalLink size={14} />
        </a>
        <p className="text-xs text-gray-300 mt-1">
          ID configurado: <span className="font-mono">G-48MLYDBJD2</span>
        </p>
      </div>
    </div>
  )
}

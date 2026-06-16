'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Link2, Globe, Pencil, Check, X, Share2 } from 'lucide-react'
import ShareModal from '@/components/ShareModal'
import TooltipInfo from '@/components/TooltipInfo'

interface EventoLink {
  id: number
  titulo: string
  url: string
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmContent?: string | null
  ativo: boolean
  ordem: number
}

interface Evento {
  id: number
  titulo: string
  descricao: string | null
  ativo: boolean
  links: EventoLink[]
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  // Novo evento
  const [showNovoEvento, setShowNovoEvento] = useState(false)
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novoDesc, setNovoDesc] = useState('')
  const [savingEvento, setSavingEvento] = useState(false)

  // Novo link (por evento)
  const [addingLinkTo, setAddingLinkTo] = useState<number | null>(null)
  const [novoLinkTitulo, setNovoLinkTitulo] = useState('')
  const [novoLinkUrl, setNovoLinkUrl] = useState('')
  const [novoLinkUtmSource, setNovoLinkUtmSource] = useState('')
  const [novoLinkUtmMedium, setNovoLinkUtmMedium] = useState('')
  const [novoLinkUtmCampaign, setNovoLinkUtmCampaign] = useState('')
  const [novoLinkUtmContent, setNovoLinkUtmContent] = useState('')
  const [showUtmFields, setShowUtmFields] = useState(false)
  const [savingLink, setSavingLink] = useState(false)

  // Edit evento inline
  const [editingEvento, setEditingEvento] = useState<number | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editDesc, setEditDesc] = useState('')

  // Share modal
  const [shareLink, setShareLink] = useState<EventoLink | null>(null)

  const fetchEventos = useCallback(async () => {
    const res = await fetch('/api/eventos')
    if (res.ok) setEventos(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchEventos() }, [fetchEventos])

  async function criarEvento() {
    if (!novoTitulo.trim()) return
    setSavingEvento(true)
    const res = await fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: novoTitulo, descricao: novoDesc }),
    })
    if (res.ok) {
      const novo = await res.json()
      setEventos((prev) => [novo, ...prev])
      setExpanded(novo.id)
      setNovoTitulo('')
      setNovoDesc('')
      setShowNovoEvento(false)
    }
    setSavingEvento(false)
  }

  async function salvarEdicaoEvento(id: number) {
    await fetch(`/api/eventos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: editTitulo, descricao: editDesc }),
    })
    setEventos((prev) => prev.map((e) => e.id === id ? { ...e, titulo: editTitulo, descricao: editDesc } : e))
    setEditingEvento(null)
  }

  async function toggleEvento(id: number, ativo: boolean) {
    await fetch(`/api/eventos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !ativo }),
    })
    setEventos((prev) => prev.map((e) => e.id === id ? { ...e, ativo: !ativo } : e))
  }

  async function deletarEvento(id: number) {
    if (!confirm('Excluir este evento e todos os seus links?')) return
    await fetch(`/api/eventos/${id}`, { method: 'DELETE' })
    setEventos((prev) => prev.filter((e) => e.id !== id))
  }

  async function adicionarLink(eventoId: number) {
    if (!novoLinkTitulo.trim() || !novoLinkUrl.trim()) return
    setSavingLink(true)
    const res = await fetch(`/api/eventos/${eventoId}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: novoLinkTitulo,
        url: novoLinkUrl,
        utmSource: novoLinkUtmSource || undefined,
        utmMedium: novoLinkUtmMedium || undefined,
        utmCampaign: novoLinkUtmCampaign || undefined,
        utmContent: novoLinkUtmContent || undefined,
      }),
    })
    if (res.ok) {
      const novoLink = await res.json()
      setEventos((prev) => prev.map((e) => e.id === eventoId ? { ...e, links: [...e.links, novoLink] } : e))
      setNovoLinkTitulo('')
      setNovoLinkUrl('')
      setNovoLinkUtmSource('')
      setNovoLinkUtmMedium('')
      setNovoLinkUtmCampaign('')
      setNovoLinkUtmContent('')
      setShowUtmFields(false)
      setAddingLinkTo(null)
    }
    setSavingLink(false)
  }

  async function deletarLink(eventoId: number, linkId: number) {
    await fetch(`/api/eventos/${eventoId}/links/${linkId}`, { method: 'DELETE' })
    setEventos((prev) => prev.map((e) => e.id === eventoId ? { ...e, links: e.links.filter((l) => l.id !== linkId) } : e))
  }

  async function toggleLink(eventoId: number, link: EventoLink) {
    await fetch(`/api/eventos/${eventoId}/links/${link.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !link.ativo }),
    })
    setEventos((prev) => prev.map((e) => e.id === eventoId ? { ...e, links: e.links.map((l) => l.id === link.id ? { ...l, ativo: !l.ativo } : l) } : e))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-400 text-sm mt-0.5">Agrupe links de divulgação por evento</p>
        </div>
        <button
          onClick={() => setShowNovoEvento(true)}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          style={{ background: '#00B4A0' }}
        >
          <Plus size={16} />
          Novo evento
        </button>
      </div>

      {/* Form novo evento */}
      {showNovoEvento && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">Novo Evento</h3>
          <div className="flex flex-col gap-3">
            <input
              autoFocus
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && criarEvento()}
              placeholder="Nome do evento *"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4A0] focus:border-transparent"
            />
            <input
              value={novoDesc}
              onChange={(e) => setNovoDesc(e.target.value)}
              placeholder="Descrição (opcional)"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4A0] focus:border-transparent"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowNovoEvento(false); setNovoTitulo(''); setNovoDesc('') }} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl">
                Cancelar
              </button>
              <button
                onClick={criarEvento}
                disabled={savingEvento || !novoTitulo.trim()}
                className="px-4 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-50"
                style={{ background: '#00B4A0' }}
              >
                {savingEvento ? 'Criando...' : 'Criar evento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && eventos.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#00B4A0]/10 flex items-center justify-center mx-auto mb-3">
            <Globe size={24} className="text-[#00B4A0]" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Nenhum evento criado</p>
          <p className="text-gray-400 text-xs mt-1">Crie um evento para agrupar links de divulgação</p>
        </div>
      )}

      {/* Eventos list */}
      <div className="flex flex-col gap-3">
        {eventos.map((evento) => (
          <div key={evento.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Evento header */}
            <div className="flex items-center gap-4 px-5 py-4">
              {/* Toggle ativo */}
              <button
                onClick={() => toggleEvento(evento.id, evento.ativo)}
                className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                style={{ background: evento.ativo ? '#00B4A0' : '#E5E7EB' }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  style={{ transform: evento.ativo ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>

              {/* Info / edit inline */}
              <div className="flex-1 min-w-0">
                {editingEvento === evento.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editTitulo}
                      onChange={(e) => setEditTitulo(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4A0]"
                    />
                    <button onClick={() => salvarEdicaoEvento(evento.id)} className="text-[#00B4A0]"><Check size={16} /></button>
                    <button onClick={() => setEditingEvento(null)} className="text-gray-400"><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    <div className="font-semibold text-gray-800 text-sm">{evento.titulo}</div>
                    {evento.descricao && <div className="text-gray-400 text-xs mt-0.5 truncate">{evento.descricao}</div>}
                  </>
                )}
              </div>

              {/* Link count badge */}
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
                {evento.links.length} {evento.links.length === 1 ? 'link' : 'links'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => { setEditingEvento(evento.id); setEditTitulo(evento.titulo); setEditDesc(evento.descricao ?? '') }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deletarEvento(evento.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => setExpanded(expanded === evento.id ? null : evento.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  {expanded === evento.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* Links section (expanded) */}
            {expanded === evento.id && (
              <div className="border-t border-gray-100">
                {evento.links.length === 0 && addingLinkTo !== evento.id && (
                  <div className="px-5 py-4 text-sm text-gray-400 text-center">
                    Nenhum link adicionado ainda.
                  </div>
                )}

                {evento.links.map((link, idx) => (
                  <div key={link.id} className={`flex items-center gap-3 px-5 py-3 ${idx < evento.links.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-7 h-7 rounded-lg bg-[#00B4A0]/10 flex items-center justify-center flex-shrink-0">
                      <Link2 size={13} className="text-[#00B4A0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-700 truncate">{link.titulo}</div>
                      <div className="text-xs text-[#00A896] truncate">{link.url}</div>
                    </div>
                    <button
                      onClick={() => toggleLink(evento.id, link)}
                      className="relative w-8 h-4 rounded-full transition-colors flex-shrink-0"
                      style={{ background: link.ativo ? '#00B4A0' : '#E5E7EB' }}
                    >
                      <span
                        className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform"
                        style={{ transform: link.ativo ? 'translateX(16px)' : 'translateX(0)' }}
                      />
                    </button>
                    <button onClick={() => setShareLink(link)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#00B4A0]">
                      <Share2 size={13} />
                    </button>
                    <button onClick={() => deletarLink(evento.id, link.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                {/* Add link form */}
                {addingLinkTo === evento.id ? (
                  <div className="px-5 py-4 border-t border-gray-100 flex flex-col gap-2">
                    <input
                      autoFocus
                      value={novoLinkTitulo}
                      onChange={(e) => setNovoLinkTitulo(e.target.value)}
                      placeholder="Nome do link *"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4A0]"
                    />
                    <input
                      value={novoLinkUrl}
                      onChange={(e) => setNovoLinkUrl(e.target.value)}
                      placeholder="URL (https://...) *"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4A0]"
                    />
                    <button type="button" onClick={() => setShowUtmFields(!showUtmFields)} className="text-xs text-[#00B4A0] flex items-center gap-1">
                      <ChevronDown size={12} style={{ transform: showUtmFields ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      {showUtmFields ? 'Ocultar parâmetros UTM' : 'Adicionar parâmetros UTM (opcional)'}
                    </button>
                    {showUtmFields && (
                      <div className="grid grid-cols-2 gap-2">
                        {([
                          ['utm_source', novoLinkUtmSource, setNovoLinkUtmSource, 'ex: instagram', 'Identifica a origem do tráfego. Ex: instagram, whatsapp, google'],
                          ['utm_medium', novoLinkUtmMedium, setNovoLinkUtmMedium, 'ex: social', 'Identifica o canal ou meio. Ex: social, email, cpc, banner'],
                          ['utm_campaign', novoLinkUtmCampaign, setNovoLinkUtmCampaign, 'ex: nome_evento', 'Nome da campanha de marketing. Ex: lancamento_produto, evento_jun'],
                          ['utm_content', novoLinkUtmContent, setNovoLinkUtmContent, 'ex: link_1', 'Diferencia versões do mesmo link. Ex: link_divulgacao, link_inscricao'],
                        ] as const).map(([label, value, setter, placeholder, tooltip]) => (
                          <div key={label}>
                            <label className="flex items-center gap-1 text-[10px] font-medium text-gray-400 mb-1">
                              {label}<TooltipInfo text={tooltip} />
                            </label>
                            <input
                              value={value}
                              onChange={(e) => setter(e.target.value)}
                              placeholder={placeholder}
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B4A0]"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setAddingLinkTo(null); setNovoLinkTitulo(''); setNovoLinkUrl(''); setNovoLinkUtmSource(''); setNovoLinkUtmMedium(''); setNovoLinkUtmCampaign(''); setNovoLinkUtmContent(''); setShowUtmFields(false) }} className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg">
                        Cancelar
                      </button>
                      <button
                        onClick={() => adicionarLink(evento.id)}
                        disabled={savingLink || !novoLinkTitulo.trim() || !novoLinkUrl.trim()}
                        className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg disabled:opacity-50"
                        style={{ background: '#00B4A0' }}
                      >
                        {savingLink ? 'Salvando...' : 'Adicionar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-3 border-t border-gray-100">
                    <button
                      onClick={() => { setAddingLinkTo(evento.id); setNovoLinkTitulo(''); setNovoLinkUrl('') }}
                      className="flex items-center gap-2 text-sm font-medium transition-colors"
                      style={{ color: '#00B4A0' }}
                    >
                      <Plus size={15} />
                      Adicionar link
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {shareLink && (
        <ShareModal
          url={`${typeof window !== 'undefined' ? window.location.origin : 'https://prototype-aracoop.vercel.app'}/e/${shareLink.id}`}
          titulo={shareLink.titulo}
          onClose={() => setShareLink(null)}
        />
      )}
    </div>
  )
}

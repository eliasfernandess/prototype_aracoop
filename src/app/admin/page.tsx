'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  DndContext, closestCenter, KeyboardSensor,
  PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { Globe, Plus, GripVertical } from 'lucide-react'
import SortableLink from '@/components/SortableLink'
import LinkForm from '@/components/LinkForm'

export interface Link {
  id: number
  titulo: string
  descricao: string | null
  urlDestino: string
  categoria: string | null
  icone: string | null
  corIcone: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  ordem: number
  ativo: boolean
}

type Tab = 'todos' | 'ativos' | 'inativos'

export default function AdminPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('todos')
  const [busca, setBusca] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editLink, setEditLink] = useState<Link | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [reordering, setReordering] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchLinks = useCallback(async () => {
    const res = await fetch('/api/links?all=true')
    if (res.ok) setLinks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchLinks() }, [fetchLinks])

  const ativos = links.filter((l) => l.ativo)
  const inativos = links.filter((l) => !l.ativo)

  const filtered = links.filter((l) => {
    const matchTab = tab === 'todos' || (tab === 'ativos' ? l.ativo : !l.ativo)
    const matchBusca = l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      (l.urlDestino ?? '').toLowerCase().includes(busca.toLowerCase())
    return matchTab && matchBusca
  })

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = links.findIndex((l) => l.id === active.id)
    const newIdx = links.findIndex((l) => l.id === over.id)
    const reordered = arrayMove(links, oldIdx, newIdx)
    setLinks(reordered)
    await fetch('/api/links/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ordem: reordered.map((l, i) => ({ id: l.id, ordem: i + 1 })) }),
    })
  }

  async function handleToggleStatus(id: number, ativo: boolean) {
    await fetch(`/api/links/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !ativo }),
    })
    fetchLinks()
  }

  async function handleDelete(id: number) {
    await fetch(`/api/links/${id}`, { method: 'DELETE' })
    setConfirmDelete(null)
    fetchLinks()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Links</h1>
          <p className="text-gray-400 text-sm mt-0.5">Gerencie os botões da sua página pública</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Globe size={15} />
            Página pública
          </a>
          <button
            onClick={() => { setEditLink(null); setShowForm(true) }}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            style={{ background: '#00B4A0' }}
          >
            <Plus size={16} />
            Novo link
          </button>
        </div>
      </div>

      {/* Banner */}
      <div
        className="rounded-2xl p-5 mb-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #00B4A0 0%, #0D4A35 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Globe size={20} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold">links.sicoobaracoop.com.br</div>
            <div className="text-white/70 text-sm">{ativos.length} botões ativos sendo exibidos para os cooperados agora.</div>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <span className="opacity-70">👁</span>
          Ver página pública
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {([['todos', `Todos ${links.length}`], ['ativos', `Ativos ${ativos.length}`], ['inativos', `Inativos ${inativos.length}`]] as [Tab, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: tab === key ? '#fff' : 'transparent',
                  color: tab === key ? '#111' : '#6B7280',
                  boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar link..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent w-52"
                style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
              />
            </div>
            <button
              onClick={() => setReordering(!reordering)}
              className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <GripVertical size={15} />
              Reordenar
            </button>
          </div>
        </div>

        {/* Links list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#00B4A0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {busca ? 'Nenhum link encontrado.' : 'Nenhum link cadastrado ainda.'}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filtered.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              {filtered.map((link, idx) => (
                <SortableLink
                  key={link.id}
                  link={link}
                  index={links.findIndex((l) => l.id === link.id) + 1}
                  showDrag={reordering}
                  onEdit={() => { setEditLink(link); setShowForm(true) }}
                  onDelete={() => setConfirmDelete(link.id)}
                  onToggleStatus={() => handleToggleStatus(link.id, link.ativo)}
                  isLast={idx === filtered.length - 1}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {showForm && (
        <LinkForm
          link={editLink}
          onClose={() => { setShowForm(false); setEditLink(null) }}
          onSave={() => { setShowForm(false); setEditLink(null); fetchLinks() }}
        />
      )}

      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-800 text-lg mb-1">Excluir link?</h3>
            <p className="text-gray-400 text-sm mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

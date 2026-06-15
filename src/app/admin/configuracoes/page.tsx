'use client'

import { useState, useEffect } from 'react'
import { Globe, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react'

const COLOR_PRESETS = [
  { nome: 'Teal Sicoob', valor: '#00B4A0' },
  { nome: 'Verde Sicoob', valor: '#009E8E' },
  { nome: 'Verde Escuro', valor: '#006633' },
  { nome: 'Azul', valor: '#2563EB' },
  { nome: 'Roxo', valor: '#7C3AED' },
  { nome: 'Rosa', valor: '#DB2777' },
  { nome: 'Laranja', valor: '#EA580C' },
]

type Status = 'idle' | 'saving' | 'saved' | 'error'

export default function ConfiguracoesPage() {
  const [configs, setConfigs] = useState({
    ga4_id: '',
    cor_primaria: '#00B4A0',
    logo_url: '',
    bio: '',
    titulo_site: '',
    descricao_site: '',
  })
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<Record<string, Status>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [corCustom, setCorCustom] = useState('#00B4A0')
  const [showCustom, setShowCustom] = useState(false)

  useEffect(() => {
    fetch('/api/configuracoes')
      .then((r) => r.json())
      .then((data) => {
        setConfigs((prev) => ({ ...prev, ...data }))
        setCorCustom(data.cor_primaria || '#00B4A0')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function save(section: string, fields: Record<string, string>) {
    setStatus((s) => ({ ...s, [section]: 'saving' }))
    try {
      const res = await fetch('/api/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      setStatus((s) => ({ ...s, [section]: res.ok ? 'saved' : 'error' }))
      setTimeout(() => setStatus((s) => ({ ...s, [section]: 'idle' })), 3000)
    } catch {
      setStatus((s) => ({ ...s, [section]: 'error' }))
    }
  }

  function set(key: string, value: string) {
    setConfigs((prev) => ({ ...prev, [key]: value }))
  }

  function SaveButton({ section, fields }: { section: string; fields: Record<string, string> }) {
    const st = status[section] ?? 'idle'
    return (
      <button
        onClick={() => save(section, fields)}
        disabled={st === 'saving'}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60"
        style={{ background: '#00B4A0' }}
      >
        {st === 'saving' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {st === 'saving' ? 'Salvando...' : st === 'saved' ? 'Salvo!' : 'Salvar'}
      </button>
    )
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-400 text-sm mt-0.5">Preferências da conta e do painel</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Globe size={15} /> Página pública
        </a>
      </div>

      {/* ── Google Analytics 4 ─────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-lg">📊</div>
            <div>
              <div className="font-semibold text-gray-800">Google Analytics 4</div>
              <div className="text-xs text-gray-400 mt-0.5">Rastreamento de cliques e origens de tráfego</div>
            </div>
          </div>
          {configs.ga4_id ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <CheckCircle2 size={14} /> Conectado
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <AlertCircle size={14} /> Não configurado
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Measurement ID
          </label>
          <div className="flex gap-2">
            <input
              value={configs.ga4_id}
              onChange={(e) => set('ga4_id', e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 bg-gray-50"
              style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
            />
            <SaveButton section="ga4" fields={{ ga4_id: configs.ga4_id }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Encontre em: <span className="font-mono">GA4 → Admin → Data Streams → seu stream</span>
          </p>
        </div>

        {configs.ga4_id && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3">
            <p className="text-xs text-green-700">
              Todos os cliques na página pública estão sendo enviados para o GA4 como evento <strong>clique_botao</strong>.
            </p>
          </div>
        )}
      </section>

      {/* ── Identidade Visual ──────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-lg">✨</div>
          <div>
            <div className="font-semibold text-gray-800">Identidade Visual</div>
            <div className="text-xs text-gray-400 mt-0.5">Cor, logo e bio da página pública</div>
          </div>
        </div>

        {/* Cor primária */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">Cor primária</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c.valor}
                type="button"
                onClick={() => { set('cor_primaria', c.valor); setCorCustom(c.valor); setShowCustom(false) }}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-9 h-9 rounded-xl border-2 transition-transform hover:scale-110"
                  style={{
                    background: c.valor,
                    borderColor: configs.cor_primaria === c.valor ? '#111' : 'transparent',
                    transform: configs.cor_primaria === c.valor ? 'scale(1.15)' : undefined,
                  }}
                />
                <span className="text-[10px] text-gray-400 hidden group-hover:block whitespace-nowrap">
                  {c.nome}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              className="w-9 h-9 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center transition-colors"
              title="Personalizar cor"
            >
              <span className="text-xs text-gray-400">#</span>
            </button>
          </div>

          {showCustom && (
            <div className="flex items-center gap-3 mt-2">
              <input
                type="color"
                value={corCustom}
                onChange={(e) => { setCorCustom(e.target.value); set('cor_primaria', e.target.value) }}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                value={corCustom}
                onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) { setCorCustom(e.target.value); if (e.target.value.length === 7) set('cor_primaria', e.target.value) } }}
                className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
                placeholder="#00B4A0"
              />
              <div className="w-8 h-8 rounded-lg shadow" style={{ background: configs.cor_primaria }} />
            </div>
          )}
        </div>

        {/* Logo URL */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            URL do logotipo <span className="text-gray-400 font-normal text-xs">· opcional (substitui o logo padrão)</span>
          </label>
          <input
            value={configs.logo_url}
            onChange={(e) => set('logo_url', e.target.value)}
            placeholder="https://exemplo.com/logo.png"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 bg-gray-50"
            style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
          />
          {configs.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={configs.logo_url} alt="Logo preview" className="mt-2 h-12 object-contain rounded" />
          )}
        </div>

        {/* Bio */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Texto de bio</label>
          <textarea
            value={configs.bio}
            onChange={(e) => set('bio', e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 bg-gray-50 resize-none"
            style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
            placeholder="Descrição exibida no perfil da página pública"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowPreview(true)}
            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
          >
            Pré-visualizar →
          </button>
          <SaveButton
            section="visual"
            fields={{
              cor_primaria: configs.cor_primaria,
              logo_url: configs.logo_url,
              bio: configs.bio,
            }}
          />
        </div>
      </section>

      {/* ── SEO ─────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-lg">⭐</div>
          <div>
            <div className="font-semibold text-gray-800">SEO & Open Graph</div>
            <div className="text-xs text-gray-400 mt-0.5">Título e descrição exibidos em buscadores e redes sociais</div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Título da página</label>
            <input
              value={configs.titulo_site}
              onChange={(e) => set('titulo_site', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 bg-gray-50"
              style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
              placeholder="Sicoob Aracoop | Links"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea
              value={configs.descricao_site}
              onChange={(e) => set('descricao_site', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 bg-gray-50 resize-none"
              style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
              placeholder="Acesse todos os serviços e campanhas do Sicoob Aracoop"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <SaveButton
            section="seo"
            fields={{ titulo_site: configs.titulo_site, descricao_site: configs.descricao_site }}
          />
        </div>
      </section>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setShowPreview(false)}>
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <button onClick={() => setShowPreview(false)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-3xl leading-none">×</button>
            <div className="relative w-[340px] h-[680px] rounded-[44px] overflow-hidden shadow-2xl border-[10px] border-gray-900 bg-white">
              <div className="absolute top-0 left-0 right-0 h-7 bg-gray-900 z-10 flex items-center justify-center">
                <div className="w-24 h-4 bg-black rounded-b-2xl" />
              </div>
              <iframe src="/" className="w-full h-full border-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

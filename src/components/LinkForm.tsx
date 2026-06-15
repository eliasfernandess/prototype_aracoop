'use client'

import { useState, useEffect } from 'react'
import { X, Link2 } from 'lucide-react'
import { ICON_MAP, ICON_OPTIONS, COLOR_OPTIONS } from '@/lib/icons'
import type { Link } from '@/app/admin/page'

interface Props {
  link: Link | null
  onClose: () => void
  onSave: () => void
}

function buildPreview(url: string, s: string, m: string, c: string, ct: string) {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (s) u.searchParams.set('utm_source', s)
    if (m) u.searchParams.set('utm_medium', m)
    if (c) u.searchParams.set('utm_campaign', c)
    if (ct) u.searchParams.set('utm_content', ct)
    return u.toString()
  } catch { return url }
}

export default function LinkForm({ link, onClose, onSave }: Props) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [urlDestino, setUrlDestino] = useState('')
  const [categoria, setCategoria] = useState('')
  const [campanha, setCampanha] = useState('')
  const [icone, setIcone] = useState('link')
  const [corIcone, setCorIcone] = useState('#00B4A0')
  const [utmSource, setUtmSource] = useState('pagina_links')
  const [utmMedium, setUtmMedium] = useState('botao')
  const [utmCampaign, setUtmCampaign] = useState('')
  const [utmContent, setUtmContent] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (link) {
      setTitulo(link.titulo)
      setDescricao(link.descricao ?? '')
      setUrlDestino(link.urlDestino)
      setCategoria(link.categoria ?? '')
      setCampanha(link.utmCampaign ?? '')
      setIcone(link.icone ?? 'link')
      setCorIcone(link.corIcone ?? '#00B4A0')
      setUtmSource(link.utmSource ?? 'pagina_links')
      setUtmMedium(link.utmMedium ?? 'botao')
      setUtmCampaign(link.utmCampaign ?? '')
      setUtmContent(link.utmContent ?? '')
      setAtivo(link.ativo)
    }
  }, [link])

  // Sync campanha → utmCampaign
  function handleCampanha(val: string) {
    setCampanha(val)
    setUtmCampaign(val)
  }

  const previewUrl = buildPreview(urlDestino, utmSource, utmMedium, utmCampaign, utmContent)
  const IconPreview = ICON_MAP[icone] ?? ICON_MAP['link']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const body = {
      titulo, descricao: descricao || null, urlDestino,
      categoria: categoria || null, icone, corIcone,
      utmSource: utmSource || null, utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null, utmContent: utmContent || null,
      ativo,
    }
    try {
      const res = link
        ? await fetch(`/api/links/${link.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) onSave()
      else { const d = await res.json(); setErro(d.erro ?? 'Erro ao salvar') }
    } catch { setErro('Erro de conexão.') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: corIcone }}>
                <IconPreview size={13} className="text-white" />
              </div>
              {link ? 'Editar link' : 'Novo link'}
            </h2>
            {link && <p className="text-xs text-gray-400 mt-0.5">{link.titulo}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 px-6 py-5 flex flex-col gap-5">
          {/* Conteúdo */}
          <section>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3 flex items-center gap-1.5">
              <Link2 size={10} style={{ color: '#00B4A0' }} />
              Conteúdo do Botão
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Título</label>
                <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
                  style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
                  placeholder="Ex: Abrir Conta Digital" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição <span className="text-gray-400 font-normal">· opcional</span></label>
                <input value={descricao} onChange={(e) => setDescricao(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
                  style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
                  placeholder="Ex: Seja cooperado em poucos minutos" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">URL de destino</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </span>
                  <input value={urlDestino} onChange={(e) => setUrlDestino(e.target.value)} required type="url"
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
                    style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
                    placeholder="https://sicoobaracoop.com.br/..." />
                </div>
              </div>
            </div>
          </section>

          {/* Ícone */}
          <section>
            <p className="text-xs font-medium text-gray-600 mb-3">Ícone</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {ICON_OPTIONS.map(({ id }) => {
                const Icon = ICON_MAP[id]
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setIcone(id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all border-2"
                    style={{
                      background: icone === id ? corIcone : '#F3F4F6',
                      borderColor: icone === id ? corIcone : 'transparent',
                    }}
                  >
                    <Icon size={16} className={icone === id ? 'text-white' : 'text-gray-500'} />
                  </button>
                )
              })}
            </div>
            <p className="text-xs font-medium text-gray-600 mb-2">Cor do ícone</p>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCorIcone(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 border-2"
                  style={{
                    background: c,
                    borderColor: corIcone === c ? '#111' : 'transparent',
                    transform: corIcone === c ? 'scale(1.2)' : undefined,
                  }}
                />
              ))}
            </div>
          </section>

          {/* Categoria + Campanha */}
          <section className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Categoria</label>
              <input value={categoria} onChange={(e) => setCategoria(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
                style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
                placeholder="Conta, Crédito..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Campanha</label>
              <input value={campanha} onChange={(e) => handleCampanha(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
                style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
                placeholder="abertura_conta" />
            </div>
          </section>

          {/* UTM */}
          <section>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3 flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00B4A0" strokeWidth="2.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Parâmetros UTM
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['utm_source', utmSource, setUtmSource, 'pagina_links'],
                ['utm_medium', utmMedium, setUtmMedium, 'botao'],
                ['utm_campaign', utmCampaign, (v: string) => { setUtmCampaign(v); setCampanha(v) }, 'nome_campanha'],
                ['utm_content', utmContent, setUtmContent, 'nome_botao'],
              ].map(([label, value, setter, placeholder]) => (
                <div key={label as string}>
                  <label className="block text-[10px] font-medium text-gray-400 mb-1">{label as string}</label>
                  <input
                    value={value as string}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50"
                    style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
                    placeholder={placeholder as string}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* URL Preview */}
          {previewUrl && (
            <div className="rounded-xl p-3.5" style={{ background: '#0D2B1E' }}>
              <p className="text-[10px] font-semibold text-[#5C8B7A] mb-1.5 flex items-center gap-1">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#00B4A0" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                URL final gerada automaticamente
              </p>
              <p className="text-xs break-all leading-relaxed" style={{ color: '#00B4A0' }}>{previewUrl}</p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAtivo(!ativo)}
              className="relative w-10 h-5 rounded-full transition-colors"
              style={{ background: ativo ? '#00B4A0' : '#E5E7EB' }}
            >
              <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform" style={{ transform: ativo ? 'translateX(20px)' : 'translateX(0)' }} />
            </button>
            <span className="text-sm text-gray-700">{ativo ? 'Ativo (visível na página)' : 'Inativo (oculto)'}</span>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{erro}</div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
          <button type="button" onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={loading}
            className="flex-1 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: '#00B4A0' }}
          >
            {loading ? 'Salvando...' : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {link ? 'Salvar alterações' : 'Criar link'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

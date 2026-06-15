'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Globe, Download } from 'lucide-react'
import { buildUtmUrl } from '@/lib/utm'

interface Link {
  id: number
  titulo: string
  urlDestino: string
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
}

const materiais = [
  { id: 'banner_evento', label: 'Banner do evento', content: 'banner_evento' },
  { id: 'mesa_evento', label: 'Mesa de atendimento', content: 'mesa_evento' },
  { id: 'folder_a4', label: 'Folder do cooperado', content: 'folder_a4' },
  { id: 'cartaz_agencia', label: 'Cartaz da agência', content: 'cartaz_agencia' },
]

const iconesMaterial: Record<string, string> = {
  banner_evento: '⭐',
  mesa_evento: '👤',
  folder_a4: '✉',
  cartaz_agencia: '🖼',
}

interface QRSalvo {
  id: string
  titulo: string
  material: string
  campanha: string
  url: string
}

export default function QRCodesPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [linkId, setLinkId] = useState<number | null>(null)
  const [campanha, setCampanha] = useState('leilao_sindicato')
  const [material, setMaterial] = useState('banner_evento')
  const [salvos, setSalvos] = useState<QRSalvo[]>([
    { id: '1', titulo: 'Abrir Conta Digital', material: 'banner_evento', campanha: 'leilao_sindicato', url: 'https://sicoobaracoop.com.br/abrir-conta?utm_source=qrcode&utm_medium=offline&utm_campaign=leilao_sindicato&utm_content=banner_evento' },
    { id: '2', titulo: 'Abrir Conta Digital', material: 'cartaz_agencia', campanha: 'abertura_conta', url: 'https://sicoobaracoop.com.br/abrir-conta?utm_source=qrcode&utm_medium=offline&utm_campaign=abertura_conta&utm_content=cartaz_agencia' },
  ])

  useEffect(() => {
    fetch('/api/links?all=true').then((r) => r.json()).then((data) => {
      setLinks(data)
      if (data.length > 0) setLinkId(data[0].id)
    })
  }, [])

  const linkSelecionado = links.find((l) => l.id === linkId)
  const materialSelecionado = materiais.find((m) => m.id === material)

  const qrUrl = linkSelecionado
    ? buildUtmUrl(linkSelecionado.urlDestino, {
        utmSource: 'qrcode',
        utmMedium: 'offline',
        utmCampaign: campanha,
        utmContent: materialSelecionado?.content ?? material,
      })
    : ''

  function handleSalvar() {
    if (!linkSelecionado || !qrUrl) return
    const novo: QRSalvo = {
      id: Date.now().toString(),
      titulo: linkSelecionado.titulo,
      material: materialSelecionado?.label ?? material,
      campanha,
      url: qrUrl,
    }
    setSalvos((prev) => [novo, ...prev])
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>
          <p className="text-gray-400 text-sm mt-0.5">Materiais off-line com rastreamento UTM</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Globe size={15} /> Página pública
        </a>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2 mb-6">
        <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          Campanhas off-line
        </span>
        <span className="text-xs text-gray-400">Gere QR Codes com UTM específico para cada material impresso.</span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Form */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Link de destino</label>
            <select
              value={linkId ?? ''}
              onChange={(e) => setLinkId(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-gray-50 appearance-none"
              style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
            >
              {links.map((l) => (
                <option key={l.id} value={l.id}>{l.titulo}</option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campanha <span className="text-gray-400 font-normal">· utm_campaign</span>
            </label>
            <input
              value={campanha}
              onChange={(e) => setCampanha(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-gray-50"
              style={{ '--tw-ring-color': '#00B4A0' } as React.CSSProperties}
              placeholder="leilao_sindicato"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">Material impresso</label>
            <div className="grid grid-cols-2 gap-3">
              {materiais.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMaterial(m.id)}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: material === m.id ? '#00B4A0' : '#E5E7EB',
                    background: material === m.id ? '#F0FDFB' : '#FAFAFA',
                  }}
                >
                  <span className="text-xl">{iconesMaterial[m.id]}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{m.label}</div>
                    <div className="text-xs text-gray-400">utm_content={m.content}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* URL preview */}
          {qrUrl && (
            <div className="rounded-xl p-4" style={{ background: '#0D2B1E' }}>
              <p className="text-[10px] font-semibold text-[#5C8B7A] mb-2 flex items-center gap-1">
                <span style={{ color: '#00B4A0' }}>◆</span> URL codificada no QR
              </p>
              <p className="text-xs break-all leading-relaxed" style={{ color: '#00B4A0' }}>{qrUrl}</p>
            </div>
          )}
        </div>

        {/* QR Preview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center gap-4">
          {qrUrl ? (
            <>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <QRCodeSVG value={qrUrl} size={160} fgColor="#0D2B1E" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-800 text-sm">{materialSelecionado?.label}</div>
                <div className="text-gray-400 text-xs mt-0.5">{linkSelecionado?.titulo}</div>
              </div>
              <button
                onClick={handleSalvar}
                className="w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: '#00B4A0' }}
              >
                + Gerar e salvar
              </button>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">
              Selecione um link
            </div>
          )}
        </div>
      </div>

      {/* Saved QR Codes */}
      {salvos.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-gray-800">QR Codes gerados</div>
              <div className="text-xs text-gray-400 mt-0.5">Materiais prontos para impressão</div>
            </div>
            <span className="text-sm text-gray-400">{salvos.length}</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {salvos.map((qr) => (
              <div key={qr.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col items-center gap-3">
                <QRCodeSVG value={qr.url} size={100} fgColor="#0D2B1E" />
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-700 truncate w-full text-center">{qr.material}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{qr.campanha}</div>
                </div>
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  <Download size={12} /> Baixar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

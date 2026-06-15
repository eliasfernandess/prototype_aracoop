'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Globe, TrendingUp } from 'lucide-react'
import { ICON_MAP } from '@/lib/icons'

const chartData = [
  { dia: '01/06', cliques: 410 },
  { dia: '02/06', cliques: 380 },
  { dia: '03/06', cliques: 520 },
  { dia: '04/06', cliques: 490 },
  { dia: '05/06', cliques: 610 },
  { dia: '06/06', cliques: 580 },
  { dia: '07/06', cliques: 720 },
  { dia: '08/06', cliques: 690 },
  { dia: '09/06', cliques: 750 },
  { dia: '10/06', cliques: 810 },
  { dia: '11/06', cliques: 870 },
  { dia: '12/06', cliques: 930 },
  { dia: '13/06', cliques: 445 },
]

const origens = [
  { label: 'Instagram (bio)', utm: 'utm_medium=social', cor: '#E84062', pct: 41 },
  { label: 'QR Code offline', utm: 'utm_medium=offline', cor: '#F59E0B', pct: 27 },
  { label: 'WhatsApp', utm: 'utm_medium=mensagem', cor: '#25D366', pct: 19 },
  { label: 'Direto / outros', utm: 'utm_medium=direto', cor: '#0D2B1E', pct: 13 },
]

const ranking = [
  { titulo: 'Abrir Conta Digital', icone: 'credit-card', cor: '#00B4A0', cliques: 1842 },
  { titulo: 'WhatsApp Atendimento', icone: 'message-circle', cor: '#25D366', cliques: 1389 },
  { titulo: 'Aracoop Delas', icone: 'sparkles', cor: '#E84062', cliques: 1207 },
  { titulo: 'Leilão do Sindicato', icone: 'gavel', cor: '#F59E0B', cliques: 968 },
  { titulo: 'Instagram @sicoobaracoop', icone: 'instagram', cor: '#E1306C', cliques: 877 },
  { titulo: 'Crédito Rural & Agro', icone: 'leaf', cor: '#16A34A', cliques: 745 },
]

const campanhas = [
  { nome: 'institucional', cliques: 2053 },
  { nome: 'abertura_conta', cliques: 1842 },
  { nome: 'atendimento', cliques: 1389 },
  { nome: 'aracoop_delas', cliques: 1207 },
  { nome: 'leilao_sindicato', cliques: 968 },
]

const maxRanking = ranking[0].cliques
const maxCampanha = campanhas[0].cliques

export default function AnalisesPage() {
  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análises</h1>
          <p className="text-gray-400 text-sm mt-0.5">Acompanhe os cliques e campanhas no GA4</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <Globe size={15} /> Página pública
        </a>
      </div>

      {/* Badge tempo real */}
      <div className="flex items-center gap-2 mb-6">
        <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Tempo real · GA4 conectado
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: '✈', label: 'Cliques no mês', value: '8.204', trend: '+18%', color: '#00B4A0' },
          { icon: '👥', label: 'Visitantes únicos', value: '6.214', trend: '+12%', color: '#3B82F6' },
          { icon: '⭐', label: 'Link em destaque', value: 'Abrir', sub: '1.842 cliques', color: '#F59E0B' },
          { icon: '📈', label: 'Taxa de clique (CTR)', value: '32,8%', trend: '+4,1pp', color: '#16A34A' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: kpi.color + '18' }}>
                {kpi.icon}
              </div>
              {kpi.trend && (
                <span className="text-xs font-semibold text-green-500 flex items-center gap-0.5">
                  <TrendingUp size={11} /> {kpi.trend}
                </span>
              )}
              {kpi.sub && <span className="text-xs text-gray-400">{kpi.sub}</span>}
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Bar chart */}
        <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-semibold text-gray-800">Cliques ao longo do tempo</div>
              <div className="text-xs text-gray-400 mt-0.5">Evolução diária dos cliques nos botões</div>
            </div>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: '#00B4A0' }} />
              8.204 total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                cursor={{ fill: '#F0FDF9' }}
              />
              <Bar dataKey="cliques" fill="#00B4A0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic source */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="font-semibold text-gray-800 mb-1">Origem do tráfego</div>
          <div className="text-xs text-gray-400 mb-4">De onde vêm os cliques</div>
          <div className="flex flex-col gap-4">
            {origens.map((o) => (
              <div key={o.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: o.cor }} />
                    {o.label}
                  </span>
                  <span className="font-bold text-gray-800">{o.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${o.pct}%`, background: o.cor }} />
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{o.utm}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Ranking */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="font-semibold text-gray-800 mb-1">Ranking de botões</div>
          <div className="text-xs text-gray-400 mb-4">Mais clicados no período</div>
          <div className="flex flex-col gap-3">
            {ranking.map((r, i) => {
              const Icon = ICON_MAP[r.icone] ?? ICON_MAP['link']
              return (
                <div key={r.titulo} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium w-5 flex-shrink-0">{i + 1}°</span>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: r.cor }}>
                    <Icon size={12} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-700 truncate mb-1">{r.titulo}</div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(r.cliques / maxRanking) * 100}%`, background: '#00B4A0' }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-10 text-right flex-shrink-0">{r.cliques.toLocaleString('pt-BR')}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Campanhas */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="font-semibold text-gray-800 mb-1">Desempenho por campanha</div>
          <div className="text-xs text-gray-400 mb-4">Agrupado por utm_campaign</div>
          <div className="flex flex-col gap-3">
            {campanhas.map((c) => (
              <div key={c.nome} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-gray-600 truncate mb-1">{c.nome}</div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(c.cliques / maxCampanha) * 100}%`, background: `hsl(${160 - campanhas.indexOf(c) * 15}, 60%, 40%)` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-700 w-12 text-right flex-shrink-0">{c.cliques.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-gray-50 rounded-xl p-3 flex items-center gap-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00B4A0" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <p className="text-xs text-gray-500">A campanha <strong className="text-gray-700">institucional</strong> lidera em cliques neste período.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

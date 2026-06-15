'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Link2, BarChart2, QrCode, Settings, Eye, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Props {
  nome: string
  email: string
  linkCount: number
}

const navItems = [
  { href: '/admin', label: 'Links', icon: Link2, exact: true },
  { href: '/admin/analises', label: 'Análises', icon: BarChart2, exact: false },
  { href: '/admin/qr-codes', label: 'QR Codes', icon: QrCode, exact: false },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings, exact: false },
]

export default function AdminSidebar({ nome, email, linkCount }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [showPreview, setShowPreview] = useState(false)

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const initials = nome
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <>
      <aside
        className="fixed left-0 top-0 h-full w-56 flex flex-col z-30"
        style={{ background: '#0D2B1E' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#00B4A0' }}>
            <Link2 size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight">Sicoob Aracoop</div>
            <div className="text-[10px] mt-0.5" style={{ color: '#5C8B7A' }}>Painel de Links</div>
          </div>
        </div>

        <div className="mx-4 mb-4" style={{ height: '1px', background: '#1A3D30' }} />

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5">
          <p className="text-[10px] font-semibold tracking-widest uppercase px-2 mb-2" style={{ color: '#3E6B5A' }}>
            Gerenciar
          </p>

          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                style={{
                  background: active ? '#1A3D30' : 'transparent',
                  color: active ? '#ffffff' : '#7CB9A8',
                }}
              >
                <Icon
                  size={17}
                  style={{ color: active ? '#00B4A0' : '#5C8B7A', flexShrink: 0 }}
                />
                <span className="text-sm font-medium">{label}</span>
                {label === 'Links' && (
                  <span
                    className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#1A3D30', color: active ? '#00B4A0' : '#5C8B7A' }}
                  >
                    {linkCount}
                  </span>
                )}
              </Link>
            )
          })}

          <p className="text-[10px] font-semibold tracking-widest uppercase px-2 mt-4 mb-2" style={{ color: '#3E6B5A' }}>
            Página Pública
          </p>

          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left"
            style={{ color: '#7CB9A8' }}
          >
            <Eye size={17} style={{ color: '#5C8B7A', flexShrink: 0 }} />
            <span className="text-sm font-medium">Pré-visualizar</span>
          </button>
        </nav>

        {/* User */}
        <div className="mx-4 mb-3" style={{ height: '1px', background: '#1A3D30' }} />
        <div className="px-4 pb-5 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
            style={{ background: '#00B4A0' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">{nome}</div>
            <div className="text-[10px] truncate" style={{ color: '#5C8B7A' }}>{email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 hover:text-white transition-colors"
            style={{ color: '#5C8B7A' }}
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setShowPreview(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-2xl"
            >
              ×
            </button>
            {/* Phone frame */}
            <div className="relative w-[340px] h-[680px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-gray-800 bg-white">
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 z-10 flex items-center justify-center">
                <div className="w-20 h-3 bg-gray-900 rounded-full" />
              </div>
              <iframe
                src="/"
                className="w-full h-full border-0 mt-0"
                style={{ marginTop: '0px' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

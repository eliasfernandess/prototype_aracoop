'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setErro(data.erro ?? 'Credenciais inválidas')
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #00B4A0 0%, #0D4A35 45%, #0D2B1E 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-white/5" />
        <div className="absolute top-[40%] right-[-60px] w-[200px] h-[200px] rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Link2 className="text-white" size={20} />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-none">Sicoob Aracoop</div>
            <div className="text-white/60 text-xs mt-0.5">Links · Painel</div>
          </div>
        </div>

        {/* Center copy */}
        <div className="relative z-10">
          <p className="text-white/60 text-xs font-semibold tracking-widest uppercase mb-4">
            Página Oficial de Links
          </p>
          <h1 className="text-white font-bold text-4xl leading-tight mb-4">
            Um só link para<br />conectar cada<br />cooperado.
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xs">
            Centralize campanhas, gere UTMs automáticos e acompanhe cada clique — tudo a partir de um painel simples.
          </p>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">links.sicoobaracoop.com.br</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-gray-900 text-2xl font-bold">Bem-vindo de volta</h2>
            <p className="text-gray-400 text-sm mt-1">Acesse o painel para gerenciar os links.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4A0] focus:border-transparent bg-gray-50"
                  placeholder="comunicacao@sicoobaracoop.com.br"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4A0] focus:border-transparent bg-gray-50"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showSenha
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#00B4A0] rounded" />
                <span className="text-gray-600">Manter conectado</span>
              </label>
              <button type="button" className="text-[#00B4A0] hover:underline font-medium">
                Esqueci a senha
              </button>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#00B4A0] hover:bg-[#009B8A] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? 'Entrando...' : (
                <>
                  Entrar no painel
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

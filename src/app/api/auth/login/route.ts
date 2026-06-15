import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, AUTH_COOKIE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json()

    if (!email || !senha) {
      return NextResponse.json({ erro: 'E-mail e senha são obrigatórios' }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
      return NextResponse.json({ erro: 'Credenciais inválidas' }, { status: 401 })
    }

    const token = await signToken({ id: usuario.id, email: usuario.email, nome: usuario.nome })

    const response = NextResponse.json({ ok: true, nome: usuario.nome })
    response.cookies.set(AUTH_COOKIE.name, token, AUTH_COOKIE)

    return response
  } catch (error) {
    console.error('POST /api/auth/login:', error)
    return NextResponse.json({ erro: 'Erro interno do servidor' }, { status: 500 })
  }
}

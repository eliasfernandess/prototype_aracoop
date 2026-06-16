import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { links: { orderBy: { ordem: 'asc' } } },
    })
    return NextResponse.json(eventos)
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar eventos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  try {
    const { titulo, descricao } = await request.json()
    if (!titulo) return NextResponse.json({ erro: 'Título obrigatório' }, { status: 400 })
    const evento = await prisma.evento.create({ data: { titulo, descricao }, include: { links: true } })
    return NextResponse.json(evento, { status: 201 })
  } catch {
    return NextResponse.json({ erro: 'Erro ao criar evento' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  try {
    const { titulo, url } = await request.json()
    if (!titulo || !url) return NextResponse.json({ erro: 'Título e URL obrigatórios' }, { status: 400 })
    const count = await prisma.eventoLink.count({ where: { eventoId: Number(params.id) } })
    const link = await prisma.eventoLink.create({
      data: { titulo, url, eventoId: Number(params.id), ordem: count + 1 },
    })
    return NextResponse.json(link, { status: 201 })
  } catch {
    return NextResponse.json({ erro: 'Erro ao criar link' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  try {
    const { titulo, descricao, ativo } = await request.json()
    const evento = await prisma.evento.update({
      where: { id: Number(params.id) },
      data: { titulo, descricao, ativo },
      include: { links: { orderBy: { ordem: 'asc' } } },
    })
    return NextResponse.json(evento)
  } catch {
    return NextResponse.json({ erro: 'Erro ao atualizar evento' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  try {
    await prisma.evento.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ erro: 'Erro ao excluir evento' }, { status: 500 })
  }
}

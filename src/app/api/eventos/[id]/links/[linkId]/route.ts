import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string; linkId: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  try {
    const data = await request.json()
    const link = await prisma.eventoLink.update({ where: { id: Number(params.linkId) }, data })
    return NextResponse.json(link)
  } catch {
    return NextResponse.json({ erro: 'Erro ao atualizar link' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string; linkId: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  try {
    await prisma.eventoLink.delete({ where: { id: Number(params.linkId) } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ erro: 'Erro ao excluir link' }, { status: 500 })
  }
}

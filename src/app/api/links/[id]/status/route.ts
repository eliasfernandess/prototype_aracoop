import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })

  try {
    const { ativo } = await request.json()
    const link = await prisma.link.update({ where: { id }, data: { ativo } })
    return NextResponse.json(link)
  } catch (error) {
    console.error('PATCH /api/links/[id]/status:', error)
    return NextResponse.json({ erro: 'Erro ao atualizar status' }, { status: 500 })
  }
}

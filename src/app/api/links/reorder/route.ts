import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const { ordem } = await request.json()

    if (!Array.isArray(ordem)) {
      return NextResponse.json({ erro: 'Formato inválido' }, { status: 400 })
    }

    await prisma.$transaction(
      (ordem as { id: number; ordem: number }[]).map(({ id, ordem: o }) =>
        prisma.link.update({ where: { id }, data: { ordem: o } })
      )
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PATCH /api/links/reorder:', error)
    return NextResponse.json({ erro: 'Erro ao reordenar links' }, { status: 500 })
  }
}

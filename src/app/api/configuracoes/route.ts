import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const configs = await prisma.configuracao.findMany()
    const map = Object.fromEntries(configs.map((c) => [c.chave, c.valor]))
    return NextResponse.json(map)
  } catch (error) {
    console.error('GET /api/configuracoes:', error)
    return NextResponse.json({}, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const body: Record<string, string> = await request.json()

    await prisma.$transaction(
      Object.entries(body).map(([chave, valor]) =>
        prisma.configuracao.upsert({
          where: { chave },
          update: { valor },
          create: { chave, valor },
        })
      )
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PUT /api/configuracoes:', error)
    return NextResponse.json({ erro: 'Erro ao salvar configurações' }, { status: 500 })
  }
}

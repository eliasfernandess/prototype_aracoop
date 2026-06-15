import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    if (all) {
      const user = await getAuthUser()
      if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
    }

    const links = await prisma.link.findMany({
      where: all ? {} : { ativo: true },
      orderBy: { ordem: 'asc' },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('GET /api/links:', error)
    return NextResponse.json({ erro: 'Erro ao buscar links' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  try {
    const {
      titulo, descricao, urlDestino, categoria, icone, corIcone,
      utmSource, utmMedium, utmCampaign, utmContent, ativo,
    } = await request.json()

    if (!titulo || !urlDestino) {
      return NextResponse.json({ erro: 'Título e URL são obrigatórios' }, { status: 400 })
    }

    const max = await prisma.link.aggregate({ _max: { ordem: true } })
    const nextOrdem = (max._max.ordem ?? 0) + 1

    const link = await prisma.link.create({
      data: {
        titulo,
        descricao: descricao || null,
        urlDestino,
        categoria: categoria || null,
        icone: icone || 'link',
        corIcone: corIcone || '#00B4A0',
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        ativo: ativo ?? true,
        ordem: nextOrdem,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('POST /api/links:', error)
    return NextResponse.json({ erro: 'Erro ao criar link' }, { status: 500 })
  }
}

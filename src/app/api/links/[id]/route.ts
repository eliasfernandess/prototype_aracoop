import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

type Params = { params: { id: string } }

export async function PUT(request: NextRequest, { params }: Params) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })

  try {
    const {
      titulo, descricao, urlDestino, categoria, icone, corIcone,
      utmSource, utmMedium, utmCampaign, utmContent, ativo,
    } = await request.json()

    if (!titulo || !urlDestino) {
      return NextResponse.json({ erro: 'Título e URL são obrigatórios' }, { status: 400 })
    }

    const link = await prisma.link.update({
      where: { id },
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
      },
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('PUT /api/links/[id]:', error)
    return NextResponse.json({ erro: 'Erro ao atualizar link' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })

  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ erro: 'ID inválido' }, { status: 400 })

  try {
    await prisma.link.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/links/[id]:', error)
    return NextResponse.json({ erro: 'Erro ao excluir link' }, { status: 500 })
  }
}

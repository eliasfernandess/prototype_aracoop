import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { buildUtmUrl } from '@/lib/utm'
import EventoRedirect from './EventoRedirect'

export const dynamic = 'force-dynamic'

export default async function EventoLinkPage({ params }: { params: { id: string } }) {
  const link = await prisma.eventoLink.findUnique({
    where: { id: Number(params.id) },
    include: { evento: true },
  }).catch(() => null)

  if (!link || !link.ativo) notFound()

  const finalUrl = buildUtmUrl(link.url, {
    utmSource: link.utmSource,
    utmMedium: link.utmMedium,
    utmCampaign: link.utmCampaign,
    utmContent: link.utmContent,
  })

  return (
    <EventoRedirect
      finalUrl={finalUrl}
      eventoTitulo={link.evento.titulo}
      linkTitulo={link.titulo}
    />
  )
}

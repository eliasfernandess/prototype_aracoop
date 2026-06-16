import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { buildUtmUrl } from '@/lib/utm'

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
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F4F6F5' }}>
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="rounded-3xl overflow-hidden shadow-xl">
          {/* Header banner */}
          <div
            className="px-6 pt-10 pb-12 flex flex-col items-center text-center"
            style={{ background: 'linear-gradient(160deg, #004F62 0%, #003641 40%, #001C24 100%)' }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <div className="text-white/60 text-xs font-medium uppercase tracking-widest mb-2">
              {link.evento.titulo}
            </div>
            <h1 className="text-white font-bold text-xl leading-tight">{link.titulo}</h1>
          </div>

          {/* CTA */}
          <div className="bg-white px-6 py-6 flex flex-col items-center gap-4 -mt-6 rounded-t-3xl">
            <a
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-2xl text-base transition-opacity hover:opacity-90"
              style={{ background: '#00B4A0' }}
            >
              Acessar link
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <p className="text-gray-400 text-xs text-center truncate max-w-full">{link.url}</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Sicoob Aracoop · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  )
}

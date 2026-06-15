import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { getConfigs } from '@/lib/config'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const configs = await getConfigs()
  return {
    title: configs.titulo_site || 'Sicoob Aracoop | Links',
    description: configs.descricao_site || 'Acesse todos os serviços e campanhas do Sicoob Aracoop',
    openGraph: {
      title: configs.titulo_site || 'Sicoob Aracoop | Links',
      description: configs.descricao_site || 'Página oficial de links do Sicoob Aracoop',
      type: 'website',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const configs = await getConfigs()
  const ga4Id = configs.ga4_id || process.env.NEXT_PUBLIC_GA4_ID || ''
  const corPrimaria = configs.cor_primaria || '#00B4A0'

  return (
    <html lang="pt-BR">
      <head>
        <style>{`:root { --cor-primaria: ${corPrimaria}; }`}</style>
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

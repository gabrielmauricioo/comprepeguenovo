import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.comprepeguefoz.com.br'),
  title: {
    default: 'Compre Pegue | Móveis Usados em Foz do Iguaçu',
    template: '%s | Compre Pegue',
  },
  description:
    'Móveis seminovos, eletros e utilidades com preços justos em Foz do Iguaçu. Economia circular e qualidade para sua casa.',
  keywords: [
    'móveis usados',
    'Foz do Iguaçu',
    'bazar de móveis',
    'eletrodomésticos seminovos',
    'sofá usado',
    'compre e pegue',
  ],
  authors: [{ name: 'Compre Pegue' }],
  openGraph: {
    title: 'Compre Pegue | Móveis Usados em Foz do Iguaçu',
    description: 'Encontre móveis usados e seminovos revisados com o melhor custo-benefício da região.',
    url: 'https://www.comprepeguefoz.com.br',
    siteName: 'Compre Pegue',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '912657847802252');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=912657847802252&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {children}
      </body>
    </html>
  )
}
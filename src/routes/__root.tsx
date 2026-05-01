import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: "Pizzeria Pappagallo — La pizza d'asporto di Stezzano" },
      { name: 'description', content: "Pizzeria Pappagallo — Via Bergamo 12, Stezzano (BG). Pizza d'asporto e servizio a domicilio. Aperti fino all'1:00. Tel 035 593083" },
      { name: 'theme-color', content: '#c0392b' },
      { property: 'og:title', content: 'Pizzeria Pappagallo — Stezzano' },
      { property: 'og:description', content: "La pizza d'asporto di Stezzano dal cuore italiano. Aperti fino all'1:00!" },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'it_IT' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap' },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return <Outlet />
}

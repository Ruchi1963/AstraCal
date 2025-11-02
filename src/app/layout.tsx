import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AstraCal',
  description: 'High-fidelity Google Calendar clone'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 bg-white border-b z-20 px-6 py-3 flex justify-between">
          <h1 className="font-semibold text-astro-600">AstraCal</h1>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}


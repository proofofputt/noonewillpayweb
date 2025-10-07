import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'No One Will Pay - Bitcoin Education & Survey',
  description: 'Speedrunning Bitcoin Via Negativa - DMV Bitcoin Education Platform',
  keywords: ['Bitcoin', 'Ordinals', 'Runes', 'Education', 'DMV', 'Self-Custody'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

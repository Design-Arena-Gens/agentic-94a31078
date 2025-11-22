import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Healthcare Job Agent - Automated Job Search & Application',
  description: 'AI-powered job search and application agent for healthcare management positions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}

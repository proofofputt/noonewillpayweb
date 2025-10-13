'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BookClubPage() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">12 Months of Bitcoin Book Clubs</h1>
          <p className="text-gray-400">
            Your comprehensive guide to running Bitcoin education book clubs
          </p>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <div className="text-xl text-gray-400">Loading book club resources...</div>
            </div>
          </div>
        )}

        {/* GitBook Embed */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden" style={{ minHeight: '80vh' }}>
          <iframe
            src="https://no-one-will-pay.gitbook.io/12-months-of-bitcoin-book-clubs/"
            className="w-full"
            style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
            frameBorder="0"
            allowFullScreen
            onLoad={() => setLoading(false)}
            title="12 Months of Bitcoin Book Clubs"
          />
        </div>

        {/* External Link Button */}
        <div className="mt-6 text-center">
          <a
            href="https://no-one-will-pay.gitbook.io/12-months-of-bitcoin-book-clubs/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
          >
            Open in New Tab →
          </a>
        </div>
      </div>
    </div>
  )
}

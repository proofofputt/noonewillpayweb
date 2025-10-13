'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import QRCode from 'qrcode'

interface Claim {
  claim: {
    id: string
    pizzeriaId: string
    itemType: string
    quantity: number
    claimCode: string
    claimedAt: string
    redeemedAt: string | null
    expiresAt: string | null
  }
  pizzeria: {
    id: string
    name: string
    address: string
    city: string
    state: string
    phone: string
    imageUrl?: string
  } | null
}

export default function MyClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchClaims()
  }, [])

  useEffect(() => {
    if (selectedClaim) {
      generateQRCode(selectedClaim.claim.claimCode)
    }
  }, [selectedClaim])

  const fetchClaims = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pizza-bank/treasury/claim')
      const data = await response.json()

      if (data.success) {
        setClaims(data.claims)
      } else {
        setError(data.error || 'Failed to load claims')
      }
    } catch (err) {
      console.error('Error fetching claims:', err)
      setError('Failed to load claims')
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async (code: string) => {
    try {
      const url = await QRCode.toDataURL(code, {
        width: 256,
        margin: 2,
        color: {
          dark: '#F7931A',
          light: '#000000'
        }
      })
      setQrCodeUrl(url)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍕</div>
          <div className="text-xl">Loading your claims...</div>
        </div>
      </div>
    )
  }

  // Separate claims by status
  const activeClaims = claims.filter(c => !c.claim.redeemedAt && !isExpired(c.claim.expiresAt))
  const redeemedClaims = claims.filter(c => c.claim.redeemedAt)
  const expiredClaims = claims.filter(c => !c.claim.redeemedAt && isExpired(c.claim.expiresAt))

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/pizza-bank/treasury"
            className="text-bitcoin hover:text-orange transition-colors mb-4 inline-block"
          >
            ← Back to Treasury
          </Link>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange to-bitcoin bg-clip-text text-transparent">
            My Claimed Items
          </h1>
          <p className="text-gray-400">View and redeem your free pizza</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-green-500">
            <div className="text-3xl font-bold text-green-500 mb-1">{activeClaims.length}</div>
            <div className="text-gray-400">Active Claims</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <div className="text-3xl font-bold text-gray-500 mb-1">{redeemedClaims.length}</div>
            <div className="text-gray-400">Redeemed</div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <div className="text-3xl font-bold text-red-500 mb-1">{expiredClaims.length}</div>
            <div className="text-gray-400">Expired</div>
          </div>
        </motion.div>

        {/* No Claims */}
        {claims.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🍕</div>
            <h2 className="text-2xl font-bold mb-2">No Claims Yet</h2>
            <p className="text-gray-400 mb-6">
              You haven't claimed any treasury items yet
            </p>
            <Link
              href="/pizza-bank/treasury"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all"
            >
              Browse Treasury
            </Link>
          </motion.div>
        )}

        {/* Active Claims */}
        {activeClaims.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-green-500">✅ Ready to Redeem</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activeClaims.map((claim, index) => (
                <motion.div
                  key={claim.claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg border-2 border-green-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-3xl mb-2">
                        {claim.claim.itemType === 'slice' ? '🍕' : '🥧'}
                      </div>
                      <h3 className="text-xl font-bold capitalize mb-1">
                        {claim.claim.itemType}
                      </h3>
                      {claim.pizzeria && (
                        <div className="text-sm text-gray-400">
                          {claim.pizzeria.name}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-bitcoin">
                        {claim.claim.claimCode}
                      </div>
                      <div className="text-xs text-gray-400">Claim Code</div>
                    </div>
                  </div>

                  {claim.pizzeria && (
                    <div className="mb-4 pb-4 border-b border-gray-700 text-sm">
                      <div className="text-gray-400 mb-1">Location:</div>
                      <div>{claim.pizzeria.address}</div>
                      <div>{claim.pizzeria.city}, {claim.pizzeria.state}</div>
                      {claim.pizzeria.phone && (
                        <div className="mt-2">
                          <a
                            href={`tel:${claim.pizzeria.phone}`}
                            className="text-bitcoin hover:text-orange transition-colors"
                          >
                            📞 {claim.pizzeria.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Claimed:</span>
                      <span>{new Date(claim.claim.claimedAt).toLocaleDateString()}</span>
                    </div>
                    {claim.claim.expiresAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expires:</span>
                        <span>{new Date(claim.claim.expiresAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedClaim(claim)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-orange to-bitcoin rounded-lg font-bold hover:shadow-lg hover:shadow-orange/50 transition-all"
                  >
                    View QR Code
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Redeemed Claims */}
        {redeemedClaims.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-400">🎉 Redeemed</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {redeemedClaims.map((claim, index) => (
                <motion.div
                  key={claim.claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg border-2 border-gray-700 opacity-60"
                >
                  <div className="text-3xl mb-2">
                    {claim.claim.itemType === 'slice' ? '🍕' : '🥧'}
                  </div>
                  <h3 className="font-bold capitalize mb-1">{claim.claim.itemType}</h3>
                  {claim.pizzeria && (
                    <div className="text-sm text-gray-400 mb-2">{claim.pizzeria.name}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Redeemed {new Date(claim.claim.redeemedAt!).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Expired Claims */}
        {expiredClaims.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-red-500">⏰ Expired</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {expiredClaims.map((claim, index) => (
                <motion.div
                  key={claim.claim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg border-2 border-red-500 opacity-60"
                >
                  <div className="text-3xl mb-2">
                    {claim.claim.itemType === 'slice' ? '🍕' : '🥧'}
                  </div>
                  <h3 className="font-bold capitalize mb-1">{claim.claim.itemType}</h3>
                  {claim.pizzeria && (
                    <div className="text-sm text-gray-400 mb-2">{claim.pizzeria.name}</div>
                  )}
                  <div className="text-xs text-red-400">
                    Expired {new Date(claim.claim.expiresAt!).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedClaim && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedClaim(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border-2 border-bitcoin max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">
                {selectedClaim.claim.itemType === 'slice' ? '🍕' : '🥧'}
              </div>
              <h2 className="text-2xl font-bold mb-2">Claim Code</h2>
              {selectedClaim.pizzeria && (
                <p className="text-gray-400">{selectedClaim.pizzeria.name}</p>
              )}
            </div>

            {qrCodeUrl && (
              <div className="bg-black p-4 rounded-lg mb-6 flex justify-center">
                <img src={qrCodeUrl} alt="Claim QR Code" className="w-64 h-64" />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Claim Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedClaim.claim.claimCode}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-xl text-center font-bold text-bitcoin"
                />
                <button
                  onClick={() => copyToClipboard(selectedClaim.claim.claimCode)}
                  className="px-6 py-3 bg-bitcoin text-black rounded-lg font-bold hover:bg-orange transition-all"
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg mb-6">
              <p className="text-sm text-gray-300">
                <strong className="text-yellow-400">Instructions:</strong> Show this QR code or claim code at the counter to redeem your free {selectedClaim.claim.itemType}.
              </p>
            </div>

            <button
              onClick={() => setSelectedClaim(null)}
              className="w-full px-6 py-3 bg-gray-800 rounded-lg font-bold hover:bg-gray-700 transition-all"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface StickerCode {
  id: string
  code: string
  claimed: boolean
  claimedAt: string | null
  usageCount: number
  batchId: string | null
  active: boolean
  createdAt: string
}

interface BatchStats {
  batchId: string | null
  total: number
  claimed: number
  unclaimed: number
  totalUsage: number
}

export default function StickerCodesAdminPage() {
  const [codes, setCodes] = useState<StickerCode[]>([])
  const [batches, setBatches] = useState<BatchStats[]>([])
  const [stats, setStats] = useState({
    totalCodes: 0,
    claimed: 0,
    unclaimed: 0,
    active: 0,
  })

  const [generating, setGenerating] = useState(false)
  const [count, setCount] = useState(100)
  const [batchId, setBatchId] = useState('')
  const [notes, setNotes] = useState('')

  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)

  useEffect(() => {
    fetchCodes()
  }, [])

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/admin/generate-sticker-codes')
      if (response.ok) {
        const data = await response.json()
        setCodes(data.codes || [])
        setBatches(data.batches || [])
        setStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error fetching codes:', error)
    }
  }

  const generateCodes = async () => {
    if (count < 1 || count > 1000) {
      alert('Count must be between 1 and 1000')
      return
    }

    try {
      setGenerating(true)
      const response = await fetch('/api/admin/generate-sticker-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count,
          batchId: batchId || undefined,
          notes: notes || undefined,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Successfully generated ${data.generated} codes!${data.failed > 0 ? ` (${data.failed} failed)` : ''}`)
        fetchCodes() // Refresh the list
        setCount(100)
        setBatchId('')
        setNotes('')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error generating codes:', error)
      alert('Failed to generate codes')
    } finally {
      setGenerating(false)
    }
  }

  const downloadCSV = (batch?: string) => {
    const filteredCodes = batch
      ? codes.filter(c => c.batchId === batch)
      : codes

    const csv = [
      ['Code', 'Batch ID', 'Claimed', 'Usage Count', 'Created At'].join(','),
      ...filteredCodes.map(c =>
        [
          c.code,
          c.batchId || 'N/A',
          c.claimed ? 'Yes' : 'No',
          c.usageCount,
          new Date(c.createdAt).toISOString()
        ].join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sticker-codes${batch ? `-${batch}` : ''}.csv`
    a.click()
  }

  const filteredCodes = selectedBatch
    ? codes.filter(c => c.batchId === selectedBatch)
    : codes

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-bitcoin mb-2">Sticker Code Generator</h1>
          <p className="text-gray-400">Generate and manage sticker codes for referral campaigns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-3xl font-bold text-bitcoin">{stats.totalCodes}</div>
            <div className="text-sm text-gray-400 mt-2">Total Codes</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-3xl font-bold text-green-500">{stats.claimed}</div>
            <div className="text-sm text-gray-400 mt-2">Claimed</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-3xl font-bold text-yellow-500">{stats.unclaimed}</div>
            <div className="text-sm text-gray-400 mt-2">Unclaimed</div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="text-3xl font-bold text-blue-500">{batches.length}</div>
            <div className="text-sm text-gray-400 mt-2">Batches</div>
          </div>
        </div>

        {/* Generator */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-ordinal">Generate New Codes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Number of Codes (1-1000)</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                min={1}
                max={1000}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Batch ID (optional)</label>
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="e.g., CAMPAIGN-2024-Q1"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Conference handout"
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg"
              />
            </div>
          </div>

          <button
            onClick={generateCodes}
            disabled={generating}
            className="px-6 py-3 bg-bitcoin text-black font-bold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            {generating ? 'Generating...' : `Generate ${count} Codes`}
          </button>
        </div>

        {/* Batches */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-runes">Batches</h2>
            <button
              onClick={() => downloadCSV()}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              Download All CSV
            </button>
          </div>

          <div className="space-y-2">
            {batches.map((batch) => (
              <div
                key={batch.batchId || 'null'}
                className={`p-4 rounded border cursor-pointer transition-colors ${
                  selectedBatch === batch.batchId
                    ? 'bg-bitcoin/20 border-bitcoin'
                    : 'bg-gray-950 border-gray-800 hover:border-gray-600'
                }`}
                onClick={() => setSelectedBatch(batch.batchId)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold font-mono">{batch.batchId || 'No Batch ID'}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {batch.total} codes • {batch.claimed} claimed • {batch.totalUsage} referrals
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadCSV(batch.batchId || undefined)
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Download CSV
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Codes List */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Codes {selectedBatch && `- Batch: ${selectedBatch}`}
            </h2>
            {selectedBatch && (
              <button
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-2 bg-gray-800 text-white rounded text-sm"
              >
                Show All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredCodes.map((code) => (
              <div
                key={code.id}
                onClick={() => setSelectedCode(selectedCode === code.code ? null : code.code)}
                className={`p-4 rounded border cursor-pointer transition-all ${
                  code.claimed
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-gray-950 border-gray-800 hover:border-bitcoin'
                } ${selectedCode === code.code ? 'ring-2 ring-bitcoin' : ''}`}
              >
                <div className="font-bold font-mono text-lg mb-2">{code.code}</div>
                <div className="text-xs text-gray-400">
                  <div>{code.claimed ? `✓ Claimed` : '○ Unclaimed'}</div>
                  {code.claimed && <div>Refs: {code.usageCount}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code Display */}
        {selectedCode && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8" onClick={() => setSelectedCode(null)}>
            <div className="bg-gray-900 p-8 rounded-lg border border-bitcoin max-w-md" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-4 text-center">{selectedCode}</h3>
              <div className="bg-white p-6 rounded-lg mb-4">
                <QRCodeSVG
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${selectedCode}`}
                  size={300}
                  level="H"
                  includeMargin
                />
              </div>
              <div className="text-center text-sm text-gray-400 mb-4">
                {typeof window !== 'undefined' ? window.location.origin : ''}/?ref={selectedCode}
              </div>
              <button
                onClick={() => setSelectedCode(null)}
                className="w-full px-6 py-3 bg-bitcoin text-black font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

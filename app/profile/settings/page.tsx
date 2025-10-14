'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BIRTH_DECADES } from '@/lib/constants'

interface UserProfile {
  id: string
  email: string
  username: string
  referralCode: string
  birthDecade: string | null
  bitcoinAddress: string | null
  allocationPoints: string
}

export default function ProfileSettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [birthDecade, setBirthDecade] = useState('')
  const [username, setUsername] = useState('')
  const [bitcoinAddress, setBitcoinAddress] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile/me')

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to load profile')
      }

      const data = await response.json()

      if (data.success) {
        setProfile(data.user)
        setUsername(data.user.username)
        setBirthDecade(data.user.birthDecade || '')
        setBitcoinAddress(data.user.bitcoinAddress || '')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDecade: birthDecade || null,
          username,
          bitcoinAddress: bitcoinAddress || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setProfile(data.user)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker flex items-center justify-center">
        <div className="text-white text-2xl">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker flex items-center justify-center p-8">
        <div className="container-card p-12 bg-gradient-to-br from-orange via-orange-dark to-steel-800 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-white mb-6">{error || 'Please log in to access your profile'}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-orange text-white font-bold rounded-lg hover:bg-orange-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">Profile Settings</h1>
          <p className="text-sm text-gray-300">Manage your account preferences and demographics</p>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-600 text-white rounded-lg text-sm"
          >
            ✓ Profile updated successfully!
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Profile Stats Card */}
        <div className="container-card p-4 bg-gradient-to-br from-orange via-orange-dark to-steel-800 mb-4">
          <h2 className="text-lg font-bold text-white mb-3">Account Overview</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-orange-light mb-1">Email</div>
              <div className="text-white text-sm font-semibold">{profile.email}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-orange-light mb-1">Referral Code</div>
              <div className="text-white font-mono font-bold text-sm">{profile.referralCode}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-orange-light mb-1">Allocation Points</div>
              <div className="text-white font-bold text-lg">{parseFloat(profile.allocationPoints).toFixed(1)}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-orange-light mb-1">Member Since</div>
              <div className="text-white text-sm font-semibold">
                {new Date(profile.id).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="container-card p-4 bg-gradient-to-br from-orange via-orange-dark to-steel-800">
          <h2 className="text-lg font-bold text-white mb-4">Update Profile</h2>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium mb-1 text-white">
                Username (Optional)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 text-black border border-white rounded text-sm focus:border-orange focus:outline-none"
                placeholder="Enter username"
                minLength={3}
                maxLength={100}
              />
              <p className="text-xs text-gray-300 mt-1">
                3-100 characters, displayed publicly
              </p>
            </div>

            {/* Birth Decade */}
            <div>
              <label className="block text-xs font-medium mb-2 text-white">
                Birth Decade (Optional)
              </label>
              <div className="space-y-2">
                {BIRTH_DECADES.map((decade) => (
                  <label key={decade.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="birthDecade"
                      value={decade.value}
                      checked={birthDecade === decade.value}
                      onChange={(e) => setBirthDecade(e.target.value)}
                      className="w-4 h-4 text-orange focus:ring-orange"
                    />
                    <span className="text-sm text-white">{decade.label}</span>
                  </label>
                ))}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="birthDecade"
                    value=""
                    checked={birthDecade === ''}
                    onChange={(e) => setBirthDecade(e.target.value)}
                    className="w-4 h-4 text-orange focus:ring-orange"
                  />
                  <span className="text-sm text-white">Prefer not to say</span>
                </label>
              </div>
              <p className="text-xs text-gray-300 mt-2">
                Helps us provide better demographics insights
              </p>
            </div>

            {/* Bitcoin Taproot Address */}
            <div>
              <label className="block text-xs font-medium mb-1 text-white">
                Bitcoin Taproot Address (Optional)
              </label>
              <input
                type="text"
                value={bitcoinAddress}
                onChange={(e) => setBitcoinAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white/90 text-black border border-white rounded font-mono text-xs focus:border-orange focus:outline-none"
                placeholder="Starts with bc1p"
                maxLength={255}
              />
              <p className="text-xs text-gray-300 mt-1">
                Starts with bc1p - for receiving Bitcoin rewards
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.push('/my-dashboard')}
              className="px-4 py-2 bg-gray-600 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/20">
          <h3 className="text-white font-bold text-sm mb-1">🔒 Privacy Notice</h3>
          <p className="text-xs text-gray-300">
            Your birth decade is used anonymously for demographic analytics and will never be shared publicly.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

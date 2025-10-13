'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BIRTH_DECADES } from '@/lib/auth-helpers'

interface UserProfile {
  id: string
  email: string
  username: string
  referralCode: string
  birthDecade: string | null
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
    <div className="min-h-screen bg-gradient-to-br from-steel via-steel-light to-steel-darker py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-300">Manage your account preferences and demographics</p>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-600 text-white rounded-lg border-2 border-green-700"
          >
            ✓ Profile updated successfully!
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg border-2 border-red-700">
            {error}
          </div>
        )}

        {/* Profile Stats Card */}
        <div className="container-card p-6 bg-gradient-to-br from-orange via-orange-dark to-steel-800 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-orange-light mb-1">Email</div>
              <div className="text-white font-semibold">{profile.email}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-orange-light mb-1">Referral Code</div>
              <div className="text-white font-mono font-bold text-lg">{profile.referralCode}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-orange-light mb-1">Allocation Points</div>
              <div className="text-white font-bold text-2xl">{parseFloat(profile.allocationPoints).toFixed(1)}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-orange-light mb-1">Member Since</div>
              <div className="text-white font-semibold">
                {new Date(profile.id).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="container-card p-8 bg-gradient-to-br from-orange via-orange-dark to-steel-800">
          <h2 className="text-2xl font-bold text-white mb-6">Update Profile</h2>

          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 text-black border-2 border-white rounded-lg focus:border-orange focus:outline-none font-semibold"
                placeholder="Your username"
                minLength={3}
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-300 mt-1">
                3-100 characters, displayed publicly
              </p>
            </div>

            {/* Birth Decade */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Birth Decade (Optional)
              </label>
              <select
                value={birthDecade}
                onChange={(e) => setBirthDecade(e.target.value)}
                className="w-full px-4 py-3 bg-white/90 text-black border-2 border-white rounded-lg focus:border-orange focus:outline-none font-semibold cursor-pointer"
              >
                <option value="">Prefer not to say</option>
                {BIRTH_DECADES.map((decade) => (
                  <option key={decade.value} value={decade.value}>
                    {decade.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-300 mt-1">
                Helps us provide better demographics insights and compare your results with your generation
              </p>
            </div>

            {/* Current Selection Display */}
            {birthDecade && (
              <div className="bg-black/30 rounded-lg p-4 border border-orange">
                <div className="text-sm text-orange-light mb-1">Your Generation</div>
                <div className="text-white font-bold text-lg">
                  {BIRTH_DECADES.find(d => d.value === birthDecade)?.label}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.push('/my-dashboard')}
              className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-black/40 rounded-lg border border-white/20">
          <h3 className="text-white font-bold mb-2">🔒 Privacy Notice</h3>
          <p className="text-sm text-gray-300">
            Your birth decade is used anonymously for demographic analytics and will never be shared publicly.
            You can view aggregated results filtered by generation on the Results page.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

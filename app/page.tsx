'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import SurveyForm from '@/components/SurveyForm'
import ViaNegativaHero from '@/components/ViaNegativaHero'

export default function Home() {
  const [showSurvey, setShowSurvey] = useState(false)
  const surveyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showSurvey && surveyRef.current) {
      surveyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showSurvey])

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <ViaNegativaHero onBeginSurvey={() => setShowSurvey(true)} />

        {showSurvey && (
          <motion.div
            ref={surveyRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-16"
          >
            <SurveyForm />
          </motion.div>
        )}
      </div>

      {/* Footer with legal links */}
      <footer className="bg-steel-900 border-t border-steel-700 py-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} No One Will Pay. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/terms"
                className="hover:text-orange transition-colors underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-orange transition-colors underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

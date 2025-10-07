'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
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
    <main className="min-h-screen">
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
    </main>
  )
}

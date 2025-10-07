'use client'

import { motion } from 'framer-motion'

interface ViaNegativaHeroProps {
  onBeginSurvey: () => void
}

export default function ViaNegativaHero({ onBeginSurvey }: ViaNegativaHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-steel-700">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-steel-800 via-steel-700 to-steel-900">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="container-card p-12">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8 text-white"
          >
            <span>No</span>
            <span className="text-steel-500 mx-2">•</span>
            <span>One</span>
            <span className="text-steel-500 mx-2">•</span>
            <span>Will</span>
            <span className="text-steel-500 mx-2">•</span>
            <span>Pay</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl mb-12 text-steel-200"
          >
            Speedrunning Bitcoin Via Negativa
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-4 mb-12"
          >
            <p className="text-lg text-steel-200">
              Free • Fair • Decentralized
            </p>
            <p className="text-sm text-steel-300 max-w-2xl mx-auto">
              A Bitcoin education platform for the capital of the Free World.
            </p>
            <p className="text-base text-white max-w-3xl mx-auto mt-6 leading-relaxed">
              Please take this 3 question survey to test common knowledge. Sign up at the end to take the full 21 point questionnaire and sign up for free educational resources on: Bitcoin, Energy, Ordinals, and Runes.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBeginSurvey}
            className="px-8 py-4 bg-orange text-white font-bold text-lg rounded-lg hover:bg-orange-light transition-colors shadow-lg border-2 border-orange-dark"
          >
            Begin Survey
          </motion.button>
        </div>
      </div>
    </section>
  )
}

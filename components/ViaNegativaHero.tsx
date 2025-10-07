'use client'

import { motion } from 'framer-motion'

interface ViaNegativaHeroProps {
  onBeginSurvey: () => void
}

export default function ViaNegativaHero({ onBeginSurvey }: ViaNegativaHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-bitcoin rounded-full"
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

      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-8"
        >
          <span className="glow-bitcoin">No</span>
          <span className="text-gray-500 mx-2">•</span>
          <span className="glow-ordinal">One</span>
          <span className="text-gray-500 mx-2">•</span>
          <span className="glow-runes">Will</span>
          <span className="text-gray-500 mx-2">•</span>
          <span className="glow-bitcoin">Pay</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl mb-12 text-gray-300"
        >
          Speedrunning Bitcoin Via Negativa
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-4 mb-12"
        >
          <p className="text-lg text-gray-400">
            Free • Fair • Decentralized
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            A Bitcoin education platform for the DMV area. Learn about Bitcoin, Ordinals, and Runes
            through street interviews, surveys, and comprehensive educational content.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBeginSurvey}
          className="px-8 py-4 bg-bitcoin text-black font-bold text-lg rounded-lg hover:bg-orange-500 transition-colors via-negativa"
        >
          Begin Survey
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 text-sm text-gray-600"
        >
          <p>No pre-sales • No team allocations • No market makers</p>
          <p className="mt-2">Just pure Bitcoin education</p>
        </motion.div>
      </div>
    </section>
  )
}

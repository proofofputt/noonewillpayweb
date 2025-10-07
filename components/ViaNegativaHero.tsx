'use client'

import { motion } from 'framer-motion'

interface ViaNegativaHeroProps {
  onBeginSurvey: () => void
}

export default function ViaNegativaHero({ onBeginSurvey }: ViaNegativaHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-steel-700 to-steel-800">
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
        <div className="container-card p-12 bg-gradient-to-br from-orange via-orange-dark to-steel-800">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-4 mb-12"
          >
            <h1 className="text-xl md:text-3xl font-bold text-black">
              Free • Fair • Decentralized
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-4xl mx-auto">
              A Bitcoin education platform from the capital of the free world.
            </p>
            <div className="text-left max-w-3xl mx-auto mt-8 space-y-4">
              <p className="text-base text-white leading-relaxed">
                Please take this 3 question survey to help us research common knowledge.
              </p>
              <p className="text-base text-white leading-relaxed">
                Sign up at the end to take the full 21 point questionnaire, access educational resources on: Bitcoin, Energy, and innovative tools for human coordination.
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBeginSurvey}
            className="px-8 py-4 bg-orange text-black font-bold text-lg rounded-lg hover:bg-orange-dark transition-colors shadow-lg border-2 border-orange-darker"
          >
            Begin Survey
          </motion.button>
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'

const notItems = [
  {
    title: "No Pre-Sales",
    description: "We don't sell you anything before you understand what it is",
    icon: "🚫"
  },
  {
    title: "No Team Allocations",
    description: "No insiders get preferential treatment or hidden advantages",
    icon: "🚫"
  },
  {
    title: "No Market Makers",
    description: "No artificial price manipulation or coordinated schemes",
    icon: "🚫"
  },
  {
    title: "No Paid Marketing",
    description: "We don't pay for fake hype or manufactured excitement",
    icon: "🚫"
  },
  {
    title: "No Insider Benefits",
    description: "Everyone starts from the same place with the same information",
    icon: "🚫"
  },
  {
    title: "No Trust Required",
    description: "Verify everything yourself - that's the Bitcoin way",
    icon: "✓"
  }
]

export default function WhatWeDoNot() {
  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          What We <span className="text-bitcoin">Do NOT</span> Do
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-gray-800 rounded-lg hover:border-bitcoin transition-colors via-negativa"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-bitcoin">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-300 mb-4">
            We emphasize what is <span className="text-ordinal font-bold">absent</span> to highlight the <span className="text-runes font-bold">value</span>
          </p>
          <p className="text-gray-500">
            This is Via Negativa - defining something by what it is NOT
          </p>
        </motion.div>
      </div>
    </section>
  )
}

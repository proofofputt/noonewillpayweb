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
    <section className="py-20 px-4 bg-steel-700">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
        >
          What We <span className="text-orange">Do NOT</span> Do
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="container-card p-6 hover:border-orange transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-orange">{item.title}</h3>
              <p className="text-steel-200">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center container-card p-8"
        >
          <p className="text-xl text-white mb-4">
            We emphasize what is <span className="text-orange font-bold">absent</span> to highlight the <span className="text-orange font-bold">value</span>
          </p>
          <p className="text-steel-300">
            This is Via Negativa - defining something by what it is NOT
          </p>
        </motion.div>
      </div>
    </section>
  )
}

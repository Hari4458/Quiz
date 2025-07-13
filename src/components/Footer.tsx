import React from 'react'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 text-center"
    >
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <p className="text-white/80 text-sm mb-2">
          © 2025 IICMyREC. All rights reserved.
        </p>
        <p className="text-white/60 text-xs">
          Made by Hariraj
        </p>
      </div>
    </motion.footer>
  )
}
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Phone } from 'lucide-react'

interface NameEntryProps {
  onStart: (name: string, mobile: string) => void
}

export default function NameEntry({ onStart }: NameEntryProps) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && mobile.trim()) {
      onStart(name.trim(), mobile.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <img 
                src="/images.png" 
                alt="IIC Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">IIC Quiz Challenge</h1>
            <p className="text-purple-200">Test your knowledge with our interactive quiz!</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-white font-medium mb-2">
                Enter your name to begin
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Your name here..."
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-white font-medium mb-2">
                Enter your mobile number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Your mobile number..."
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>
            </motion.div>
            <motion.button
              type="submit"
              disabled={!name.trim() || !mobile.trim() || mobile.length < 10}
              disabled={!name.trim() || !mobile.trim() || mobile.length !== 10}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                name.trim() && mobile.trim() && mobile.length === 10
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <motion.span
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                className="inline-block"
              >
                Start Quiz ✨
              </motion.span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
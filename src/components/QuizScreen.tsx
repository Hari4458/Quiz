import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle } from 'lucide-react'
import { Quiz } from '../lib/supabase'

interface QuizScreenProps {
  quizzes: Quiz[]
  onSubmit: (answers: Record<string, string>) => void
}

export default function QuizScreen({ quizzes, onSubmit }: QuizScreenProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAnswerSelect = (quizId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [quizId]: option }))
  }

  const handleSubmit = () => {
    onSubmit(answers)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((currentQuestion + 1) / quizzes.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Quiz Challenge</h1>
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-purple-200 mt-2">
            Question {currentQuestion + 1} of {quizzes.length}
          </p>
        </div>
      </motion.div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              {quizzes[currentQuestion]?.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {['A', 'B', 'C', 'D'].map((option) => {
                const optionText = quizzes[currentQuestion]?.[`option_${option.toLowerCase()}` as keyof Quiz] as string
                const isSelected = answers[quizzes[currentQuestion]?.id] === option
                
                return (
                  <motion.button
                    key={option}
                    onClick={() => handleAnswerSelect(quizzes[currentQuestion].id, option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      isSelected
                        ? 'bg-purple-500/30 border-purple-400 text-white'
                        : 'bg-white/5 border-white/20 text-purple-100 hover:bg-white/10 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        isSelected ? 'bg-purple-500 border-purple-400' : 'border-white/40'
                      }`}>
                        {option}
                      </div>
                      <span className="text-lg">{optionText}</span>
                      {isSelected && <CheckCircle className="w-6 h-6 text-purple-300 ml-auto" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-white/10 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300"
              >
                Previous
              </button>

              {currentQuestion < quizzes.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  disabled={!answers[quizzes[currentQuestion]?.id]}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                >
                  Next
                </button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== quizzes.length}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                >
                  Submit Quiz 🎯
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
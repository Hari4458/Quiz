import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy, Heart } from 'lucide-react'
import { Quiz } from '../lib/supabase'

interface ResultScreenProps {
  quizzes: Quiz[]
  answers: Record<string, string>
  score: number
  participantName: string
}

export default function ResultScreen({ 
  quizzes, 
  answers, 
  score, 
  participantName
}: ResultScreenProps) {
  const isPerfectScore = score === quizzes.length

  useEffect(() => {
    if (isPerfectScore) {
      // Trigger confetti animation
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        })
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [isPerfectScore])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6"
          >
            {isPerfectScore ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <Heart className="w-12 h-12 text-white" />
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold text-white mb-4"
          >
            {isPerfectScore ? '🎉 Congratulations!' : '🤝 Thank You!'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl text-emerald-200 mb-2"
          >
            {participantName}, you scored {score} out of {quizzes.length}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-lg text-emerald-300"
          >
            {isPerfectScore 
              ? 'Perfect score! You\'re amazing! 🌟' 
              : 'Thanks for participating in our quiz! 💫'
            }
          </motion.p>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="space-y-4 mb-8"
        >
          {quizzes.map((quiz, index) => {
            const userAnswer = answers[quiz.id]
            const isCorrect = userAnswer === quiz.correct_option
            const correctOptionText = quiz[`option_${quiz.correct_option.toLowerCase()}` as keyof Quiz] as string
            const userAnswerText = userAnswer ? quiz[`option_${userAnswer.toLowerCase()}` as keyof Quiz] as string : 'Not answered'

            return (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 ${
                  isCorrect ? 'border-green-400' : 'border-red-400'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Question {index + 1}: {quiz.question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${
                    isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <p className="text-sm font-medium text-white mb-1">Your Answer:</p>
                    <p className={`text-lg ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                      {userAnswer} - {userAnswerText}
                    </p>
                  </div>
                  
                  {!isCorrect && (
                    <div className="p-4 rounded-xl bg-green-500/20">
                      <p className="text-sm font-medium text-white mb-1">Correct Answer:</p>
                      <p className="text-lg text-green-300">
                        {quiz.correct_option} - {correctOptionText}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
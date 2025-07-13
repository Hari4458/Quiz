import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Loader2 } from 'lucide-react'
import NameEntry from './components/NameEntry'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import { supabase, Quiz, Participant } from './lib/supabase'

type Screen = 'name' | 'quiz' | 'results' | 'loading'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('name')
  const [participantName, setParticipantName] = useState('')
  const [participantMobile, setParticipantMobile] = useState('')
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Check if user has already participated today
  const checkDailyParticipation = () => {
    const today = new Date().toDateString()
    const lastParticipation = localStorage.getItem('lastQuizParticipation')
    return lastParticipation === today
  }

  // Set daily participation flag
  const setDailyParticipation = () => {
    const today = new Date().toDateString()
    localStorage.setItem('lastQuizParticipation', today)
  }

  const fetchQuizzes = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .limit(5)

      if (error) throw error
      
      if (!data || data.length === 0) {
        throw new Error('No quizzes found in the database')
      }

      setQuizzes(data)
    } catch (err) {
      console.error('Error fetching quizzes:', err)
      setError(err instanceof Error ? err.message : 'Failed to load quizzes')
    }
  }

  const handleStartQuiz = async (name: string, mobile: string) => {
    // Check if user has already participated today
    if (checkDailyParticipation()) {
      setError('You have already participated in the quiz today. Please come back tomorrow!')
      return
    }

    setParticipantName(name)
    setParticipantMobile(mobile)
    setCurrentScreen('loading')
    await fetchQuizzes()
    setCurrentScreen('quiz')
  }

  const handleQuizSubmit = async (userAnswers: Record<string, string>) => {
    setAnswers(userAnswers)
    
    // Calculate score
    let correctCount = 0
    quizzes.forEach(quiz => {
      if (userAnswers[quiz.id] === quiz.correct_option) {
        correctCount++
      }
    })
    setScore(correctCount)

    // Save to database
    try {
      const participant: Participant = {
        name: participantName,
        mobile_number: participantMobile,
        correct_count: correctCount
      }

      const { error } = await supabase
        .from('participants')
        .insert([participant])

      if (error) {
        console.error('Error saving participant:', error)
      } else {
        // Mark as participated today
        setDailyParticipation()
      }
    } catch (err) {
      console.error('Error saving to database:', err)
    }

    setCurrentScreen('results')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center border border-red-300/20"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null)
              if (!checkDailyParticipation()) {
                setCurrentScreen('name')
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300"
          >
            {checkDailyParticipation() ? 'Come Back Tomorrow' : 'Try Again'}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentScreen === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NameEntry onStart={handleStartQuiz} />
          </motion.div>
        )}

        {currentScreen === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Loading Quiz...</h2>
              <p className="text-purple-200">Preparing your questions</p>
            </div>
          </motion.div>
        )}

        {currentScreen === 'quiz' && quizzes.length > 0 && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuizScreen quizzes={quizzes} onSubmit={handleQuizSubmit} />
          </motion.div>
        )}

        {currentScreen === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultScreen
              quizzes={quizzes}
              answers={answers}
              score={score}
              participantName={participantName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
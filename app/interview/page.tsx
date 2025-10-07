'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { getRandomQuestions } from '@/lib/questions'

export default function StreetInterviewPage() {
  const [sessionId, setSessionId] = useState('')
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [participantInfo, setParticipantInfo] = useState<any>(null)
  const [showQR, setShowQR] = useState(true)
  const [recording, setRecording] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    // Generate unique session ID for surveyor
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(id)
    setQuestions(getRandomQuestions())
    setQrCodeUrl(`${window.location.origin}/interview/join?session=${id}`)
  }, [])

  const startInterview = (info: any) => {
    setParticipantInfo(info)
    setShowQR(false)
  }

  const submitAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer })

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeInterview()
    }
  }

  const completeInterview = async () => {
    const submission = {
      sessionId,
      participantInfo,
      questions: questions.map((q, i) => ({
        id: q.id,
        question: q.question,
        answer: answers[i],
        difficulty: q.difficulty,
      })),
      timestamp: new Date().toISOString(),
      onCamera: recording,
    }

    await fetch('/api/submit-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    })

    // Reset for next participant
    setCurrentQuestion(0)
    setAnswers({})
    setParticipantInfo(null)
    setShowQR(true)
    setQuestions(getRandomQuestions()) // New questions each time
  }

  if (showQR) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-8">
            <span className="text-bitcoin">Street Interview Mode</span>
          </h1>

          <div className="bg-white p-8 rounded-lg mb-6 inline-block">
            {qrCodeUrl && (
              <QRCodeSVG
                value={qrCodeUrl}
                size={300}
              />
            )}
          </div>

          <p className="text-xl text-gray-300 mb-4">
            Scan QR Code to Join Survey
          </p>

          <div className="max-w-md mx-auto text-left bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="font-bold mb-3 text-ordinal">Surveyor Instructions:</h3>
            <ol className="space-y-2 text-sm text-gray-400">
              <li>1. Have participant scan QR code</li>
              <li>2. They enter basic info on their phone</li>
              <li>3. You ask questions verbally</li>
              <li>4. You input their answers here</li>
              <li>5. Submit when complete</li>
            </ol>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <label className="flex items-center gap-2 text-gray-400">
              <input
                type="checkbox"
                checked={recording}
                onChange={(e) => setRecording(e.target.checked)}
                className="w-5 h-5"
              />
              Recording on camera
            </label>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Session ID: {sessionId}
          </p>
        </motion.div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-bitcoin">Interview in Progress</h2>
            <p className="text-gray-400">
              Participant: {participantInfo?.email || 'Anonymous'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
            <p className="text-sm text-gray-500">Session: {sessionId.slice(-6)}</p>
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900 p-8 rounded-lg border border-gray-800"
        >
          <div className="mb-6">
            <span className={`text-xs px-3 py-1 rounded ${
              question.difficulty === 'easy' ? 'bg-green-900 text-green-300' :
              question.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
              'bg-red-900 text-red-300'
            }`}>
              {question.difficulty.toUpperCase()}
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-white">
            {question.question}
          </h3>

          {question.hint && (
            <p className="text-gray-500 mb-6">💡 {question.hint}</p>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Participant's Answer (numbers only)
            </label>
            <input
              type="text"
              value={answers[currentQuestion] || ''}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion]: e.target.value })}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-bitcoin focus:outline-none text-2xl font-mono"
              placeholder="Enter answer..."
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Previous
              </button>
            )}

            <button
              onClick={() => submitAnswer(answers[currentQuestion] || '')}
              disabled={!answers[currentQuestion]}
              className="flex-1 py-3 bg-bitcoin text-black font-bold rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
            >
              {currentQuestion === questions.length - 1 ? 'Submit Interview' : 'Next Question →'}
            </button>
          </div>
        </motion.div>

        <div className="mt-6 p-4 bg-gray-950 rounded border border-gray-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress:</span>
            <span className="text-bitcoin font-mono">
              {Object.keys(answers).length}/{questions.length} answered
            </span>
          </div>
          <div className="mt-2 bg-gray-800 rounded-full h-2">
            <div
              className="bg-bitcoin h-2 rounded-full transition-all"
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {recording && (
          <div className="mt-4 p-4 bg-red-950 border border-red-800 rounded text-center">
            <span className="text-red-400">🔴 Recording in Progress</span>
          </div>
        )}
      </div>
    </div>
  )
}

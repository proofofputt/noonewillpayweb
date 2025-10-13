import questionsData from '../data/questions.json'

export interface Question {
  id: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  question: string
  hint?: string
  answerType: 'number' | 'decimal' | 'multipleChoice'
  correctAnswer?: number
  tolerance: number
  exampleAnswer?: number
  options?: string[]
  correctOption?: string
}

export function getRandomQuestions(): Question[] {
  const questions = questionsData.questions as Question[]

  // Separate questions by difficulty
  const easy = questions.filter(q => q.difficulty === 'easy')
  const medium = questions.filter(q => q.difficulty === 'medium')
  const hard = questions.filter(q => q.difficulty === 'hard')

  // Get one random question from each difficulty level
  const randomEasy = easy[Math.floor(Math.random() * easy.length)]
  const randomMedium = medium[Math.floor(Math.random() * medium.length)]
  const randomHard = hard[Math.floor(Math.random() * hard.length)]

  return [randomEasy, randomMedium, randomHard]
}

export function getAllQuestions(): Question[] {
  return questionsData.questions as Question[]
}

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Question[] {
  const questions = questionsData.questions as Question[]
  return questions.filter(q => q.difficulty === difficulty)
}

export function validateAnswer(question: Question, answer: string): boolean {
  // Handle multiple choice questions
  if (question.answerType === 'multipleChoice') {
    return answer === question.correctOption
  }

  // Handle numeric questions
  const numAnswer = parseFloat(answer)

  if (isNaN(numAnswer)) {
    return false
  }

  if (question.correctAnswer !== undefined) {
    return Math.abs(numAnswer - question.correctAnswer) <= question.tolerance
  }

  // For questions without a correct answer (personal questions), any number is valid
  return true
}

export interface ScoredQuestion extends Question {
  userAnswer: string
  isCorrect: boolean
  pointsEarned: number
}

export function scoreQuestions(questions: Question[], answers: { [key: string]: string }): {
  scoredQuestions: ScoredQuestion[]
  totalScore: number
  maxScore: number
  percentage: number
} {
  const scoredQuestions: ScoredQuestion[] = questions.map((q, index) => {
    const answerKey = `question${index + 1}`
    const userAnswer = answers[answerKey] || ''
    const isCorrect = validateAnswer(q, userAnswer)
    const pointValue = (q as any).pointValue || 1 // Default to 1 point if not specified

    return {
      ...q,
      userAnswer,
      isCorrect,
      pointsEarned: isCorrect ? pointValue : 0
    }
  })

  const totalScore = scoredQuestions.reduce((sum, q) => sum + q.pointsEarned, 0)
  const maxScore = scoredQuestions.reduce((sum, q) => sum + ((q as any).pointValue || 1), 0)
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  return {
    scoredQuestions,
    totalScore,
    maxScore,
    percentage
  }
}

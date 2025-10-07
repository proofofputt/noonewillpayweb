import questionsData from '../../../data/questions.json'

export interface Question {
  id: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  question: string
  hint?: string
  answerType: 'number' | 'decimal'
  correctAnswer?: number
  tolerance: number
  exampleAnswer?: number
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

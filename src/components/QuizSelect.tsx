import { actions } from 'astro:actions'
import { Fragment, useMemo, useRef, useState } from 'react'
import type { Question } from '../actions'

export type Answer = { answer: string; correct: boolean }

const shuffleAnswers = (answers: Answer[]) => {
  for (let i = answers.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[answers[i], answers[j]] = [answers[j], answers[i]]
  }
}
const ids = ['a', 'b', 'c', 'd']
const QuizSelect = ({
  categories,
}: {
  categories: { id: string; name: string }[]
}) => {
  const nextQuestionRef = useRef<HTMLButtonElement>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(
    questions[currentIndex]
  )
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    undefined
  )
  const { answers, correctAnswer } = useMemo(() => {
    if (!currentQuestion?.answers) return { answers: {}, correctAnswer: '' }
    const tempAns = currentQuestion?.answers?.map((answer, idx) => ({
      answer,
      correct: idx === currentQuestion.correct_answer,
    }))
    shuffleAnswers(tempAns)
    let correctAnswer = ''
    const ans = tempAns.reduce((prev, curr, idx) => {
      const id = ids[idx]
      if (curr.correct) {
        correctAnswer = id
      }
      prev[id] = curr
      return prev
    }, {} as Record<string, Answer>)
    return {
      answers: ans,
      correctAnswer,
    }
  }, [currentQuestion])

  return (
    <div className="mt-6 h-full">
      <form
        id="category-form"
        className="flex gap-2 flex-wrap items-center"
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const { data, error } = await actions.getQuestionsByCategory(formData)
          if (!error) {
            setQuestions(data)
            setCurrentQuestion(data[0])
            setCurrentIndex(0)
            setSelectedAnswer(undefined)
          }
        }}
      >
        <label htmlFor="category-select">Choose a Category</label>
        <select form="category-form" name="categoryId" id="category-select">
          <option value="">--Please choose an option--</option>
          {categories.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
        <button>
          {currentQuestion ? 'Change Category' : 'Select Category'}
        </button>
      </form>

      {!!currentQuestion && (
        <article className="border border-solid border-black rounded-sm h-4/6 shadow-md p-6 mt-6">
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                for (const [, aKey] of formData) {
                  setSelectedAnswer(aKey as any as string)
                }
                if (nextQuestionRef.current) {
                  nextQuestionRef.current.focus()
                }
              }}
            >
              <fieldset className="text-start">
                <legend>{currentQuestion.question}</legend>
                {Object.entries(answers).map(([aKey, val], idx) => {
                  return (
                    <Fragment key={currentQuestion.id + '-question-' + aKey}>
                      <input
                        autoFocus={!idx}
                        name="answer"
                        type="radio"
                        id={currentQuestion.id + '-question-' + aKey}
                        value={aKey}
                      />
                      <label htmlFor={currentQuestion.id + '-question-' + aKey}>
                        {val.answer}
                      </label>
                      <br />
                    </Fragment>
                  )
                })}
              </fieldset>
              <button>Submit answer</button>
            </form>
          </div>

          <div>
            {selectedAnswer && (
              <p>
                {answers[selectedAnswer].correct
                  ? 'Nice one!'
                  : 'Maybe next time,'}{' '}
                correct answer was "{answers[correctAnswer].answer}"
              </p>
            )}
            {questions.length > 1 ? (
              <button
                ref={nextQuestionRef}
                onClick={() => {
                  if (currentIndex === questions.length - 1) {
                    setCurrentQuestion(questions[0])
                    setCurrentIndex(0)
                  } else {
                    setCurrentQuestion(questions[currentIndex + 1])
                    setCurrentIndex(currentIndex + 1)
                  }

                  setSelectedAnswer(undefined)
                }}
              >
                {currentIndex === questions.length - 1
                  ? 'Start from Beginning'
                  : 'Next Question'}
              </button>
            ) : (
              <p>Only one question in this Category</p>
            )}
          </div>
        </article>
      )}
    </div>
  )
}

export default QuizSelect

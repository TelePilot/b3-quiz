import React, { Fragment, useRef } from 'react'
import type { Question } from '../actions'
import type { Answer } from './QuizSelect'

const AnswerContainer = ({
  questions,
  currentQuestion,
  setCurrentQuestion,
  answers,
  correctAnswer,
  currentIndex,
  setCurrentIndex,
  selectedAnswer,
  setSelectedAnswer,
}: {
  questions: Question[]
  currentQuestion: Question
  setCurrentQuestion: (v: Question) => void
  answers: Record<string, Answer>
  currentIndex: number
  setCurrentIndex: (v: number) => void
  correctAnswer: string
  selectedAnswer?: string
  setSelectedAnswer: (v: string | undefined) => void
}) => {
  const nextQuestionRef = useRef<HTMLButtonElement>(null)
  return (
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
            {answers[selectedAnswer].correct ? 'Nice one!' : 'Maybe next time,'}{' '}
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
  )
}

export default AnswerContainer

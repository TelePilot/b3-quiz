import { useAuth } from '@clerk/astro/react'
import { actions } from 'astro:actions'
import { useEffect, useState } from 'react'
type Question = {
  id: number
  user_id: number
  question: string
  answers: string[]
  correct_answer: number
  category: number
  sub_category: string
}

type ExtendedQuestion = Question & { catName?: string }
const QuestionsTable = ({ userName }: { userName?: string | null }) => {
  const auth = useAuth()
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<ExtendedQuestion[] | undefined>(
    undefined
  )
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      try {
        const { data } = await actions.getMyQuestions(auth.userId!)
        const { data: categories } = await actions.getCategories()
        const newQuestions: ExtendedQuestion[] =
          data?.map((q) => ({
            ...q,
            catName: categories?.find((i) => i.id === q.category)?.name,
          })) ?? []
        setQuestions(newQuestions)
      } catch (error) {}
      setLoading(false)
    }
    if (!questions) {
      fetchQuestions()
    }
  }, [])
  const deleteQuestion = async (id: number) => {
    setLoading(true)
    try {
      const { error } = await actions.deleteQuestion({
        questionId: id,
      })
      if (!error) {
        setQuestions(questions?.filter((q) => q.id !== id))
      }
    } catch (error) {}
    setLoading(false)
  }
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th className="border border-black text-start px-2">Question</th>
            <th className="border border-black text-start px-2">Category</th>
            <th className="border border-black text-start px-2">Edit</th>
            <th className="border border-black text-start px-2">Delete</th>
          </tr>
          {questions?.map(({ id, question, catName }) => (
            <tr key={id}>
              <td className="border border-black text-start px-2">
                {question}
              </td>
              <td className="border border-black text-start px-2">{catName}</td>
              <td className="border border-black text-start px-2">
                <a href={`/dashboard/edit-questions/${id}`}>Edit</a>
              </td>
              <td className="border border-black text-start px-2">
                <button onClick={() => deleteQuestion(id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading...</p>}
      {!loading && questions && !questions.length && (
        <p>You have not created any questions</p>
      )}
    </div>
  )
}

export default QuestionsTable

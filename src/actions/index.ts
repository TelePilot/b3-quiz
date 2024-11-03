import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { supabase } from './client'
export type Question = {
  id: number
  created_by: number
  question: string
  answers: string[]
  correct_answer: number
  sub_category: string
}
export const server = {
  getCategories: defineAction({
    handler: async () => {
      const { data } = await supabase.from('categories').select('*')
      return data
    },
  }),
  getQuestionsByCategory: defineAction({
    accept: 'form',
    input: z.object({
      categoryId: z.string(),
    }),
    handler: async (input) => {
      const { data } = await supabase
        .from('questions')
        .select()
        .eq('category', input.categoryId)
      return data as Question[]
    },
  }),
}

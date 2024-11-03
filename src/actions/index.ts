import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { createClerkSupaClient, supabase } from './client'
export type Question = {
  id: number
  created_by: number
  question: string
  answers: string[]
  correct_answer: number
  sub_category: string
}
export type Category = {
  id: number
  created_by: number
  name: string
  sub_category: string
}
export const server = {
  getCategories: defineAction({
    handler: async () => {
      const { data } = await supabase.from('categories').select('*')
      return data as Category[]
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
  getMyQuestions: defineAction({
    input: z.string(),
    handler: async (input) => {
      const { data } = await supabase
        .from('questions')
        .select()
        .eq('user_id', input)
      return data as Question[]
    },
  }),
  createNewQuestion: defineAction({
    accept: 'form',
    input: z.object({
      existingCategory: z.string(),
      newCategory: z.string(),
      question: z.string(),
      answers: z.array(z.string()),
      correctAnswer: z.string(),
      sessionToken: z.string(),
    }),
    handler: async (input) => {
      if (input.newCategory) {
        await server.createNewCategory({
          newCategory: input.newCategory,
          sessionToken: input.sessionToken,
        })
      }
    },
  }),
  createNewCategory: defineAction({
    input: z.object({
      newCategory: z.string(),
      sessionToken: z.string(),
    }),
    handler: async (input) => {
      if (input.newCategory) {
        const client = createClerkSupaClient(input.sessionToken)
        const { data } = await client.from('categories').insert({
          name: input.newCategory,
        })
      }
    },
  }),
}

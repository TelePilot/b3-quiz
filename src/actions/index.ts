import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { createClerkSupaClient, supabase } from './client'
export type Question = {
  id: number
  user_id: number
  question: string
  answers: string[]
  correct_answer: number
  category: number
  sub_category: string
}
export type Category = {
  id: number
  user_id: number
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
  deleteQuestion: defineAction({
    input: z.object({
      questionId: z.number(),
    }),
    handler: async (input, context) => {
      const sessionToken = await context.locals.auth().getToken({
        template: 'supabase',
      })
      if (!sessionToken) {
        throw new Error('Not authenticated')
      }
      const client = createClerkSupaClient(sessionToken)
      const { error } = await client
        .from('questions')
        .delete()
        .eq('id', input.questionId)
      return error
    },
  }),
  createNewQuestion: defineAction({
    accept: 'form',
    input: z.object({
      existingCategory: z.string().nullable(),
      newCategory: z.string().nullable(),
      question: z.string(),
      answers: z.array(z.string()),
      correctAnswer: z.string(),
    }),
    handler: async (input, context) => {
      const sessionToken = await context.locals.auth().getToken({
        template: 'supabase',
      })
      if (!sessionToken) {
        throw new Error('Not authenticated')
      }
      let catId = input.existingCategory
      if (input.newCategory) {
        const { data: existingCategories } = await server.getCategories()
        const alreadyExist = existingCategories?.find(
          (v) => v.name.toLowerCase() === input.newCategory?.toLowerCase()
        )
        if (alreadyExist) {
          catId = `${alreadyExist.id}`
        } else {
          const { data } = await server.createNewCategory({
            newCategory: input.newCategory,
          })
          if (data?.id) {
            catId = `${data?.id}`
          }
        }
      }
      if (!catId) {
        return new Error('Unable to process Category')
      }
      const client = createClerkSupaClient(sessionToken)
      await client.from('questions').insert({
        question: input.question,
        answers: input.answers,
        correct_answer: input.correctAnswer,
        category: +catId,
      })
    },
  }),
  updateQuestion: defineAction({
    accept: 'form',
    input: z.object({
      existingCategory: z.string().nullable(),
      newCategory: z.string().nullable(),
      question: z.string(),
      answers: z.array(z.string()),
      correctAnswer: z.string(),
    }),
    handler: async (input, context) => {
      const { id } = context.params
      const sessionToken = await context.locals.auth().getToken({
        template: 'supabase',
      })
      if (!sessionToken) {
        throw new Error('Not authenticated')
      }
      let catId = input.existingCategory
      if (input.newCategory) {
        const { data: existingCategories } = await server.getCategories()
        const alreadyExist = existingCategories?.find(
          (v) => v.name.toLowerCase() === input.newCategory?.toLowerCase()
        )
        if (alreadyExist) {
          catId = `${alreadyExist.id}`
        } else {
          const { data } = await server.createNewCategory({
            newCategory: input.newCategory,
          })
          if (data?.id) {
            catId = `${data?.id}`
          }
        }
      }
      if (!catId) {
        return new Error('Unable to process Category')
      }
      const client = createClerkSupaClient(sessionToken)
      await client
        .from('questions')
        .update({
          question: input.question.trim(),
          answers: input.answers,
          correct_answer: +input.correctAnswer,
          category: +catId,
        })
        .eq('id', id)
    },
  }),
  createNewCategory: defineAction({
    input: z.object({
      newCategory: z.string(),
    }),
    handler: async (input, context) => {
      const sessionToken = await context.locals.auth().getToken({
        template: 'supabase',
      })
      if (!sessionToken) {
        throw new Error('Not authenticated')
      }
      if (input.newCategory) {
        const client = createClerkSupaClient(sessionToken)
        const { data } = await client
          .from('categories')
          .insert({
            name: input.newCategory,
          })
          .select('id')
        return data?.[0]
      }
    },
  }),
}

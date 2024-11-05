// @ts-check
import { defineConfig, envField } from 'astro/config'

import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import clerk from '@clerk/astro'

import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), clerk()],
  output: 'server',
  redirects: {
    dashboard: 'dashboard/new-question',
  },
  adapter: vercel(),
  experimental: {
    env: {
      schema: {
        SUPA_URL: envField.string({
          context: 'server',
          access: 'public',
        }),
        SUPA_KEY: envField.string({
          context: 'server',
          access: 'public',
        }),
        PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
          context: 'server',
          access: 'public',
        }),
        CLERK_SECRET_KEY: envField.string({
          context: 'server',
          access: 'secret',
        }),
      },
    },
  },
})

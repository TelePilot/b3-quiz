// @ts-check
import { defineConfig, envField } from 'astro/config'

import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node'
import react from '@astrojs/react'
import clerk from '@clerk/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), clerk()],
  output: 'server',
  adapter: node({ mode: 'standalone' }),
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

// @ts-check
import { defineConfig, envField } from 'astro/config'

import tailwind from '@astrojs/tailwind'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
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
      },
    },
  },
})

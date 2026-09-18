import type { Preview } from '@storybook/react'

/* One import, generated. crnl-loader.js owns the stylesheet list, the order
   and the cascade layers; scripts/build-css-bundle.mjs writes them out as
   crnl-layers.css so anything driven by a bundler gets the same cascade a
   page gets.

   This used to be a hand-written list of 24 imports, which RULES §1 forbids
   and which had already gone wrong: it was missing ui-fonts.css, so Storybook
   rendered without the icon font, and it had no layers, so its cascade
   differed from every other surface. Regenerate with `npm run build:docs`. */
import '../css/crnl-layers.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  globalTypes: {
    theme: {
      description: 'Theme',
      defaultValue: '',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: '', title: 'Base' },
          { value: 'ink', title: 'Ink' },
          { value: 'signal', title: 'Signal' },
          { value: 'moss', title: 'Moss' },
          { value: 'ember', title: 'Ember' },
          { value: 'violet', title: 'Violet' }
        ],
        dynamicTitle: true
      }
    },
    mode: {
      description: 'Color mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      }
    }
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals['theme'] ?? ''
      const mode = context.globals['mode'] ?? 'light'
      if (theme) document.documentElement.setAttribute('data-theme', theme)
      else document.documentElement.removeAttribute('data-theme')
      document.documentElement.setAttribute('data-mode', mode)
      return Story()
    }
  ]
}

export default preview

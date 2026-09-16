import type { Preview } from '@storybook/react'

// Import all CSS files in correct load order
import '../css/design-tokens-master.css'
import '../css/themes.css'
import '../css/spacing-tokens.css'
import '../css/container-tokens.css'
import '../css/border-effects-tokens.css'
import '../css/fonts.css'
import '../css/display-fonts.css'
import '../css/text-styles-system.css'
import '../css/icons.css'
import '../css/card-components.css'
import '../css/interactive-tokens.css'
import '../css/button-components.css'
import '../css/system-ui.css'
import '../css/list-row-components.css'
import '../css/table-components.css'
import '../css/input-components.css'
import '../css/tag-chip-components.css'
import '../css/nav-components.css'
import '../css/ios-nav-components.css'
import '../css/web-footer-components.css'
import '../css/product-patterns.css'
import '../css/boilerplate.css'
import '../css/platform-tokens.css'

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

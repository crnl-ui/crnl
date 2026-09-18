import type { Meta, StoryObj } from '@storybook/react'
import { IOSPageNav } from './IOSPageNav'

const meta: Meta<typeof IOSPageNav> = {
  title: 'iOS/IOSPageNav',
  component: IOSPageNav,
  parameters: { layout: 'fullscreen' }
}
export default meta
type Story = StoryObj<typeof IOSPageNav>

/* A fixture. A real screen resolves the title from a record (RULES §6). */
const title = 'Page Title'

export const WithBack: Story = {
  args: { title, onBack: () => {} }
}

export const WithTrailingAction: Story = {
  args: { title, onBack: () => {}, trailingIcon: 'ios_share', onTrailingAction: () => {} }
}

export const TitleOnly: Story = {
  name: 'No back button (a root page)',
  args: { title }
}

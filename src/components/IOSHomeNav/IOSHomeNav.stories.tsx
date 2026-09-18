import type { Meta, StoryObj } from '@storybook/react'
import { IOSHomeNav } from './IOSHomeNav'

const meta: Meta<typeof IOSHomeNav> = {
  title: 'iOS/IOSHomeNav',
  component: IOSHomeNav,
  parameters: { layout: 'fullscreen' }
}
export default meta
type Story = StoryObj<typeof IOSHomeNav>

/* Fixtures. A real screen resolves these from a record (RULES §6). Title case,
   not caps — a caps display face bakes that in, and one that does not should
   not be shouted at (RULES §5). */
const title = 'Home'
const subtabs = ['Upcoming', 'Past', 'Saved']

export const Default: Story = {
  args: { title }
}

export const WithControls: Story = {
  args: { title, showNotification: true, onNotification: () => {}, avatarLabel: 'A', onAvatar: () => {} }
}

export const WithSubtabs: Story = {
  args: { title, subtabs, activeSubtab: 0, showNotification: true, avatarLabel: 'A' }
}

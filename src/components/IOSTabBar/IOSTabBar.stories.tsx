import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { IOSTabBar } from './IOSTabBar'
import type { IOSTab } from './IOSTabBar.types'

const meta: Meta<typeof IOSTabBar> = {
  title: 'iOS/IOSTabBar',
  component: IOSTabBar,
  parameters: { layout: 'fullscreen' }
}
export default meta
type Story = StoryObj<typeof IOSTabBar>

/* Fixtures, and icon names from the shipped subset — one that is not in it
   renders as its own letters (`npm run check:icons`). */
const tabs: IOSTab[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'saved', label: 'Saved', icon: 'confirmation_number' },
  { id: 'account', label: 'Account', icon: 'person' }
]

export const Default: Story = {
  args: { tabs, activeTab: 'home', onTabChange: () => {} }
}

export const Interactive: Story = {
  render: function Interactive() {
    const [active, setActive] = useState('home')
    return <IOSTabBar tabs={tabs} activeTab={active} onTabChange={setActive} />
  }
}

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Tabs } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof Tabs>

const sampleTabs = [
  { value: 'seats', label: 'Seats' },
  { value: 'summary', label: 'Summary' },
  { value: 'payment', label: 'Payment' }
]

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [active, setActive] = useState('seats')
    return (
      <Tabs
        tabs={sampleTabs}
        activeTab={active}
        onChange={setActive}
        ariaLabel="Checkout steps"
      />
    )
  }
}

export const Neutral: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [active, setActive] = useState('seats')
    return (
      <Tabs
        tabs={sampleTabs}
        activeTab={active}
        onChange={setActive}
        neutral
        ariaLabel="Checkout steps"
      />
    )
  }
}

import type { Meta, StoryObj } from '@storybook/react'
import { Steps } from './Steps'

const meta: Meta<typeof Steps> = {
  title: 'Components/Steps',
  component: Steps,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof Steps>

export const Default: Story = {
  args: {
    steps: [
      { label: 'Seats', state: 'completed' },
      { label: 'Summary', state: 'active' },
      { label: 'Payment', state: 'pending' }
    ]
  }
}

export const BrandVariant: Story = {
  args: {
    brand: true,
    steps: [
      { label: 'Seats', state: 'completed' },
      { label: 'Summary', state: 'active' },
      { label: 'Payment', state: 'pending' }
    ]
  }
}

export const AllCompleted: Story = {
  args: {
    steps: [
      { label: 'Seats', state: 'completed' },
      { label: 'Summary', state: 'completed' },
      { label: 'Payment', state: 'completed' }
    ]
  }
}

import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Foundation/Icon',
  component: Icon,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    name: { control: 'text' },
    size: {
      control: 'select',
      options: [100, 200, 300, 400, 500, 600]
    },
    outlined: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'home',
    size: 300,
    outlined: false
  }
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon name="star" size={100} />
      <Icon name="star" size={200} />
      <Icon name="star" size={300} />
      <Icon name="star" size={400} />
      <Icon name="star" size={500} />
      <Icon name="star" size={600} />
    </div>
  )
}

export const FilledVsOutlined: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon name="favorite" size={400} />
      <Icon name="favorite" size={400} outlined />
    </div>
  )
}

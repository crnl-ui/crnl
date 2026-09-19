import type { Meta, StoryObj } from '@storybook/react'
import { Button, CircleButton } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary', 'secondary', 'tertiary', 'transactional',
        'neutral', 'destructive', 'white', 'white-tertiary', 'black'
      ]
    },
    size: { control: 'select', options: [700, 300, 100] },
    iconPosition: { control: 'select', options: ['leading', 'trailing'] },
    fill: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 700,
    children: 'Save changes'
  }
}

export const Transactional: Story = {
  args: {
    variant: 'transactional',
    size: 700,
    children: 'Buy tickets'
  }
}

export const WithLeadingIcon: Story = {
  args: {
    variant: 'primary',
    size: 700,
    icon: 'add',
    iconPosition: 'leading',
    children: 'Add item'
  }
}

export const WithTrailingIcon: Story = {
  args: {
    variant: 'secondary',
    size: 700,
    icon: 'arrow_forward',
    iconPosition: 'trailing',
    children: 'Continue'
  }
}

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    size: 700,
    icon: 'search'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <Button variant="transactional">Transactional</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="destructive">Destructive</Button>
      <div style={{ background: 'var(--brand-core)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px' }}>
        <Button variant="white">White</Button>
        <Button variant="white-tertiary">White Tertiary</Button>
      </div>
      <Button variant="black">Black</Button>
    </div>
  )
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button variant="primary" size={700}>btn-700</Button>
      <Button variant="primary" size={300}>btn-300</Button>
      <Button variant="primary" size={100}>btn-100</Button>
    </div>
  )
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 700,
    disabled: true,
    children: 'Disabled'
  }
}

export const Fill: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Button variant="primary" size={700} fill>Fill width</Button>
    </div>
  )
}

export const Circle: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <CircleButton variant="neutral" size={700} icon="close" aria-label="Close" />
      <CircleButton variant="neutral" size={300} icon="close" aria-label="Close small" />
      <CircleButton variant="primary" size={700} icon="add" aria-label="Add" />
    </div>
  )
}

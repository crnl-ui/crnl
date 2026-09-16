import type { Meta, StoryObj } from '@storybook/react'
import { Input, Select } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email'
  }
}

export const WithIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search tickets…',
    icon: 'search',
    clearable: true
  }
}

export const Error: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
    defaultValue: 'bad-email',
    error: true,
    message: 'Please enter a valid email address.'
  }
}

export const Disabled: Story = {
  args: {
    label: 'Account number',
    defaultValue: '****-1234',
    disabled: true
  }
}

export const WithLinkInLabel: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    linkText: 'Forgot password?',
    linkHref: '#'
  }
}

export const SelectField: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Select
        label="Section"
        placeholder="Choose a section"
        options={[
          { value: '100', label: 'Section 100' },
          { value: '115', label: 'Section 115' },
          { value: '200', label: 'Section 200' },
          { value: '215', label: 'Section 215' }
        ]}
      />
    </div>
  )
}

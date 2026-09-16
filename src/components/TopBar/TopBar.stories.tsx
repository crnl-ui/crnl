import type { Meta, StoryObj } from '@storybook/react'
import { TopBar } from './TopBar'
import { Button } from '../Button'
import { CircleButton } from '../Button'

const meta: Meta<typeof TopBar> = {
  title: 'Components/TopBar',
  component: TopBar,
  parameters: { layout: 'fullscreen' }
}

export default meta
type Story = StoryObj<typeof TopBar>

export const Default: Story = {
  args: {
    shortName: 'Acme',
    fullName: 'Acme Athletic Club',
    href: '/'
  }
}

export const WithActions: Story = {
  render: () => (
    <TopBar
      shortName="Acme"
      fullName="Acme Athletic Club"
      href="/"
      actions={
        <>
          <Button variant="secondary" size="small">Log in</Button>
          <Button variant="primary" size="small">Sign up</Button>
        </>
      }
    />
  )
}

export const WithIconActions: Story = {
  render: () => (
    <TopBar
      shortName="Acme"
      fullName="Acme Athletic Club"
      href="/"
      actions={
        <>
          <CircleButton variant="neutral" size="small" icon="search" aria-label="Search" />
          <CircleButton variant="neutral" size="small" icon="account_circle" aria-label="Account" />
        </>
      }
    />
  )
}

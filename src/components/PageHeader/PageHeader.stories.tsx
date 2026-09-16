import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PageHeader } from './PageHeader'
import { Tabs } from '../Tabs'
import { Steps } from '../Steps'

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: { layout: 'fullscreen' }
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    title: 'My Tickets',
    subtitle: 'Acme Athletic Club'
  }
}

export const WithTabs: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [active, setActive] = useState('upcoming')
    return (
      <PageHeader
        title="My Tickets"
        subtitle="Acme Athletic Club"
        tabs={
          <Tabs
            tabs={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past' },
              { value: 'archived', label: 'Archived' }
            ]}
            activeTab={active}
            onChange={setActive}
          />
        }
      />
    )
  }
}

export const WithSteps: Story = {
  render: () => (
    <PageHeader
      title="Buy Tickets"
      subtitle="Acme Athletic Club"
      steps={
        <Steps
          steps={[
            { label: 'Seats', state: 'completed' },
            { label: 'Summary', state: 'active' },
            { label: 'Payment', state: 'pending' }
          ]}
        />
      }
    />
  )
}

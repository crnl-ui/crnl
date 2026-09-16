import type { Meta, StoryObj } from '@storybook/react'
import { CardClosed, CardOpen, CardSection } from './Card'

const meta: Meta<typeof CardClosed> = {
  title: 'Components/Card',
  component: CardClosed,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof CardClosed>

export const Closed: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <CardClosed
        header={<p className="label-bold-30">Order Summary</p>}
        body={<p className="body-20">2 × Section 115 · Row 4</p>}
        footer={<p className="label-bold-30">$240.00</p>}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <CardClosed
        interactive
        header={<p className="label-bold-30">Portland Marmots</p>}
        body={<p className="body-20">Sat, Mar 15 · 7:30 PM</p>}
        footer={<p className="body-20">From $45</p>}
      />
    </div>
  )
}

export const Open: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <CardOpen
        header={<h2 className="title-30">Your tickets</h2>}
        sections={[
          <p className="body-20">Section 115 · Row 4 · Seat 12</p>,
          <p className="body-20">Section 115 · Row 4 · Seat 13</p>
        ]}
      />
    </div>
  )
}

export const OpenSectionInteractive: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <CardSection interactive>
        <p className="label-bold-30">Section A</p>
      </CardSection>
      <CardSection interactive>
        <p className="label-bold-30">Section B</p>
      </CardSection>
    </div>
  )
}

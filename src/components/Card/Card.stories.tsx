import type { Meta, StoryObj } from '@storybook/react'
import { CardClosed, CardOpen, CardSection } from './Card'

const meta: Meta<typeof CardClosed> = {
  title: 'Components/Card',
  component: CardClosed,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof CardClosed>

/* Synthetic fixtures. A real screen resolves these from a record (RULES §6). */
const record = {
  title: 'Record title',
  line: 'Supporting line of detail',
  total: '$240.00'
}

export const Closed: Story = {
  render: () => (
    <div className="container-narrow">
      <CardClosed
        header={<p className="labelBold30">{record.title}</p>}
        body={<p className="bodyRegular20 text-secondary">{record.line}</p>}
        footer={<p className="labelBold30">{record.total}</p>}
      />
    </div>
  )
}

export const Interactive: Story = {
  render: () => (
    <div className="container-narrow">
      <CardClosed
        interactive
        header={<p className="labelBold30">{record.title}</p>}
        body={<p className="bodyRegular20 text-secondary">{record.line}</p>}
        footer={<p className="bodyRegular20">{record.total}</p>}
      />
    </div>
  )
}

export const Open: Story = {
  render: () => (
    <div className="container-narrow">
      <CardOpen
        header={<h2 className="title50">{record.title}</h2>}
        sections={[
          <p className="bodyRegular20">{record.line}</p>,
          <p className="bodyRegular20">{record.line}</p>
        ]}
      />
    </div>
  )
}

export const OpenSectionInteractive: Story = {
  render: () => (
    <div className="container-narrow flex-column gap-150">
      <CardSection interactive>
        <p className="labelBold30">{record.title}</p>
      </CardSection>
      <CardSection interactive>
        <p className="labelBold30">{record.title}</p>
      </CardSection>
    </div>
  )
}

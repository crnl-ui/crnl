import type { Meta, StoryObj } from '@storybook/react'
import { SplitRow, SplitRowList } from './SplitRow'
import { Button } from '../Button'

const meta: Meta<typeof SplitRow> = {
  title: 'Components/SplitRow',
  component: SplitRow,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof SplitRow>

/* Synthetic fixtures. A real screen resolves these from a record (RULES §6). */
const record = { title: 'Record title', subtitle: 'Supporting line' }

const SecondBand = ({ label }: { label: string }) => (
  <div className="list-row">
    <div className="list-row-content">
      <div className="list-row-text-pair">
        <span className="labelBold30 text-interactive-tertiary">{label}</span>
      </div>
    </div>
    <div className="trailing trailing-gap-xs">
      <span className="icon icon-200" aria-hidden="true">arrow_drop_down</span>
    </div>
  </div>
)

export const BothBandsInteractive: Story = {
  render: () => (
    <SplitRow
      title={record.title}
      subtitle={record.subtitle}
      topInteractive
      bottomInteractive
      trailing={<Button variant="primary" size={100}>Primary</Button>}
      bottom={<SecondBand label="Secondary action" />}
    />
  )
}

export const TopOnly: Story = {
  render: () => (
    <SplitRow
      title={record.title}
      subtitle={record.subtitle}
      topInteractive
      trailing={<Button variant="primary" size={100}>Primary</Button>}
    />
  )
}

export const TopInert: Story = {
  name: 'Top inert, bottom interactive',
  render: () => (
    <SplitRow
      title={record.title}
      subtitle={record.subtitle}
      bottomInteractive
      bottom={<SecondBand label="Secondary action" />}
    />
  )
}

export const NothingInteractive: Story = {
  render: () => (
    <SplitRow
      title={record.title}
      subtitle={record.subtitle}
      trailing={<span className="labelBold30 text-secondary">Unavailable</span>}
    />
  )
}

export const WrappingNote: Story = {
  name: 'Trailing note that wraps',
  render: () => (
    <SplitRow
      title={record.title}
      subtitle={record.subtitle}
      trailing={
        <span className="labelBold20 text-interactive-tertiary split-row-note">
          Not yet available
        </span>
      }
    />
  )
}

export const InAList: Story = {
  render: () => (
    <SplitRowList>
      <SplitRow title={record.title} subtitle={record.subtitle} topInteractive
        trailing={<Button variant="primary" size={100}>Primary</Button>} />
      <SplitRow title={record.title} subtitle={record.subtitle} topInteractive bottomInteractive
        trailing={<Button variant="primary" size={100}>Primary</Button>}
        bottom={<SecondBand label="Secondary action" />} />
      <SplitRow title={record.title} subtitle={record.subtitle}
        trailing={<span className="labelBold30 text-secondary">Unavailable</span>} />
    </SplitRowList>
  )
}

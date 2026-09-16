import type { Meta, StoryObj } from '@storybook/react'
import { ListRow, TextPair, TrailingText, CircleContainer } from './ListRow'
import { Icon } from '../Icon'

const meta: Meta<typeof ListRow> = {
  title: 'Components/ListRow',
  component: ListRow,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof ListRow>

export const Simple: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ListRow trailing={<Icon name="chevron_right" size={200} />}>
        <TextPair label="Section 115 · Row 4" sublabel="2 tickets" />
      </ListRow>
    </div>
  )
}

export const WithLeadingIcon: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ListRow
        leading={
          <CircleContainer>
            <Icon name="star" size={200} />
          </CircleContainer>
        }
        trailing={<Icon name="chevron_right" size={200} />}
      >
        <TextPair label="Portland Marmots" sublabel="Home · Game 12" />
      </ListRow>
    </div>
  )
}

export const WithTrailingText: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ListRow
        trailing={<TrailingText label="$120" sublabel="each" />}
        trailingGap="sm"
      >
        <TextPair label="Section 115 · Row 4" sublabel="Seat 7–8" />
      </ListRow>
    </div>
  )
}

export const NotTappable: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ListRow notTappable>
        <TextPair label="Order confirmed" sublabel="#2024-88431" />
      </ListRow>
    </div>
  )
}

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ListRow disabled>
        <TextPair label="Section 215 · Row 8" sublabel="Sold out" />
      </ListRow>
    </div>
  )
}

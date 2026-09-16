import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Selector } from './Selector'
import { ListRow, TextPair, TrailingText } from '../ListRow'

const meta: Meta<typeof Selector> = {
  title: 'Components/Selector',
  component: Selector,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof Selector>

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Selector>
        <ListRow trailing={<TrailingText label="$120" sublabel="each" />} trailingGap="sm">
          <TextPair label="Section 115 · Row 4" sublabel="2 tickets" />
        </ListRow>
      </Selector>
    </div>
  )
}

export const Selected: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Selector selected>
        <ListRow trailing={<TrailingText label="$120" sublabel="each" />} trailingGap="sm">
          <TextPair label="Section 115 · Row 4" sublabel="2 tickets" />
        </ListRow>
      </Selector>
    </div>
  )
}

export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState(false)
    return (
      <div style={{ maxWidth: '400px' }}>
        <Selector selected={selected} onClick={() => setSelected(s => !s)}>
          <ListRow trailing={<TrailingText label="$120" sublabel="each" />} trailingGap="sm">
            <TextPair label="Section 115 · Row 4" sublabel="Click to select" />
          </ListRow>
        </Selector>
      </div>
    )
  }
}

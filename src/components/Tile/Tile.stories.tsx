import type { Meta, StoryObj } from '@storybook/react'
import { Tile } from './Tile'
import { Button } from '../Button'
import { Tag } from '../Tag'

const meta: Meta<typeof Tile> = {
  title: 'Components/Tile',
  component: Tile,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof Tile>

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <Tile
        visual={
          <div style={{ height: '140px', background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="icon icon-500 text-secondary">sports_basketball</span>
          </div>
        }
        info={
          <>
            <div className="card-text-pair">
              <span className="labelBold30">Portland Marmots</span>
              <span className="labelRegular10 text-secondary">Sat Mar 15 · 7:30 PM</span>
            </div>
            <span className="display400">From $45</span>
            <Button variant="primary" size="small" fill>Buy tickets</Button>
          </>
        }
      />
    </div>
  )
}

export const WithTag: Story = {
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <Tile
        visual={
          <div style={{ height: '140px', background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="icon icon-500 text-secondary">sports_basketball</span>
          </div>
        }
        tag={<Tag>Tonight</Tag>}
        info={
          <>
            <div className="card-text-pair">
              <span className="labelBold30">Portland Marmots</span>
              <span className="labelRegular10 text-secondary">Tonight · 7:30 PM</span>
            </div>
            <span className="display400">From $45</span>
          </>
        }
        tappable
      />
    </div>
  )
}

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { IOSModal } from './IOSModal'
import { Button } from '../Button'

const meta: Meta<typeof IOSModal> = {
  title: 'iOS/IOSModal',
  component: IOSModal,
  parameters: { layout: 'fullscreen' }
}
export default meta
type Story = StoryObj<typeof IOSModal>

/* Fixtures. A real screen resolves these from a record (RULES §6). */
const body = (
  <div className="p-300 flex-column gap-200">
    <p className="bodyRegular30">Scrollable modal content.</p>
    <p className="bodyRegular30 text-secondary">
      The sheet sits on --bg-sheet, one step above the surfaces behind it, so it
      never reads as a card on a card (RULES §2).
    </p>
  </div>
)

export const Open: Story = {
  args: { open: true, onClose: () => {}, title: 'Modal Title', children: body }
}

export const WithTrailingAction: Story = {
  args: {
    open: true, onClose: () => {}, title: 'Modal Title',
    trailingIcon: 'ios_share', onTrailingAction: () => {}, children: body
  }
}

export const Toggled: Story = {
  name: 'Open and close it',
  render: function Toggled() {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-300">
        <Button variant="primary" size={300} onClick={() => setOpen(true)}>Open</Button>
        <IOSModal open={open} onClose={() => setOpen(false)} title="Modal Title">
          {body}
        </IOSModal>
      </div>
    )
  }
}

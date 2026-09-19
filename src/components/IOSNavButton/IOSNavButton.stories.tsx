import type { Meta, StoryObj } from '@storybook/react'
import { IOSNavButton } from './IOSNavButton'

/* iOS chrome is drawn against the dark backdrop the phone frame provides, and
   the glass variant is translucent — on Storybook's white canvas it reads as
   nothing at all. This decorator supplies the backdrop so the component is
   visible; a real page gets it from `data-platform="app"` (RULES §1, §9). */
const onGlass = (Story: () => JSX.Element) => (
  /* A token, not `.surface-fillBlack`: the surface classes are the press
     mechanism (RULES §2), and this is a backdrop, not a tap target. Borrowing
     one to get a dark rectangle is the kind of misuse `npm run lint` catches
     — it flagged the missing `.scale-*` that a real target would have had. */
  <div
    className="p-300 rounded-200 flex-row gap-200"
    style={{ background: 'var(--neutral-1000)' }}
  >
    <Story />
  </div>
)

const meta: Meta<typeof IOSNavButton> = {
  title: 'iOS/IOSNavButton',
  component: IOSNavButton,
  parameters: { layout: 'padded' },
  decorators: [onGlass]
}
export default meta
type Story = StoryObj<typeof IOSNavButton>

export const Glass: Story = {
  args: { variant: 'glass', icon: 'arrow_back', 'aria-label': 'Back' }
}

export const Brand: Story = {
  name: 'Brand (a single character)',
  args: { variant: 'brand', label: 'A', 'aria-label': 'Account' }
}

export const Both: Story = {
  render: () => (
    <>
      <IOSNavButton variant="glass" icon="arrow_back" aria-label="Back" />
      <IOSNavButton variant="glass" icon="ios_share" aria-label="Share" />
      <IOSNavButton variant="brand" label="A" aria-label="Account" />
    </>
  )
}

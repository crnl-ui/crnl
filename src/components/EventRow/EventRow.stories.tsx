import type { Meta, StoryObj } from '@storybook/react'
import { EventRow } from './EventRow'

const LOGO = 'https://placehold.co/48x48/cccccc/999999?text=OPP'

const meta: Meta<typeof EventRow> = {
  title: 'Components/EventRow',
  component: EventRow,
  parameters: { layout: 'padded' }
}

export default meta
type Story = StoryObj<typeof EventRow>

export const FeaturedOnly: Story = {
  args: {
    opponentLogo: LOGO,
    opponentName: 'Portland Marmots',
    date: 'Tuesday, Oct 8 · 7 PM',
    state: 'featured-only',
    featuredPrice: '$19+'
  }
}

export const FeaturedAndOthers: Story = {
  args: {
    opponentLogo: LOGO,
    opponentName: 'Charlotte Bullfrogs',
    date: 'Thursday, Oct 10 · 7 PM',
    state: 'featured-and-others',
    featuredPrice: '$21+',
    offerCount: 3
  }
}

export const NoFeaturedOffers: Story = {
  args: {
    opponentLogo: LOGO,
    opponentName: 'Miami Geckos',
    date: 'Wednesday, Oct 16 · 7 PM',
    state: 'no-featured-offers',
    offerCount: 3
  }
}

export const SoldOut: Story = {
  args: {
    opponentLogo: LOGO,
    opponentName: 'Omaha Otters',
    date: 'Tuesday, Oct 22 · 7 PM',
    state: 'sold-out'
  }
}

export const ComingSoon: Story = {
  args: {
    opponentLogo: LOGO,
    opponentName: 'Portland Marmots',
    date: 'Saturday, Oct 26 · 7 PM',
    state: 'coming-soon'
  }
}

export const AllStates: Story = {
  render: () => (
    <div className="event-row-list">
      <EventRow opponentLogo={LOGO} opponentName="Portland Marmots" date="Tue, Oct 8 · 7 PM" state="featured-only" featuredPrice="$19+" />
      <EventRow opponentLogo={LOGO} opponentName="Charlotte Bullfrogs" date="Thu, Oct 10 · 7 PM" state="featured-and-others" featuredPrice="$21+" offerCount={3} />
      <EventRow opponentLogo={LOGO} opponentName="Miami Geckos" date="Wed, Oct 16 · 7 PM" state="no-featured-offers" offerCount={3} />
      <EventRow opponentLogo={LOGO} opponentName="Omaha Otters" date="Tue, Oct 22 · 7 PM" state="sold-out" />
      <EventRow opponentLogo={LOGO} opponentName="Portland Marmots" date="Sat, Oct 26 · 7 PM" state="coming-soon" />
    </div>
  )
}

export type EventRowState =
  | 'featured-only'
  | 'featured-and-others'
  | 'no-featured-offers'
  | 'sold-out'
  | 'coming-soon'

export interface EventRowProps {
  /** Opponent logo URL */
  opponentLogo: string
  /** Counterparty name */
  opponentName: string
  /** Event date string (e.g. "Tuesday, Oct 8 · 7 PM") */
  date: string
  /** Offer state */
  state: EventRowState
  /** Featured offer price label (e.g. "$19+") — used in featured states */
  featuredPrice?: string
  /** Number of additional/available offers — used in featured-and-others and no-featured-offers */
  offerCount?: number
  /** onClick for the top section (featured-only, featured-and-others) */
  onTopClick?: () => void
  /** onClick for the bottom section (featured-and-others, no-featured-offers) */
  onBottomClick?: () => void
}

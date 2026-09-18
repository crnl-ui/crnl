import type { ReactNode } from 'react'

export interface SplitRowProps {
  /** Mark rendered in the leading slot of the top band. Omit for no mark. */
  markUrl?: string
  /** Alt text for the mark. Required when `markUrl` is set. */
  markAlt?: string
  /** First line of the top band. */
  title: string
  /** Second line of the top band. Omit for a single-line row. */
  subtitle?: string
  /** Trailing slot of the top band — a button, a price, a state label. */
  trailing?: ReactNode
  /**
   * Content of the second band. Omit it and the band is not rendered, which is
   * how a record with no secondary action is expressed.
   */
  bottom?: ReactNode
  /**
   * Whether each band takes `.surface-section`. A band with no handler and no
   * flag is inert and paints nothing at rest (RULES §2).
   */
  topInteractive?: boolean
  bottomInteractive?: boolean
  onTopClick?: () => void
  onBottomClick?: () => void
}

export interface SplitRowListProps {
  children?: ReactNode
}

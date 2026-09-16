export type LeadingGap = 'sm' | 'md' | 'lg' | 'xl'
export type TrailingGap = 'xs' | 'sm' | 'md' | 'lg'

export interface ListRowProps {
  /** Leading (left) slot content */
  leading?: React.ReactNode
  /** Gap between leading slot and main content */
  leadingGap?: LeadingGap
  /** Main content — typically a TextPair, TagGroup, InfoBlock */
  children: React.ReactNode
  /** Trailing (right) slot content */
  trailing?: React.ReactNode
  /** Gap between main content and trailing slot */
  trailingGap?: TrailingGap
  /** Remove pointer cursor (non-tappable rows) */
  notTappable?: boolean
  /** Disabled state — 30% opacity, no interaction */
  disabled?: boolean
  /** onClick handler */
  onClick?: () => void
}

export interface TextPairProps {
  /** Primary label */
  label: React.ReactNode
  /** Secondary sublabel */
  sublabel?: React.ReactNode
}

export interface TrailingTextProps {
  /** Primary label (right-aligned) */
  label: React.ReactNode
  /** Secondary sublabel (right-aligned) */
  sublabel?: React.ReactNode
}

export type LeadingImageSize = 'square' | 'small' | 'large'

export interface LeadingImageProps {
  src: string
  alt: string
  size?: LeadingImageSize
}

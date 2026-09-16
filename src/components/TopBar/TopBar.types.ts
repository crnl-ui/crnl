export interface TopBarProps {
  /** Brand logo URL */
  logoSrc?: string
  /** Brand name (used for alt text) */
  brandName?: string
  /** Short brand name (shown on mobile) */
  shortName?: string
  /** Full brand name (shown on tablet+) */
  fullName?: string
  /** Home link href */
  href?: string
  /** Trailing actions slot (buttons, icon buttons, auth) */
  actions?: React.ReactNode
}

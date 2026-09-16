export type IconSize = 100 | 200 | 300 | 400 | 500 | 600

export interface IconProps {
  /** Material Symbols icon name (e.g. "home", "star", "sports_soccer") */
  name: string
  /** Size variant — maps to icon size tokens. Default: 300 (24px) */
  size?: IconSize
  /** Use outlined (unfilled) style. Default is filled. */
  outlined?: boolean
}

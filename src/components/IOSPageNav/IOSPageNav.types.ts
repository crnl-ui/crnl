export interface IOSPageNavProps {
  /** Centered title text */
  title: string
  /** Callback when back button is tapped */
  onBack?: () => void
  /** Back button icon (default "arrow_back") */
  backIcon?: string
  /** Trailing action icon (e.g. "ios_share") — omit for no trailing button */
  trailingIcon?: string
  /** Callback when trailing action is tapped */
  onTrailingAction?: () => void
}

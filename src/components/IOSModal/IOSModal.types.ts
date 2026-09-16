export interface IOSModalProps {
  /** Whether the modal is visible */
  open: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Modal title (centered in nav bar) */
  title: string
  /** Close button icon (default "close") */
  closeIcon?: string
  /** Trailing action icon (e.g. "ios_share") — omit for no trailing button */
  trailingIcon?: string
  /** Callback when trailing action is tapped */
  onTrailingAction?: () => void
  /** Scrollable modal content */
  children: React.ReactNode
}

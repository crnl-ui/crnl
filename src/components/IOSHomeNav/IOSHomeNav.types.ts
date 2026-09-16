export interface IOSHomeNavProps {
  /** Display title (e.g. "HOME", "TEAM") */
  title: string
  /** Show notification bell button */
  showNotification?: boolean
  /** Callback when notification button is tapped */
  onNotification?: () => void
  /** Avatar letter for brand button (e.g. "A") */
  avatarLabel?: string
  /** Callback when avatar button is tapped */
  onAvatar?: () => void
  /** Subtab labels — omit for no subtabs */
  subtabs?: string[]
  /** Index of active subtab (default 0) */
  activeSubtab?: number
  /** Callback when subtab changes */
  onSubtabChange?: (index: number) => void
  /** Override right-side controls entirely */
  children?: React.ReactNode
}

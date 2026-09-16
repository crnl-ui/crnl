export interface IOSTab {
  /** Unique tab identifier */
  id: string
  /** Tab label text */
  label: string
  /** Material Symbols icon name, or "brand" for the themeable brand SVG icon */
  icon: string
}

export interface IOSTabBarProps {
  /** Tab definitions */
  tabs: IOSTab[]
  /** ID of the active tab */
  activeTab: string
  /** Callback when a tab is tapped */
  onTabChange: (tabId: string) => void
}

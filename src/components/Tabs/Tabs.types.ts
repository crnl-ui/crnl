export interface TabItem {
  /** Tab label */
  label: string
  /** Tab identifier (used for active comparison) */
  value: string
}

export interface TabsProps {
  /** Tab items */
  tabs: TabItem[]
  /** Currently active tab value */
  activeTab: string
  /** Change handler */
  onChange: (value: string) => void
  /** Neutral variant — uses neutral-1000 indicator instead of brand color */
  neutral?: boolean
  /** Accessible label for the tablist */
  ariaLabel?: string
}

export type SelectorSurface = 'wash' | 'card'

export interface SelectorProps {
  /** Content (typically a ListRow) */
  children: React.ReactNode
  /** Surface style. 'wash' for inside cards; 'card' on page background */
  surface?: SelectorSurface
  /** Selected state */
  selected?: boolean
  /** Disabled state */
  disabled?: boolean
  /** onClick handler */
  onClick?: () => void
}

export interface CardClosedProps {
  /** Card header section */
  header?: React.ReactNode
  /** Card body section */
  body?: React.ReactNode
  /** Card footer section */
  footer?: React.ReactNode
  /** Make the card interactive (hover/click states) */
  interactive?: boolean
  /** onClick handler (for interactive cards) */
  onClick?: () => void
}

export interface CardOpenProps {
  /** Card header (rendered above sections, no background) */
  header?: React.ReactNode
  /** One or more section nodes. Each gets a surface background. */
  sections: React.ReactNode[]
}

export interface CardSectionProps {
  children: React.ReactNode
  /** Make the section interactive */
  interactive?: boolean
  /** onClick handler */
  onClick?: () => void
}

export type StepState = 'completed' | 'active' | 'pending'

export interface StepItem {
  /** Step label */
  label: string
  /** Step state */
  state: StepState
}

export interface StepsProps {
  /** Step items */
  steps: StepItem[]
  /**
   * Brand variant — completed steps use --interactive-primary
   * instead of --status-success (green)
   */
  brand?: boolean
}

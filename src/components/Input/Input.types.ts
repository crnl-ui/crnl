export type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url'

export interface InputProps {
  /** Field label */
  label?: string
  /** Optional link text in the label row */
  linkText?: string
  /** Optional link href */
  linkHref?: string
  /** Input type */
  type?: InputType
  /** Controlled value */
  value?: string
  /** Default value (uncontrolled) */
  defaultValue?: string
  /** Placeholder text */
  placeholder?: string
  /** Helper or error message */
  message?: string
  /** Leading icon name (Material Symbols) */
  icon?: string
  /** Show clear button when field has a value */
  clearable?: boolean
  /** Error state */
  error?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Change handler */
  onChange?: (value: string) => void
  /** Clear handler */
  onClear?: () => void
  /** Input name attribute */
  name?: string
  /** Input id attribute */
  id?: string
  /** Autocomplete attribute */
  autoComplete?: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  /** Field label */
  label?: string
  /** Options */
  options: SelectOption[]
  /** Controlled value */
  value?: string
  /** Placeholder text shown when no option is selected */
  placeholder?: string
  /** Helper or error message */
  message?: string
  /** Leading icon name (Material Symbols) */
  icon?: string
  /** Error state */
  error?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Change handler */
  onChange?: (value: string) => void
  /** Select name attribute */
  name?: string
  /** Select id attribute */
  id?: string
}

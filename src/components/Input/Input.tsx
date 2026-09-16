import { useState } from 'react'
import type { InputProps, SelectProps } from './Input.types'

export function Input({
  label,
  linkText,
  linkHref,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  message,
  icon,
  clearable = false,
  error = false,
  disabled = false,
  onChange,
  onClear,
  name,
  id,
  autoComplete
}: InputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const currentValue = value !== undefined ? value : internalValue
  const hasValue = Boolean(currentValue)

  const fieldClasses = [
    'input-field',
    error ? 'is-error' : '',
    disabled ? 'is-disabled' : '',
    clearable && hasValue ? 'has-value' : ''
  ]
    .filter(Boolean)
    .join(' ')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    if (value === undefined) setInternalValue(newValue)
    onChange?.(newValue)
  }

  function handleClear() {
    if (value === undefined) setInternalValue('')
    onClear?.()
  }

  return (
    <div className={fieldClasses}>
      {(label || linkText) && (
        <div className="input-label-row">
          {label && <label className="input-label" htmlFor={id}>{label}</label>}
          {linkText && (
            <a className="input-link" href={linkHref ?? '#'}>{linkText}</a>
          )}
        </div>
      )}
      <div className="input-and-message">
        <div className="input-control">
          {icon && (
            <span className="input-icon material-symbols-rounded" aria-hidden="true">
              {icon}
            </span>
          )}
          <input
            type={type}
            name={name}
            id={id}
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            onChange={handleChange}
          />
          {clearable && hasValue && (
            <button
              type="button"
              className="input-clear"
              onClick={handleClear}
              aria-label="Clear field"
            >
              <span className="material-symbols-rounded" aria-hidden="true">close</span>
            </button>
          )}
        </div>
        {message && (
          <span className="input-message">{message}</span>
        )}
      </div>
    </div>
  )
}

export function Select({
  label,
  options,
  value,
  placeholder,
  message,
  icon,
  error = false,
  disabled = false,
  onChange,
  name,
  id
}: SelectProps) {
  const [internalValue, setInternalValue] = useState('')
  const currentValue = value !== undefined ? value : internalValue
  const displayText = options.find(o => o.value === currentValue)?.label ?? placeholder ?? ''

  const fieldClasses = [
    'input-field',
    'input-select',
    error ? 'is-error' : '',
    disabled ? 'is-disabled' : ''
  ]
    .filter(Boolean)
    .join(' ')

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newValue = e.target.value
    if (value === undefined) setInternalValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className={fieldClasses}>
      {label && (
        <div className="input-label-row">
          <label className="input-label" htmlFor={id}>{label}</label>
        </div>
      )}
      <div className="input-and-message">
        <div className="input-control">
          {icon && (
            <span className="input-icon material-symbols-rounded" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="input-select-display">{displayText}</span>
          <span className="input-select-chevron material-symbols-rounded" aria-hidden="true">
            arrow_drop_down
          </span>
          <select
            name={name}
            id={id}
            value={currentValue}
            disabled={disabled}
            onChange={handleChange}
            aria-label={label}
          >
            {placeholder && (
              <option value="" disabled>{placeholder}</option>
            )}
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {message && (
          <span className="input-message">{message}</span>
        )}
      </div>
    </div>
  )
}

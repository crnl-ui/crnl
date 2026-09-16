/**
 * docHelpers.ts — Port of walkthrough.js utility functions for use in React doc pages.
 * For HTML-injection pages, call attachHelpersToWindow() in a useEffect after injection
 * so that inline onclick handlers in the injected HTML continue to work.
 */

export function syncHasValue(fieldId: string, input: HTMLInputElement): void {
  const field = document.getElementById(fieldId)
  if (!field) return
  if (input.value.trim()) {
    field.classList.add('has-value')
  } else {
    field.classList.remove('has-value')
  }
}

export function clearInput(fieldId: string, inputId: string): void {
  const field = document.getElementById(fieldId)
  const input = document.getElementById(inputId) as HTMLInputElement | null
  if (!field || !input) return
  input.value = ''
  field.classList.remove('has-value', 'is-error')
  const msg = field.querySelector('.input-message') as HTMLElement | null
  if (msg) msg.style.display = 'none'
  input.focus()
}

export function syncSelect(_fieldId: string, displayId: string, selectEl: HTMLSelectElement): void {
  const display = document.getElementById(displayId)
  if (!display) return
  const chosen = selectEl.options[selectEl.selectedIndex]
  if (chosen && chosen.value) {
    display.textContent = chosen.text
    display.classList.remove('is-placeholder')
  } else {
    display.textContent = chosen.text
    display.classList.add('is-placeholder')
  }
}

export function openSelect(fieldId: string): void {
  document.getElementById(fieldId)?.classList.add('is-open')
}

export function closeSelect(fieldId: string): void {
  document.getElementById(fieldId)?.classList.remove('is-open')
}

/** Attach all helper functions to window so inline onclick handlers in injected HTML work. */
export function attachHelpersToWindow(): void {
  const w = window as unknown as Record<string, unknown>
  w.syncHasValue = syncHasValue
  w.clearInput = clearInput
  w.syncSelect = syncSelect
  w.openSelect = openSelect
  w.closeSelect = closeSelect
}

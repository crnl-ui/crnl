import { useState, useCallback } from 'react'

interface UseSelectSyncOptions {
  initialDisplay?: string
}

interface UseSelectSyncResult {
  displayText: string
  isOpen: boolean
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  handleFocus: () => void
  handleBlur: () => void
}

export function useSelectSync(options?: UseSelectSyncOptions): UseSelectSyncResult {
  const [displayText, setDisplayText] = useState(options?.initialDisplay ?? '')
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosen = e.target.options[e.target.selectedIndex]
    setDisplayText(chosen.text)
  }, [])

  const handleFocus = useCallback(() => setIsOpen(true), [])
  const handleBlur = useCallback(() => setIsOpen(false), [])

  return { displayText, isOpen, handleChange, handleFocus, handleBlur }
}

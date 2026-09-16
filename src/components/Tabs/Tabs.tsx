import type { TabsProps } from './Tabs.types'

export function Tabs({ tabs, activeTab, onChange, neutral = false, ariaLabel }: TabsProps) {
  const navClass = ['tabs', neutral ? 'tabs-neutral' : ''].filter(Boolean).join(' ')

  return (
    <nav className={navClass} role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab
        return (
          <button
            key={tab.value}
            className={['tab', isActive ? 'is-active' : ''].filter(Boolean).join(' ')}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}

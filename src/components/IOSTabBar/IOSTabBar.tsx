import type { IOSTabBarProps } from './IOSTabBar.types'

export function IOSTabBar({
  tabs,
  activeTab,
  onTabChange
}: IOSTabBarProps) {
  return (
    <nav className="ios-tab-bar">
      <div className="ios-tab-bar-inner ios-glass">
        {tabs.map(tab => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              className={`ios-tab${isActive ? ' is-active' : ''}`}
              data-tab={tab.id}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.icon === 'brand' ? (
                <span className="ios-tab-brand-icon" />
              ) : (
                <span className="icon">{tab.icon}</span>
              )}
              <span className="ios-tab-label">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

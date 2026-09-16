import type { TopBarProps } from './TopBar.types'

export function TopBar({
  logoSrc,
  brandName,
  shortName,
  fullName,
  href = '/',
  actions
}: TopBarProps) {
  return (
    <header className="top-bar" role="banner">
      <div className="top-bar-inner">
        <a className="top-bar-brand" href={href}>
          {logoSrc && (
            <img
              className="top-bar-logo"
              src={logoSrc}
              alt={brandName ?? ''}
            />
          )}
          {(shortName || fullName) && (
            <span className="top-bar-name display100">
              {shortName && <span className="top-bar-name-short">{shortName}</span>}
              {fullName && <span className="top-bar-name-full">{fullName}</span>}
            </span>
          )}
        </a>
        {actions && (
          <div className="top-bar-actions">{actions}</div>
        )}
      </div>
    </header>
  )
}

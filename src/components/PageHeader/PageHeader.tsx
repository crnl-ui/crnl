import type { PageHeaderProps } from './PageHeader.types'

export function PageHeader({ title, subtitle, tabs, steps }: PageHeaderProps) {
  const hasSteps = Boolean(steps)
  const hasTabs = Boolean(tabs)

  const sectionClass = [
    'page-header',
    hasTabs ? 'has-tabs' : '',
    hasSteps ? 'has-steps' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClass}>
      {steps}
      <div className="page-header-content">
        <div className="card-text-pair">
          <span className="display500">{title}</span>
          {subtitle && (
            <span className="labelRegular40 text-secondary">{subtitle}</span>
          )}
        </div>
      </div>
      {tabs}
    </section>
  )
}

import type { StepsProps, StepItem } from './Steps.types'

function StepNode({ item, index }: { item: StepItem; index: number }) {
  return (
    <div className={`step step-${item.state}`}>
      <div className="step-circle">
        {item.state === 'completed' ? (
          <span className="icon icon-100" aria-hidden="true">check</span>
        ) : (
          <span className="step-number">{index + 1}</span>
        )}
      </div>
      <span className="step-label">{item.label}</span>
    </div>
  )
}

export function Steps({ steps, brand = false }: StepsProps) {
  const containerClass = ['steps', brand ? 'steps-brand' : ''].filter(Boolean).join(' ')

  return (
    <div className={containerClass}>
      {steps.map((step, index) => (
        <>
          <StepNode key={step.label} item={step} index={index} />
          {index < steps.length - 1 && (
            <span key={`connector-${index}`} className="step-connector icon" aria-hidden="true">
              chevron_right
            </span>
          )}
        </>
      ))}
    </div>
  )
}

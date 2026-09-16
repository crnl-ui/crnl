import type {
  ListRowProps,
  TextPairProps,
  TrailingTextProps,
  LeadingImageProps
} from './ListRow.types'

export function ListRow({
  leading,
  leadingGap = 'md',
  children,
  trailing,
  trailingGap = 'xs',
  notTappable = false,
  disabled = false,
  onClick
}: ListRowProps) {
  const rowClasses = [
    'list-row',
    notTappable ? 'not-tappable' : '',
    disabled ? 'disabled' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rowClasses} onClick={onClick}>
      {leading && (
        <div className={`leading leading-gap-${leadingGap}`}>
          {leading}
        </div>
      )}
      <div className="list-row-content">{children}</div>
      {trailing && (
        <div className={`trailing trailing-gap-${trailingGap}`}>
          {trailing}
        </div>
      )}
    </div>
  )
}

/** Label + sublabel stacked pair for list row main content */
export function TextPair({ label, sublabel }: TextPairProps) {
  return (
    <div className="list-row-text-pair">
      <span className="labelBold30">{label}</span>
      {sublabel && (
        <span className="labelRegular10 text-secondary">{sublabel}</span>
      )}
    </div>
  )
}

/** Right-aligned label + sublabel for the trailing slot */
export function TrailingText({ label, sublabel }: TrailingTextProps) {
  return (
    <div className="trailing-text-pair">
      <span className="labelBold20">{label}</span>
      {sublabel && (
        <span className="labelRegular10 text-secondary">{sublabel}</span>
      )}
    </div>
  )
}

/** Image in leading slot */
export function LeadingImage({ src, alt, size = 'square' }: LeadingImageProps) {
  return (
    <img
      className={`leading-image-${size}`}
      src={src}
      alt={alt}
    />
  )
}

/** Brand logo in leading slot (uses CSS variable --brand-logo-url) */
export function LeadingLogo({ ariaLabel = 'Brand logo' }: { ariaLabel?: string }) {
  return <div className="leading-logo" role="img" aria-label={ariaLabel} />
}

/** Circle container for icon or letter in leading slot */
export function CircleContainer({ children }: { children: React.ReactNode }) {
  return <div className="circle-container">{children}</div>
}

export default function Card({ children, className = '' }) {
  // Avoid double-padding when callers pass their own padding classes (e.g. p-4 / p-0).
  // Keep default padding consistent for all cards that don't override it.
  const hasCustomPadding = /\bp-(0|1|2|3|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)\b/.test(
    className
  )

  const padding = hasCustomPadding ? '' : 'p-5'

  return (
    <div className={`card ${padding} min-w-0 ${className}`}>
      {children}
    </div>
  )
}


import { statusCls } from '../../utils/helpers'
export function StatusBadge({ status }) {
  return <span className={statusCls(status)}>{status}</span>
}
export function Badge({ children, variant='gray' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}

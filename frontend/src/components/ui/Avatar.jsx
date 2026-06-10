import { avatarBg, initials } from '../../utils/helpers'
export default function Avatar({ name, size='md' }) {
  const sz = {sm:'w-7 h-7 text-xs',md:'w-9 h-9 text-sm',lg:'w-11 h-11 text-base',xl:'w-16 h-16 text-xl'}[size]
  return <div className={`${sz} ${avatarBg(name)} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>{initials(name)}</div>
}

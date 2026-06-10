export const fmt = d => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—'
export const currency = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n||0)
export const initials = (name='') => name.split(' ').slice(0,2).map(n=>n[0]||'').join('').toUpperCase()||'?'
export const avatarBg = (name='') => ['bg-violet-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-sky-500','bg-pink-500','bg-teal-500'][(name.charCodeAt(0)||0)%7]
export const statusCls = s => ({
  Active:'badge-success',Inactive:'badge-danger',
  Present:'badge-success',Absent:'badge-danger',Late:'badge-warning',
  Pending:'badge-warning',Approved:'badge-success',Rejected:'badge-danger',
  Upcoming:'badge-info',Completed:'badge-success',Planning:'badge-warning',Ongoing:'badge-primary',Cancelled:'badge-danger',
  High:'badge-danger',Medium:'badge-warning',Low:'badge-info',
}[s]||'badge-gray')
export const search = (arr, q, keys) => !q ? arr : arr.filter(r => keys.some(k => String(r[k]||'').toLowerCase().includes(q.toLowerCase())))
export const paginate = (arr, page, size) => {
  const s=(page-1)*size
  return { rows:arr.slice(s,s+size), total:arr.length, pages:Math.ceil(arr.length/size) }
}

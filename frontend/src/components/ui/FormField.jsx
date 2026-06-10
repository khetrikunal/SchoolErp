export default function FormField({ label, error, required, children }) {
  return (
    <div>
      {label && <label className="label">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

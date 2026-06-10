import Modal from './Modal'
export default function ConfirmDialog({ open, onClose, onConfirm, title='Confirm', message, danger=true }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">{message}</p>
      <div className="flex gap-2 justify-end">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={onConfirm} className={danger?'btn-danger':'btn-primary'}>Confirm</button>
      </div>
    </Modal>
  )
}

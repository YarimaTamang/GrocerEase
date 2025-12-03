const Modal = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800 dark:shadow-slate-700">
        <button
          onClick={onClose}
          className="mb-4 text-sm font-semibold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-light"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal

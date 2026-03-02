import { useState, useRef, useEffect } from 'react'

const STATUS_STYLES = {
  inscrito: {
    label: 'Inscrito',
    cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  'teste pendente': {
    label: 'Teste Pendente',
    cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  entrevista: {
    label: 'Entrevista',
    cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  feedback: {
    label: 'Feedback',
    cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  rejeitado: {
    label: 'Rejeitado',
    cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  },
}

export default function StatusBadge({ status }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const key = (status || '').toLowerCase()
  const info = STATUS_STYLES[key] || { label: status, cls: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' }

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleOutside)
      document.addEventListener('touchstart', handleOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [open])

  function handleClick(e) {
    const el = e.currentTarget
    if (el.scrollWidth > el.clientWidth) {
      e.stopPropagation()
      setOpen((prev) => !prev)
    }
  }

  return (
    <span ref={ref} className="relative inline-block max-w-[130px] align-middle">
      <span
        className={`block truncate px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase cursor-pointer select-none ${info.cls}`}
        title={info.label}
        onClick={handleClick}
      >
        {info.label}
      </span>

      {open && (
        <span
          className="absolute right-0 top-full mt-1.5 z-50 block w-max max-w-[200px] px-3 py-2 rounded-lg shadow-xl bg-gray-900 dark:bg-gray-700 text-white text-xs leading-snug border border-gray-700 dark:border-gray-600 pointer-events-none"
          style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
        >
          {info.label}
        </span>
      )}
    </span>
  )
}


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
  const key = (status || '').toLowerCase()
  const info = STATUS_STYLES[key] || { label: status, cls: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${info.cls}`}>
      {info.label}
    </span>
  )
}

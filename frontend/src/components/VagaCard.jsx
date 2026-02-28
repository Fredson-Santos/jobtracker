import StatusBadge from './StatusBadge'

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
]

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr + 'T00:00:00')
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

function getPrazoInfo(dias) {
  if (dias === null) return null
  if (dias < 0) return { label: 'Expirado', cls: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20' }
  if (dias === 0) return { label: 'Hoje!', cls: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20' }
  if (dias <= 3) return { label: `${dias}d`, cls: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20' }
  if (dias <= 7) return { label: `${dias}d`, cls: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' }
  return { label: `${dias}d`, cls: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' }
}

export default function VagaCard({ vaga, onEdit, onDelete }) {
  const initials = vaga.empresa.slice(0, 2).toUpperCase()
  const avatarColor = getAvatarColor(vaga.empresa)
  const dias = getDaysUntil(vaga.data_limite)
  const prazo = getPrazoInfo(dias)
  const isRejected = (vaga.status || '').toLowerCase() === 'rejeitado'

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 flex flex-col gap-4 ${isRejected ? 'opacity-60' : ''
        }`}
    >
      {/* Header: avatar + info + badge */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
            {vaga.empresa}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {vaga.plataforma}
          </p>
        </div>
        <StatusBadge status={vaga.status} />
      </div>

      {/* Meta: data + prazo */}
      {vaga.data_limite && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <span className="material-icons-round text-base">event</span>
            <span>{new Date(vaga.data_limite + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
          </div>
          {prazo && (
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${prazo.cls}`}>
              {prazo.label}
            </span>
          )}
        </div>
      )}

      {/* Cargo tag */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        <span className="material-icons-round" style={{ fontSize: 14 }}>work_outline</span>
        {vaga.cargo || 'Cargo não especificado'}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onDelete(vaga.id)}
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <span className="material-icons-round text-base">delete</span>
          Excluir
        </button>
        {vaga.link ? (
          <a
            href={vaga.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors no-underline"
          >
            Ver andamento
            <span className="material-icons-round text-base">open_in_new</span>
          </a>
        ) : (
          <button
            onClick={() => onEdit(vaga)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            Editar
            <span className="material-icons-round text-base">edit</span>
          </button>
        )}
      </div>
    </div>
  )
}

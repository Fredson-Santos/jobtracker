import { useState, useRef, useEffect } from 'react'
import StatusBadge from './StatusBadge'
import TruncatedText from './TruncatedText'



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

function formatRelativeDate(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const isToday = date.toDateString() === today.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return 'Hoje'
  if (isYesterday) return 'Ontem'
  return date.toLocaleDateString('pt-BR')
}


export default function VagaCard({ vaga, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const initials = vaga.empresa.slice(0, 2).toUpperCase()

  const avatarColor = getAvatarColor(vaga.empresa)
  const dias = getDaysUntil(vaga.data_limite)
  const prazo = getPrazoInfo(dias)
  const isRejected = (vaga.status || '').toLowerCase() === 'rejeitado'

  return (
    <div
      className={`w-full bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-xl flex flex-col overflow-hidden transition-all hover:border-gray-300 dark:hover:border-gray-500 opacity-100 ${isRejected ? 'opacity-60 grayscale-[30%]' : ''
        }`}
    >
      {/* Corpo do Card (Informações principais) */}
      <div className="p-5 flex-1">

        {/* Cabeçalho: Logo, Textos e Estado */}
        <div className="flex justify-between items-start gap-3">

          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-inner ${avatarColor}`}
            >
              {initials}
            </div>

            {/* Textos: Empresa e Plataforma */}
            <div className="min-w-0 flex flex-col flex-1">
              <TruncatedText
                text={vaga.empresa}
                className="text-gray-900 dark:text-white font-semibold text-base"
              />
              <TruncatedText
                text={vaga.plataforma}
                className="text-gray-500 dark:text-gray-400 text-sm mt-0.5"
              />
            </div>
          </div>

          {/* Etiqueta de Estado */}
          <div className="shrink-0 pt-1">
            <StatusBadge status={vaga.status} />
          </div>
        </div>


        {/* Divisória interna */}
        <hr className="border-gray-200 dark:border-gray-700/50 my-4" />

        {/* Detalhes da Vaga */}
        <div className="flex flex-col gap-3">
          {/* Cargo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <TruncatedText
              text={vaga.cargo || 'Cargo não especificado'}
              className="text-gray-700 dark:text-gray-200 font-medium text-sm"
            />
          </div>



          {/* Data Limite */}
          {vaga.data_limite && (
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="text-gray-500 dark:text-gray-400 text-xs truncate">
                  Prazo: {new Date(vaga.data_limite + 'T00:00:00').toLocaleDateString('pt-BR')}
                </span>
              </div>
              {prazo && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold shrink-0 ${prazo.cls}`}>
                  {prazo.label}
                </span>
              )}
            </div>
          )}

          {/* Última Atualização */}
          {(vaga.updated_at || vaga.created_at) && (
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-gray-500 dark:text-gray-400 text-xs truncate">
                Última atualização: {formatRelativeDate(vaga.updated_at || vaga.created_at)}
              </span>
            </div>
          )}
        </div>


      </div>

      {/* Rodapé do Card (Ações isoladas) */}
      <div className="p-4 bg-gray-50 dark:bg-[#0f172a]/40 border-t border-gray-100 dark:border-gray-700/60 flex justify-between items-center mt-auto">

        {vaga.link ? (
          <a
            href={vaga.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-400/10 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium no-underline"
          >
            Ver andamento
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        ) : (
          <div className="w-4"></div>
        )}

        {/* Agrupamento da direita (Menu 3 Pontos) */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          {/* Botão 3 Pontos */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14a2 2 0 100-4 2 2 0 000 4zm-6 0a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          </button>

          {/* Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-40 bg-white dark:bg-[#162032] border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex flex-col py-1">
                {/* Opção Editar */}
                <button
                  onClick={() => {
                    onEdit(vaga)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-left w-full"
                >
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Editar
                </button>

                {/* Opção Arquivar */}
                <button
                  onClick={() => {
                    // Feature futura
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed transition-colors text-left w-full"
                  title="Funcionalidade em desenvolvimento"
                >
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                  </svg>
                  Arquivar
                </button>

                {/* Divisória interna do menu */}
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>

                {/* Opção Excluir */}
                <button
                  onClick={() => {
                    onDelete(vaga.id)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300 transition-colors text-left w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchVagas } from '../api/vagasApi'
import StatusBadge from '../components/StatusBadge'
import VagaCard from '../components/VagaCard'

export default function Dashboard() {
  const [vagas, setVagas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVagas()
  }, [])

  async function loadVagas() {
    try {
      const data = await fetchVagas()
      setVagas(data)
    } catch {
      setVagas([])
    } finally {
      setLoading(false)
    }
  }

  function getDaysUntil(dateStr) {
    if (!dateStr) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(dateStr + 'T00:00:00')
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
  }

  const total = vagas.length
  const inscritos = vagas.filter((v) => v.status?.toLowerCase() === 'inscrito').length
  const testePendente = vagas.filter((v) => v.status?.toLowerCase() === 'teste pendente').length
  const entrevistas = vagas.filter((v) => v.status?.toLowerCase() === 'entrevista').length

  const urgentes = vagas
    .map((v) => ({ ...v, dias: getDaysUntil(v.data_limite) }))
    .filter((v) => v.dias !== null && v.dias >= 0 && v.dias <= 7)
    .sort((a, b) => a.dias - b.dias)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 dark:text-gray-500 gap-3">
        <div className="spinner" />
        Carregando...
      </div>
    )
  }

  const statCards = [
    { icon: 'work_outline', label: 'Total de Vagas', value: total, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { icon: 'schedule', label: 'Inscritos', value: inscritos, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
    { icon: 'bolt', label: 'Teste Pendente', value: testePendente, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { icon: 'check_circle', label: 'Entrevistas', value: entrevistas, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visão geral das suas candidaturas</p>
        </div>
        <Link
          to="/vagas"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm no-underline"
        >
          <span className="material-icons-round text-lg">work_outline</span>
          Ver Vagas
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <span className="material-icons-round text-2xl">{s.icon}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{s.value}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Prazos Urgentes */}
      {urgentes.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="material-icons-round text-red-500 text-xl">warning</span>
            Prazos Próximos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentes.map((v) => (
              <div
                key={v.id}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-5 py-4 flex items-center justify-between hover:border-red-300 dark:hover:border-red-700 transition-colors"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{v.empresa}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                    {v.plataforma} · <StatusBadge status={v.status} />
                  </p>
                </div>
                <div className="text-2xl font-bold text-red-500 dark:text-red-400 ml-4 shrink-0">
                  {v.dias === 0 ? 'Hoje!' : v.dias === 1 ? '1 dia' : `${v.dias}d`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vagas Recentes */}
      {vagas.length > 0 ? (
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Vagas Recentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vagas.slice(0, 6).map((v) => (
              <VagaCard
                key={v.id}
                vaga={v}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <div className="text-5xl mb-4 opacity-50">📋</div>
          <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-2">Nenhuma vaga cadastrada</h3>
          <p className="text-sm">Vá para a página de vagas para começar a cadastrar.</p>
        </div>
      )}
    </div>
  )
}

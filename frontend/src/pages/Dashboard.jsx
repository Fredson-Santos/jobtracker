import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchVagas, deleteVaga } from '../api/vagasApi'


import StatusBadge from '../components/StatusBadge'
import VagaCard from '../components/VagaCard'

export default function Dashboard() {
  const [vagas, setVagas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


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

  async function handleDelete(id) {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      try {
        await deleteVaga(id)
        loadVagas()
      } catch (error) {
        console.error('Erro ao excluir vaga:', error)
        alert('Erro ao excluir vaga. Tente novamente.')
      }
    }
  }

  function handleEdit(vaga) {
    // Redireciona para a página de vagas passando o ID para abrir o modal de edição
    navigate('/vagas', { state: { editVagaId: vaga.id } })
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
        <button
          onClick={() => navigate('/vagas', { state: { openNew: true } })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <span className="material-icons-round text-lg">add</span>
          Nova Vaga
        </button>

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
            {urgentes.map((v) => {
              const isHoje = v.dias === 0
              const prazoLabel = isHoje ? 'Hoje' : v.dias === 1 ? '1 dia' : `${v.dias}d`

              return (
                <div
                  key={v.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Barra lateral de urgência */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isHoje ? 'bg-red-500' : 'bg-blue-500'}`} />

                  <div className="flex justify-between items-start pl-5 pr-4 py-4 gap-3">
                    {/* Conteúdo esquerdo */}
                    <div className="flex-1 min-w-0 space-y-2.5">
                      {/* Empresa */}
                      <div className="flex flex-col">
                        <h4 className="font-bold text-base text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {v.empresa}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="material-icons-round text-[12px] text-gray-300">open_in_new</span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">{v.plataforma}</span>
                        </div>
                      </div>

                      {/* Cargo */}
                      <div className="flex items-center gap-1.5">
                        <span className="material-icons-round text-[14px] text-gray-300">work_outline</span>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{v.cargo || 'Cargo não especificado'}</p>
                      </div>

                      {/* Status + prazo */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={v.status} />
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500">
                          <span className="material-icons-round text-[12px] text-gray-300">calendar_today</span>
                          <span className="uppercase tracking-tight">Expira:</span>
                          <span className={isHoje ? 'text-red-500 font-black' : 'text-gray-600 dark:text-gray-300'}>
                            {isHoje ? 'HOJE' : prazoLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Direita: badge de dias + ação */}
                    <div className="flex flex-col items-end gap-6 shrink-0">
                      <div className={`px-3 py-1 rounded-xl font-black text-lg shadow-sm -rotate-2 group-hover:rotate-0 transition-transform ${isHoje
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-800'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>
                        {prazoLabel}!
                      </div>
                      {v.link ? (
                        <a
                          href={v.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-gray-50 dark:bg-gray-700 rounded-full text-gray-400 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300"
                          title="Abrir link da candidatura"
                        >
                          <span className="material-icons-round text-[18px]">chevron_right</span>
                        </a>
                      ) : null}

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}


      {/* Atualizações Recentes */}
      {vagas.length > 0 ? (
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="material-icons-round text-blue-500 text-xl">history</span>
            Atualizações Recentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vagas
              .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
              .slice(0, 6)
              .map((v) => (
                <VagaCard
                  key={v.id}
                  vaga={v}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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

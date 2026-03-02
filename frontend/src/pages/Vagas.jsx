import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import toast from 'react-hot-toast'

import { fetchVagas, createVaga, updateVaga, deleteVaga } from '../api/vagasApi'
import VagaCard from '../components/VagaCard'
import VagaModal from '../components/VagaModal'

export default function Vagas() {
  const [vagas, setVagas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVaga, setEditingVaga] = useState(null)
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState('recentes')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef(null)
  const CARDS_PER_PAGE = 9



  const location = useLocation()
  const navigate = useNavigate()
  // Ref para evitar re-processar o mesmo state ao recarregar vagas
  const handledStateRef = useRef(null)


  useEffect(() => {
    loadVagas()
  }, [])

  // Abre modal de edição ao navegar do Dashboard com editVagaId
  useEffect(() => {
    const editId = location.state?.editVagaId
    if (editId && handledStateRef.current !== editId) {
      handledStateRef.current = editId
      navigate('/vagas', { replace: true, state: {} })
      // Aguarda vagas carregadas para abrir o modal
      const tryOpen = (retry = 0) => {
        setVagas((current) => {
          const vagaToEdit = current.find((v) => v.id === editId)
          if (vagaToEdit) {
            openEdit(vagaToEdit)
          } else if (retry < 5) {
            setTimeout(() => tryOpen(retry + 1), 200)
          }
          return current
        })
      }
      tryOpen()
    }
  }, [location])

  // Abre modal de criação ao navegar do Dashboard com openNew
  useEffect(() => {
    if (location.state?.openNew) {
      navigate('/vagas', { replace: true, state: {} })
      openCreate()
    }
  }, [location])


  async function loadVagas() {
    try {
      const data = await fetchVagas()
      setVagas(data)
    } catch {
      toast.error('Erro ao carregar vagas')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(vagaData) {
    try {
      await createVaga(vagaData)
      toast.success('Vaga cadastrada!')
      setShowModal(false)
      loadVagas()
    } catch {
      toast.error('Erro ao cadastrar vaga')
    }
  }

  async function handleUpdate(vagaData) {
    try {
      await updateVaga(editingVaga.id, vagaData)
      toast.success('Vaga atualizada!')
      setEditingVaga(null)
      setShowModal(false)
      loadVagas()
    } catch {
      toast.error('Erro ao atualizar vaga')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta vaga?')) return
    try {
      await deleteVaga(id)
      toast.success('Vaga excluída')
      loadVagas()
    } catch {
      toast.error('Erro ao excluir vaga')
    }
  }

  function openEdit(vaga) {
    setEditingVaga(vaga)
    setShowModal(true)
  }

  function openCreate() {
    setEditingVaga(null)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingVaga(null)
  }

  const STATUS_OPTIONS = ['Todos', 'Inscrito', 'Teste Pendente', 'Entrevista', 'Feedback', 'Rejeitado']
  const SORT_OPTIONS = [
    { key: 'recentes', label: 'Mais recentes', icon: 'schedule' },
    { key: 'antigas', label: 'Mais antigas', icon: 'history' },
    { key: 'empresa', label: 'Empresa (A-Z)', icon: 'sort_by_alpha' },
    { key: 'prazo', label: 'Prazo', icon: 'event' },
  ]

  // Fechar dropdown de sort ao clicar fora
  useEffect(() => {
    function handleOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    if (sortOpen) {
      document.addEventListener('mousedown', handleOutside)
      document.addEventListener('touchstart', handleOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [sortOpen])

  const filteredVagas = (() => {
    const base = filterStatus === 'Todos'
      ? [...vagas]
      : vagas.filter((v) => v.status?.toLowerCase() === filterStatus.toLowerCase())

    return base.sort((a, b) => {
      if (sortKey === 'recentes') {
        return new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)
      }
      if (sortKey === 'antigas') {
        return new Date(a.created_at || 0) - new Date(b.created_at || 0)
      }
      if (sortKey === 'empresa') {
        return (a.empresa || '').localeCompare(b.empresa || '', 'pt-BR')
      }
      if (sortKey === 'prazo') {
        const da = a.data_limite ? new Date(a.data_limite) : new Date('9999-12-31')
        const db = b.data_limite ? new Date(b.data_limite) : new Date('9999-12-31')
        return da - db
      }
      return 0
    })
  })()

  const totalPages = Math.ceil(filteredVagas.length / CARDS_PER_PAGE)
  const paginatedVagas = filteredVagas.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  )

  function handleFilterChange(status) {
    setFilterStatus(status)
    setCurrentPage(1)
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 dark:text-gray-500 gap-3">
        <div className="spinner" />
        Carregando...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Vagas</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {vagas.length} candidatura{vagas.length !== 1 ? 's' : ''} cadastrada{vagas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <span className="material-icons-round text-lg">add</span>
          Nova Vaga
        </button>
      </div>

      {/* Filter pills + Ordenação */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === s
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Botão de ordenação */}
        <div className="relative flex-shrink-0" ref={sortRef}>
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
            title="Ordenar"
          >
            <span className="material-icons-round text-base">sort</span>
            <span className="hidden sm:inline">{SORT_OPTIONS.find(o => o.key === sortKey)?.label ?? 'Ordenar'}</span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => { setSortKey(opt.key); setCurrentPage(1); setSortOpen(false) }}
                  className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors ${sortKey === opt.key
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <span className="material-icons-round text-base">{opt.icon}</span>
                  {opt.label}
                  {sortKey === opt.key && <span className="material-icons-round text-base ml-auto">check</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Cards Grid */}
      {paginatedVagas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedVagas.map((v) => (
            <VagaCard
              key={v.id}
              vaga={v}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <div className="text-5xl mb-4 opacity-50">📋</div>
          <h3 className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-2">Nenhuma vaga encontrada</h3>
          <p className="text-sm">
            {filterStatus !== 'Todos'
              ? 'Tente mudar o filtro ou cadastre uma nova vaga.'
              : 'Clique em "Nova Vaga" para começar.'}
          </p>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-icons-round text-lg">chevron_left</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${currentPage === page
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-icons-round text-lg">chevron_right</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <VagaModal
          vaga={editingVaga}
          onClose={closeModal}
          onSave={editingVaga ? handleUpdate : handleCreate}
        />
      )}
    </div>
  )
}

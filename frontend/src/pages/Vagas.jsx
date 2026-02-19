import { useState, useEffect } from 'react'
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

  useEffect(() => {
    loadVagas()
  }, [])

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

  const filteredVagas =
    filterStatus === 'Todos'
      ? vagas
      : vagas.filter((v) => v.status?.toLowerCase() === filterStatus.toLowerCase())

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

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === s
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filteredVagas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVagas.map((v) => (
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

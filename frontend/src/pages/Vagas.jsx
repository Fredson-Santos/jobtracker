import { useState, useEffect } from 'react'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineExternalLink, HiOutlineCalendar, HiOutlineOfficeBuilding } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { fetchVagas, createVaga, updateVaga, deleteVaga } from '../api/vagasApi'
import StatusBadge from '../components/StatusBadge'
import VagaModal from '../components/VagaModal'

const STATUS_PROGRESS = {
  'inscrito': { step: 1, total: 5 },
  'teste pendente': { step: 2, total: 5 },
  'entrevista': { step: 3, total: 5 },
  'feedback': { step: 4, total: 5 },
  'rejeitado': { step: 0, total: 5 },
}

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

  function getDaysUntil(dateStr) {
    if (!dateStr) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(dateStr + 'T00:00:00')
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
  }

  function getProgressInfo(status) {
    const key = (status || '').toLowerCase()
    return STATUS_PROGRESS[key] || { step: 1, total: 5 }
  }

  const STATUS_OPTIONS = ['Todos', 'Inscrito', 'Teste Pendente', 'Entrevista', 'Feedback', 'Rejeitado']

  const filteredVagas =
    filterStatus === 'Todos'
      ? vagas
      : vagas.filter((v) => v.status?.toLowerCase() === filterStatus.toLowerCase())

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Carregando...
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Vagas</h2>
          <p>{vagas.length} candidatura{vagas.length !== 1 ? 's' : ''} cadastrada{vagas.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <HiOutlinePlus /> Nova Vaga
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filteredVagas.length > 0 ? (
        <div className="vaga-cards-grid">
          {filteredVagas.map((v) => {
            const dias = getDaysUntil(v.data_limite)
            const progress = getProgressInfo(v.status)
            const isRejected = (v.status || '').toLowerCase() === 'rejeitado'

            let prazoLabel = ''
            let prazoClass = ''
            if (dias !== null) {
              if (dias < 0) { prazoLabel = 'Expirado'; prazoClass = 'prazo-urgente' }
              else if (dias === 0) { prazoLabel = 'Hoje!'; prazoClass = 'prazo-urgente' }
              else if (dias <= 3) { prazoLabel = `${dias}d restante${dias > 1 ? 's' : ''}`; prazoClass = 'prazo-urgente' }
              else if (dias <= 7) { prazoLabel = `${dias}d restantes`; prazoClass = 'prazo-alerta' }
              else { prazoLabel = `${dias}d restantes`; prazoClass = 'prazo-ok' }
            }

            return (
              <div key={v.id} className={`vaga-card ${isRejected ? 'vaga-card--rejected' : ''}`}>
                {/* Header: plataforma */}
                <div className="vaga-card__header">
                  <div className="vaga-card__plataforma">
                    <HiOutlineOfficeBuilding className="vaga-card__plat-icon" />
                    <span>{v.plataforma}</span>
                  </div>
                  <StatusBadge status={v.status} />
                </div>

                {/* Empresa e Cargo */}
                <div className="vaga-card__body">
                  <h3 className="vaga-card__empresa">{v.empresa}</h3>
                  {v.cargo && <p className="vaga-card__cargo">{v.cargo}</p>}
                </div>

                {/* Info: data limite */}
                <div className="vaga-card__meta">
                  {v.data_limite && (
                    <div className="vaga-card__meta-item">
                      <HiOutlineCalendar />
                      <span>
                        {new Date(v.data_limite + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                      {prazoLabel && (
                        <span className={`vaga-card__prazo ${prazoClass}`}>{prazoLabel}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="vaga-card__progress">
                  <div className="vaga-card__progress-label">
                    <span>Seu Progresso</span>
                    <span>{isRejected ? '—' : `${progress.step}/${progress.total}`}</span>
                  </div>
                  <div className="vaga-card__progress-bar">
                    <div
                      className={`vaga-card__progress-fill ${isRejected ? 'rejected' : ''}`}
                      style={{ width: isRejected ? '100%' : `${(progress.step / progress.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="vaga-card__actions">
                  <button className="btn-card-text danger" onClick={() => handleDelete(v.id)}>
                    <HiOutlineTrash /> Excluir
                  </button>
                  <div className="vaga-card__actions-right">
                    {v.link && (
                      <a href={v.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                        <HiOutlineExternalLink /> Link
                      </a>
                    )}
                    <button className="btn btn-sm btn-primary" onClick={() => openEdit(v)}>
                      <HiOutlinePencil /> Editar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Nenhuma vaga encontrada</h3>
          <p>
            {filterStatus !== 'Todos'
              ? 'Tente mudar o filtro ou cadastre uma nova vaga.'
              : 'Clique em "Nova Vaga" para começar.'}
          </p>
        </div>
      )}

      {showModal && (
        <VagaModal
          vaga={editingVaga}
          onClose={closeModal}
          onSave={editingVaga ? handleUpdate : handleCreate}
        />
      )}
    </>
  )
}

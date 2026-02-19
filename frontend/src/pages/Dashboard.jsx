import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineLightningBolt,
} from 'react-icons/hi'
import { fetchVagas } from '../api/vagasApi'
import StatusBadge from '../components/StatusBadge'

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
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
    return diff
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
          <h2>Dashboard</h2>
          <p>Visão geral das suas candidaturas</p>
        </div>
        <Link to="/vagas" className="btn btn-primary">
          <HiOutlineBriefcase /> Ver Vagas
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineBriefcase size={22} /></div>
          <div className="stat-info">
            <h3>{total}</h3>
            <p>Total de Vagas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon teal"><HiOutlineClock size={22} /></div>
          <div className="stat-info">
            <h3>{inscritos}</h3>
            <p>Inscritos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><HiOutlineLightningBolt size={22} /></div>
          <div className="stat-info">
            <h3>{testePendente}</h3>
            <p>Teste Pendente</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon mauve"><HiOutlineCheckCircle size={22} /></div>
          <div className="stat-info">
            <h3>{entrevistas}</h3>
            <p>Entrevistas</p>
          </div>
        </div>
      </div>

      {/* Prazos Urgentes */}
      {urgentes.length > 0 && (
        <div className="urgency-section">
          <h3>
            <HiOutlineExclamation style={{ color: 'var(--accent-red)' }} />
            Prazos Próximos
          </h3>
          <div className="urgency-cards">
            {urgentes.map((v) => (
              <div key={v.id} className="urgency-card">
                <div className="uc-info">
                  <h4>{v.empresa}</h4>
                  <p>{v.plataforma} &middot; <StatusBadge status={v.status} /></p>
                </div>
                <div className="uc-days">
                  {v.dias === 0 ? 'Hoje!' : v.dias === 1 ? '1 dia' : `${v.dias}d`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vagas Recentes em Cards */}
      {vagas.length > 0 ? (
        <>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Vagas Recentes</h3>
          <div className="vaga-cards-grid">
            {vagas.slice(0, 6).map((v) => {
              const dias = getDaysUntil(v.data_limite)
              let prazoLabel = ''
              let prazoClass = ''
              if (dias !== null) {
                if (dias < 0) { prazoLabel = 'Expirado'; prazoClass = 'prazo-urgente' }
                else if (dias === 0) { prazoLabel = 'Hoje!'; prazoClass = 'prazo-urgente' }
                else if (dias <= 3) { prazoLabel = `${dias}d`; prazoClass = 'prazo-urgente' }
                else if (dias <= 7) { prazoLabel = `${dias}d`; prazoClass = 'prazo-alerta' }
                else { prazoLabel = `${dias}d`; prazoClass = 'prazo-ok' }
              }

              return (
                <div key={v.id} className="vaga-card">
                  <div className="vaga-card__header">
                    <div className="vaga-card__plataforma">
                      <span>{v.plataforma}</span>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="vaga-card__body">
                    <h3 className="vaga-card__empresa">{v.empresa}</h3>
                    {v.cargo && <p className="vaga-card__cargo">{v.cargo}</p>}
                  </div>
                  {v.data_limite && (
                    <div className="vaga-card__meta">
                      <div className="vaga-card__meta-item">
                        <span>{new Date(v.data_limite + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                        {prazoLabel && <span className={`vaga-card__prazo ${prazoClass}`}>{prazoLabel}</span>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Nenhuma vaga cadastrada</h3>
          <p>Vá para a página de vagas para começar a cadastrar.</p>
        </div>
      )}
    </>
  )
}

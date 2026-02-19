import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { HiX } from 'react-icons/hi'

const PLATAFORMAS = ['Gupy', 'Eureca', 'Universia', 'Outra']
const STATUS_OPTIONS = ['Inscrito', 'Teste Pendente', 'Entrevista', 'Feedback', 'Rejeitado']

export default function VagaModal({ vaga, onClose, onSave }) {
  const isEdit = Boolean(vaga?.id)

  const [form, setForm] = useState({
    empresa: '',
    cargo: '',
    plataforma: 'Gupy',
    link: '',
    data_limite: '',
    status: 'Inscrito',
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        empresa: vaga.empresa || '',
        cargo: vaga.cargo || '',
        plataforma: vaga.plataforma || 'Gupy',
        link: vaga.link || '',
        data_limite: vaga.data_limite || '',
        status: vaga.status || 'Inscrito',
      })
    }
  }, [vaga, isEdit])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const now = new Date().toISOString()

    if (isEdit) {
      onSave({ ...form })
    } else {
      onSave({
        id: uuidv4(),
        ...form,
        ultima_atualizacao: now,
      })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Editar Vaga' : 'Nova Vaga'}</h3>
          <button className="btn-icon" onClick={onClose}>
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Empresa</label>
              <input
                name="empresa"
                value={form.empresa}
                onChange={handleChange}
                placeholder="Ex: B3, Honda, Omie..."
                required
              />
            </div>
            <div className="form-group">
              <label>Plataforma</label>
              <select name="plataforma" value={form.plataforma} onChange={handleChange}>
                {PLATAFORMAS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Cargo</label>
            <input
              name="cargo"
              value={form.cargo}
              onChange={handleChange}
              placeholder="Ex: Estágio em Desenvolvimento de Software"
            />
          </div>

          <div className="form-group">
            <label>Link da Candidatura</label>
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data Limite</label>
              <input
                type="date"
                name="data_limite"
                value={form.data_limite}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Salvar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

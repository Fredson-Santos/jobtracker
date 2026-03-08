import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { v4 as uuidv4 } from 'uuid'
import { extractVagaFromLink } from '../api/vagasApi'


const PLATAFORMAS = [
  'LinkedIn',
  'Gupy',
  'Indeed',
  'InfoJobs',
  'Vagas.com',
  'Eureca',
  'CIEE',
  'Universia',
  'Outra'
]

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

  const [extracting, setExtracting] = useState(false)
  const [extractStatus, setExtractStatus] = useState(null) // 'success' | 'error' | null
  const [extractMsg, setExtractMsg] = useState('')

  async function handleExtract() {
    if (!form.link) return
    setExtracting(true)
    setExtractStatus(null)
    try {
      const data = await extractVagaFromLink(form.link)
      if (data.erro) {
        setExtractStatus('error')
        setExtractMsg('Erro ao acessar vaga. Tente preencher manualmente.')
        return
      }
      setForm((prev) => ({
        ...prev,
        empresa: data.empresa && data.empresa !== 'N/A' ? data.empresa : prev.empresa,
        cargo: data.cargo && data.cargo !== 'N/A' ? data.cargo : prev.cargo,
        plataforma: data.plataforma && data.plataforma !== 'N/A' ? data.plataforma : prev.plataforma,
      }))
      setExtractStatus('success')
      setExtractMsg('Dados extraídos com sucesso!')
    } catch {
      setExtractStatus('error')
      setExtractMsg('Não foi possível extrair os dados do link')
    } finally {
      setExtracting(false)
    }
  }

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

  return createPortal(
    <div

      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      <div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.25s ease' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white">
            {isEdit ? 'Editar Vaga' : 'Nova Vaga'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="material-icons-round text-lg">close</span>
          </button>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 pb-4 pt-2 space-y-2.5">

          {/* Empresa */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">

              <span className="material-icons-round text-base text-gray-400">business</span>
              Empresa
            </label>
            <input
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              placeholder="Ex: Google, Nubank..."
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"

            />
          </div>

          {/* Cargo */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">

              <span className="material-icons-round text-base text-gray-400">work_outline</span>
              Cargo
            </label>
            <input
              name="cargo"
              value={form.cargo}
              onChange={handleChange}
              placeholder="Ex: Estágio em Desenvolvimento"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"

            />
          </div>

          {/* Plataforma */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">

              <span className="material-icons-round text-base text-gray-400">category</span>
              Plataforma
            </label>
            <div className="relative">
              <select
                name="plataforma"
                value={form.plataforma}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-10 text-sm"

              >
                {PLATAFORMAS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <span className="material-icons-round text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xl">
                expand_more
              </span>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">

              <span className="material-icons-round text-base text-gray-400">link</span>
              Link da Candidatura
            </label>
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"

            />
            <button
              type="button"
              onClick={handleExtract}
              disabled={!form.link || extracting}
              className={`mt-1 text-xs flex items-center gap-1 font-medium ${
                extractStatus === 'error'
                  ? 'text-red-500 dark:text-red-400'
                  : extractStatus === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
              } disabled:text-gray-400`}
            >
              <span className="material-icons-round text-sm">
                {extractStatus === 'error' ? 'error_outline' : extractStatus === 'success' ? 'check_circle' : 'auto_awesome'}
              </span>
              {extracting
                ? 'Extraindo...'
                : extractStatus
                  ? extractMsg
                  : 'Preencher automaticamente pelo link'}
            </button>
          </div>

          {/* Data Limite + Status (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">

                <span className="material-icons-round text-base text-gray-400">event</span>
                Data Limite
              </label>
              <input
                type="date"
                name="data_limite"
                value={form.data_limite}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">

                <span className="material-icons-round text-base text-gray-400">flag</span>
                Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-10 text-sm"

                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="material-icons-round text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >

              {isEdit ? 'Salvar Alterações' : 'Salvar Vaga'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}


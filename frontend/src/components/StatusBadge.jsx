const STATUS_MAP = {
  inscrito: { label: 'Inscrito', className: 'badge-inscrito' },
  'teste pendente': { label: 'Teste Pendente', className: 'badge-teste' },
  entrevista: { label: 'Entrevista', className: 'badge-entrevista' },
  feedback: { label: 'Feedback', className: 'badge-feedback' },
  rejeitado: { label: 'Rejeitado', className: 'badge-rejeitado' },
}

export default function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const info = STATUS_MAP[key] || { label: status, className: 'badge-inscrito' }

  return <span className={`badge ${info.className}`}>{info.label}</span>
}

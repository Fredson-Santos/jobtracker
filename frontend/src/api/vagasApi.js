import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// ———— Vagas ————
export async function fetchVagas(skip = 0, limit = 100) {
  const { data } = await api.get('/vagas/', { params: { skip, limit } })
  return data
}

export async function fetchVaga(id) {
  const { data } = await api.get(`/vagas/${id}`)
  return data
}

export async function createVaga(vaga) {
  const { data } = await api.post('/vagas/', vaga)
  return data
}

export async function updateVaga(id, updates) {
  const { data } = await api.patch(`/vagas/${id}`, updates)
  return data
}

export async function deleteVaga(id) {
  const { data } = await api.delete(`/vagas/${id}`)
  return data
}

export default api

import axios from 'axios'

// Instância do Axios com a URL base da API para não repetir /api/v1 nos services.
export const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
})

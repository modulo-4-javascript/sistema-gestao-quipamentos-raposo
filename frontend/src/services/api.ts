const DEFAULT_API_BASE_URL = '/api/v1'

type JsonBody = object

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | JsonBody | null
}

export class ApiError extends Error {
  public readonly status: number
  public readonly details: unknown

  constructor(
    message: string,
    status: number,
    details: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function getApiBaseUrl() {
  // A URL base vem do .env do Vite. Em desenvolvimento, usamos /api/v1
  // para aproveitar o proxy do vite.config.ts e evitar problema de CORS.
  const apiUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE_URL

  return apiUrl.replace(/\/$/, '')
}

function isJsonBody(body: ApiRequestOptions['body']): body is JsonBody {
  return (
    Boolean(body) &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer)
  )
}

function getErrorMessage(data: unknown) {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: unknown }).message

    if (typeof message === 'string') {
      return message
    }
  }

  return 'Não foi possível completar a comunicação com a API.'
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const baseUrl = getApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const headers = new Headers(options.headers)
  const body = isJsonBody(options.body) ? JSON.stringify(options.body) : options.body

  if (isJsonBody(options.body)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...options,
    body,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type')
  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    // Centralizamos o erro aqui para as telas mostrarem uma mensagem simples.
    throw new ApiError(getErrorMessage(data), response.status, data)
  }

  return data as T
}

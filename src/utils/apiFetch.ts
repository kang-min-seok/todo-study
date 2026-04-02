interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  errorMessage?: string
}

export async function apiFetch<T = void>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, errorMessage, ...init } = options

  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) throw new Error(errorMessage ?? '요청에 실패했습니다')

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  errorMessage?: string
}

export async function apiFetch<T = void>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, errorMessage, ...init } = options

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    // 백엔드 ErrorResponse의 message 필드를 우선 사용
    let message = errorMessage ?? '요청에 실패했습니다'
    try {
      const errorBody = await res.json() as { message?: string }
      if (errorBody.message) message = errorBody.message
    } catch { /* 바디 파싱 실패 시 기본 메시지 사용 */ }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

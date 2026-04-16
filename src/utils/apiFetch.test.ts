import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch } from './apiFetch'

// apiFetch는 내부에서 전역 fetch를 호출한다.
// 실제 네트워크 요청이 나가면 안 되므로 fetch를 가짜 함수로 교체한다.
// vi.stubGlobal: 전역 객체의 특정 속성을 테스트용 가짜로 교체하는 Vitest 유틸

const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.unstubAllGlobals()  // 각 테스트 후 원래 fetch로 복구
  mockFetch.mockReset()  // mock 호출 기록 초기화
})

// 테스트에서 자주 쓰는 가짜 Response를 만들어주는 헬퍼 함수
function makeResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response
}

describe('apiFetch()', () => {
  describe('성공 응답', () => {
    it('응답 JSON을 파싱해서 반환한다', async () => {
      const data = [{ id: '1', title: '테스트', completed: false }]
      mockFetch.mockResolvedValue(makeResponse(data))

      const result = await apiFetch('/api/todos')

      expect(result).toEqual(data)
    })

    it('status 204이면 undefined를 반환한다 (응답 바디 없음)', async () => {
      mockFetch.mockResolvedValue(makeResponse(null, 204))

      const result = await apiFetch('/api/todos/1', { method: 'DELETE' })

      expect(result).toBeUndefined()
    })
  })

  describe('요청 형식', () => {
    it('body가 있으면 Content-Type: application/json 헤더를 붙인다', async () => {
      mockFetch.mockResolvedValue(makeResponse({ id: '1', title: '새 할일', completed: false }))

      await apiFetch('/api/todos', {
        method: 'POST',
        body: { title: '새 할일' },
      })

      // fetch가 실제로 어떤 인자로 호출됐는지 확인
      const [, options] = mockFetch.mock.calls[0]
      expect(options.headers['Content-Type']).toBe('application/json')
    })

    it('body가 없으면 Content-Type 헤더를 붙이지 않는다', async () => {
      mockFetch.mockResolvedValue(makeResponse([]))

      await apiFetch('/api/todos')

      const [, options] = mockFetch.mock.calls[0]
      expect(options.headers['Content-Type']).toBeUndefined()
    })

    it('body 객체를 JSON 문자열로 직렬화해서 보낸다', async () => {
      mockFetch.mockResolvedValue(makeResponse({ id: '1', title: '새 할일', completed: false }))

      await apiFetch('/api/todos', {
        method: 'POST',
        body: { title: '새 할일' },
      })

      const [, options] = mockFetch.mock.calls[0]
      expect(options.body).toBe(JSON.stringify({ title: '새 할일' }))
    })
  })

  describe('에러 처리', () => {
    it('응답이 ok가 아니면 에러를 던진다', async () => {
      mockFetch.mockResolvedValue(makeResponse({ message: 'Not Found' }, 404))

      await expect(apiFetch('/api/todos/999')).rejects.toThrow()
    })

    it('errorMessage 옵션이 있으면 해당 메시지로 에러를 던진다', async () => {
      mockFetch.mockResolvedValue(makeResponse(null, 500))

      await expect(
        apiFetch('/api/todos', { errorMessage: '서버 오류입니다' })
      ).rejects.toThrow('서버 오류입니다')
    })

    it('errorMessage가 없으면 기본 메시지로 에러를 던진다', async () => {
      mockFetch.mockResolvedValue(makeResponse(null, 500))

      await expect(apiFetch('/api/todos')).rejects.toThrow('요청에 실패했습니다')
    })
  })
})

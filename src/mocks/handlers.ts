import { http, HttpResponse } from 'msw'
import { db } from './db'

export const handlers = [
  // 전체 조회
  http.get('/api/todos', () => {
    return HttpResponse.json(db.getAll())
  }),

  // 할일 생성
  http.post('/api/todos', async ({ request }) => {
    const { title } = await request.json() as { title: string }
    const todo = db.create(title)
    return HttpResponse.json(todo, { status: 201 })
  }),

  // 단건 수정 (title, completed)
  http.patch('/api/todos/:id', async ({ request, params }) => {
    const patch = await request.json() as { title?: string; completed?: boolean }
    const updated = db.update(params.id as string, patch)
    if (!updated) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(updated)
  }),

  // 삭제
  http.delete('/api/todos/:id', ({ params }) => {
    const ok = db.delete(params.id as string)
    if (!ok) return new HttpResponse(null, { status: 404 })
    return new HttpResponse(null, { status: 204 })
  }),

  // 순서 변경
  http.put('/api/todos/reorder', async ({ request }) => {
    const { ids } = await request.json() as { ids: string[] }
    const reordered = db.reorder(ids)
    return HttpResponse.json(reordered)
  }),
]

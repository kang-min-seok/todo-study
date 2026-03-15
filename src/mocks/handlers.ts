import { http, HttpResponse } from 'msw'
import { db } from './db'

export const handlers = [
  // 전체 조회
  http.get('/api/todos', () => {
    return HttpResponse.json(db.todo.getAll())
  }),

  // 할일 생성
  http.post('/api/todos', async ({ request }) => {
    const { title } = await request.json() as { title: string }
    const todo = db.todo.create({ title, completed: false })
    return HttpResponse.json(todo, { status: 201 })
  }),

  // 단건 수정 (title, completed)
  http.patch('/api/todos/:id', async ({ request, params }) => {
    const patch = await request.json() as { title?: string; completed?: boolean }
    const updated = db.todo.update({
      where: { id: { equals: params.id as string } },
      data: patch,
    })
    if (!updated) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(updated)
  }),

  // 삭제
  http.delete('/api/todos/:id', ({ params }) => {
    const deleted = db.todo.delete({
      where: { id: { equals: params.id as string } },
    })
    if (!deleted) return new HttpResponse(null, { status: 404 })
    return new HttpResponse(null, { status: 204 })
  }),
]

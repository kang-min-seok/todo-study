import { useEffect, useState } from 'react'
import type { Todo, PageResponse } from '../types/todo'
import { apiFetch } from '../utils/apiFetch'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    apiFetch<PageResponse<Todo>>('/api/todos', { errorMessage: '할일 목록을 불러오는 데 실패했습니다' })
      .then(data => {
        if (active) {
          setTodos(data.content)
          setIsLoading(false)
        }
      })
    return () => { active = false }
  }, [])

  async function addTodo(title: string) {
    const created = await apiFetch<Todo>('/api/todos', {
      method: 'POST',
      body: { title },
      errorMessage: '할일 추가에 실패했습니다',
    })
    setTodos(prev => [...prev, created])
  }

  async function deleteTodo(id: number) {
    await apiFetch(`/api/todos/${id}`, { method: 'DELETE', errorMessage: '할일 삭제에 실패했습니다' })
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  async function editTodo(id: number, title: string) {
    const updated = await apiFetch<Todo>(`/api/todos/${id}`, {
      method: 'PUT',
      body: { title },
      errorMessage: '할일 수정에 실패했습니다',
    })
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  async function toggleTodo(id: number) {
    const updated = await apiFetch<Todo>(`/api/todos/${id}/complete`, {
      method: 'PATCH',
      errorMessage: '할일 상태 변경에 실패했습니다',
    })
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  return { todos, isLoading, addTodo, deleteTodo, editTodo, toggleTodo }
}

import { useEffect, useState } from 'react'
import type { Todo } from '../types/todo'
import { apiFetch } from '../utils/apiFetch'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    apiFetch<Todo[]>('/api/todos', { errorMessage: '할일 목록을 불러오는 데 실패했습니다' })
      .then(data => {
        if (active) {
          setTodos(data)
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

  async function deleteTodo(id: string) {
    await apiFetch(`/api/todos/${id}`, { method: 'DELETE', errorMessage: '할일 삭제에 실패했습니다' })
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  async function editTodo(id: string, title: string) {
    const updated = await apiFetch<Todo>(`/api/todos/${id}`, {
      method: 'PATCH',
      body: { title },
      errorMessage: '할일 수정에 실패했습니다',
    })
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  async function toggleTodo(id: string, completed: boolean) {
    const updated = await apiFetch<Todo>(`/api/todos/${id}`, {
      method: 'PATCH',
      body: { completed },
      errorMessage: '할일 상태 변경에 실패했습니다',
    })
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  async function reorderTodo(id: string, direction: 'up' | 'down') {
    const index = todos.findIndex(t => t.id === id)
    if (direction === 'up' && index <= 0) return
    if (direction === 'down' && index >= todos.length - 1) return

    const newIds = todos.map(t => t.id)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]]

    setTodos(await apiFetch<Todo[]>('/api/todos/reorder', {
      method: 'PUT',
      body: { ids: newIds },
      errorMessage: '순서 변경에 실패했습니다',
    }))
  }

  return { todos, isLoading, addTodo, deleteTodo, editTodo, toggleTodo, reorderTodo }
}

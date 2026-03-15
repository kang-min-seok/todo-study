import { useState } from 'react'
import type { Todo } from '../types/todo'
import TodoForm from '../components/todo/TodoForm'
import TodoList from '../components/todo/TodoList'

const initialTodos: Todo[] = [
  { id: '1', title: '이벤트 루프 학습', completed: true },
  { id: '2', title: '글로벌 에러 처리 구현', completed: true },
  { id: '3', title: 'MSW 설치 및 설정', completed: false },
]

function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)

  const handleAdd = (title: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    }
    setTodos(prev => [...prev, newTodo])
  }

  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const handleEdit = (id: string, title: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, title } : t))
  }

  const handleToggle = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const handleMoveUp = (id: string) => {
    setTodos(prev => {
      const index = prev.findIndex(t => t.id === id)
      if (index <= 0) return prev
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  const handleMoveDown = (id: string) => {
    setTodos(prev => {
      const index = prev.findIndex(t => t.id === id)
      if (index >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  const completedCount = todos.filter(t => t.completed).length

  return (
    <section className="flex flex-col items-center gap-6 flex-1 px-5 py-10">
      <div className="w-full max-w-lg text-left">
        <h1 className="text-2xl font-medium text-(--text-h) mb-1">할일 목록</h1>
        <p className="text-sm text-(--text) opacity-70">
          {completedCount} / {todos.length} 완료
        </p>
      </div>

      <TodoForm onAdd={handleAdd} />

      <TodoList
        todos={todos}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />
    </section>
  )
}

export default TodoPage

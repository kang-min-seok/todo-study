import type { Todo } from '../types/todo'

const STORAGE_KEY = 'msw-todos'

const seed: Todo[] = [
  { id: '1', title: '이벤트 루프 학습', completed: true },
  { id: '2', title: '글로벌 에러 처리 구현', completed: true },
  { id: '3', title: 'MSW 설치 및 설정', completed: false },
]

function load(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : seed
  } catch {
    return seed
  }
}

function save(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

let todos: Todo[] = load()

export const db = {
  getAll(): Todo[] {
    return todos
  },

  create(title: string): Todo {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    }
    todos = [...todos, todo]
    save(todos)
    return todo
  },

  update(id: string, patch: Partial<Pick<Todo, 'title' | 'completed'>>): Todo | null {
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) return null
    todos = todos.map(t => t.id === id ? { ...t, ...patch } : t)
    save(todos)
    return todos[index]
  },

  delete(id: string): boolean {
    const exists = todos.some(t => t.id === id)
    if (!exists) return false
    todos = todos.filter(t => t.id !== id)
    save(todos)
    return true
  },

  reorder(ids: string[]): Todo[] {
    const map = new Map(todos.map(t => [t.id, t]))
    todos = ids.map(id => map.get(id)).filter((t): t is Todo => t !== undefined)
    save(todos)
    return todos
  },
}

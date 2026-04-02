import type { Todo } from '../../types/todo'
import TodoItem from './TodoItem'

interface Props {
  todos: Todo[]
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
  onToggle: (id: string) => void
}

function TodoList({ todos, onDelete, onEdit, onToggle }: Props) {
  if (todos.length === 0) {
    return (
      <p className="text-sm text-(--text) opacity-60 py-10">
        할일이 없습니다. 새로운 할일을 추가해보세요!
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2 w-full max-w-lg">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}

export default TodoList

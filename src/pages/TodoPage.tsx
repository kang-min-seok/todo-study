import { useTodos } from '../hooks/useTodos'
import TodoForm from '../components/todo/TodoForm'
import TodoList from '../components/todo/TodoList'

function TodoPage() {
  const { todos, isLoading, addTodo, deleteTodo, editTodo, toggleTodo } = useTodos()

  const completedCount = todos.filter(t => t.completed).length

  return (
    <section className="flex flex-col items-center gap-6 flex-1 px-5 py-10">
      <div className="w-full max-w-lg text-left">
        <h1 className="text-2xl font-medium text-(--text-h) mb-1">할일 목록</h1>
        <p className="text-sm text-(--text) opacity-70">
          {isLoading ? '불러오는 중...' : `${completedCount} / ${todos.length} 완료`}
        </p>
      </div>

      <TodoForm onAdd={addTodo} />

      {isLoading ? (
        <div className="flex flex-col gap-2 w-full max-w-lg">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 rounded-lg bg-(--border) animate-pulse" />
          ))}
        </div>
      ) : (
        <TodoList
          todos={todos}
          onDelete={deleteTodo}
          onEdit={editTodo}
          onToggle={(id) => {
            const todo = todos.find(t => t.id === id)
            if (todo) toggleTodo(id, !todo.completed)
          }}
        />
      )}
    </section>
  )
}

export default TodoPage

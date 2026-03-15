import { useState } from 'react'
import { cn } from '../../utils/cn'
import type { Todo } from '../../types/todo'

interface Props {
  todo: Todo
  isFirst: boolean
  isLast: boolean
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
  onToggle: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
}

const iconBtn = 'px-2 py-1 rounded text-xs transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'

function TodoItem({ todo, isFirst, isLast, onDelete, onEdit, onToggle, onMoveUp, onMoveDown }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  const handleSave = () => {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    onEdit(todo.id, trimmed)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 rounded-lg border border-(--border) bg-[(--bg)]">
      {/* 체크박스 */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-4 h-4 accent-[(--accent)] cursor-pointer shrink-0"
      />

      {isEditing ? (
        /* 수정 모드 */
        <>
          <input
            type="text"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={handleEditKeyDown}
            autoFocus
            className="flex-1 px-2 py-1 rounded border border-[(--accent)] bg-[(--bg)] text-[(--text-h)] text-sm focus:outline-none"
          />
          <div className="flex gap-1 shrink-0">
            <button
              onClick={handleSave}
              disabled={!editTitle.trim()}
              className={cn(iconBtn, 'bg-[(--accent)] text-white hover:opacity-90 disabled:opacity-30')}
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className={cn(iconBtn, 'border border-[(--border)] text-[(--text)] hover:border-[(--accent)]')}
            >
              취소
            </button>
          </div>
        </>
      ) : (
        /* 뷰 모드 */
        <>
          <span
            className={cn(
              'flex-1 text-sm text-left',
              todo.completed ? 'line-through text-[(--text)] opacity-60' : 'text-[(--text-h)]'
            )}
          >
            {todo.title}
          </span>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onMoveUp(todo.id)}
              disabled={isFirst}
              className={cn(iconBtn, 'border border-[(--border)] text-[(--text)] hover:border-[(--accent)]')}
            >
              ▲
            </button>
            <button
              onClick={() => onMoveDown(todo.id)}
              disabled={isLast}
              className={cn(iconBtn, 'border border-[(--border)] text-[(--text)] hover:border-[(--accent)]')}
            >
              ▼
            </button>
            <button
              onClick={() => { setEditTitle(todo.title); setIsEditing(true) }}
              className={cn(iconBtn, 'border border-[(--border)] text-[(--text)] hover:border-[(--accent)]')}
            >
              수정
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className={cn(iconBtn, 'border border-red-200 text-red-500 hover:border-red-500 dark:border-red-900 dark:text-red-400')}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default TodoItem

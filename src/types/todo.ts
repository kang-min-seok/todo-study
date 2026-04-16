export interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number   // 현재 페이지 번호 (0부터 시작)
  size: number
  first: boolean
  last: boolean
}

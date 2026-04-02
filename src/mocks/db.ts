import { factory, primaryKey } from '@mswjs/data'

export const db = factory({
  todo: {
    id: primaryKey(() => crypto.randomUUID()),
    title: String,
    completed: Boolean,
  },
})

// 시드 데이터
db.todo.create({ title: '이벤트 루프 학습', completed: false })
db.todo.create({ title: '글로벌 에러 처리 구현', completed: false })
db.todo.create({ title: 'MSW 설치 및 설정', completed: false })

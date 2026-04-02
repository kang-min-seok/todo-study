# MSW(Mock Service Worker) 구현 문서

## 개요

MSW는 Service Worker를 이용해 브라우저의 네트워크 요청을 가로채는 API 모킹 라이브러리다.
실제 백엔드 서버 없이도 `fetch('/api/todos')` 같은 실제 HTTP 요청을 보내고,
MSW가 이를 중간에서 잡아 미리 정의한 응답을 돌려준다.

```
fetch('/api/todos')
       ↓
  Service Worker (MSW)
       ↓
  handlers.ts에서 응답 반환
       ↓
  실제 서버처럼 동작
```

---

## 전체 흐름

```
main.tsx
  └─ enableMocking() → worker.start()   # Service Worker 등록
       ↓
  React 렌더 시작
       ↓
  TodoPage → useTodos 훅
       ↓
  fetch('/api/todos')                   # 실제 HTTP 요청 발생
       ↓
  MSW Service Worker가 요청 가로챔
       ↓
  handlers.ts에서 매칭되는 핸들러 실행
       ↓
  db.ts에서 데이터 조회/수정
       ↓
  JSON 응답 반환
       ↓
  useTodos가 setTodos로 상태 업데이트
       ↓
  TodoPage 리렌더
```

---

## 파일별 역할

### `public/mockServiceWorker.js`

**왜 만들었나**: MSW가 네트워크 요청을 가로채기 위해 브라우저에 등록하는 Service Worker 스크립트다.
`pnpm dlx msw init public/` 명령으로 자동 생성되며 직접 수정하지 않는다.

Service Worker는 브라우저와 네트워크 사이에서 동작하는 별도 스레드다.
`fetch` 요청이 발생하면 이 파일이 먼저 요청을 가로채서 MSW로 전달한다.

```
브라우저 → fetch 요청 → Service Worker(이 파일) → MSW handlers → 응답
```

---

### `src/mocks/db.ts`

**왜 만들었나**: API 핸들러가 데이터를 읽고 쓸 저장소가 필요하다.
실제 백엔드의 DB 역할을 한다. localStorage를 backing store로 사용해
**새로고침 후에도 데이터가 유지**된다.

**구조**:
```ts
// 모듈 변수 — 메모리 내 현재 상태
let todos: Todo[] = load()

export const db = {
  getAll()              // 전체 조회
  create(title)         // 생성 (crypto.randomUUID로 id 발급)
  update(id, patch)     // 부분 수정 (title 또는 completed)
  delete(id)            // 삭제
  reorder(ids)          // 순서 재정렬
}
```

**데이터 흐름**:
```
db 메서드 호출
    ↓
메모리(todos 변수) 업데이트
    ↓
save() → localStorage.setItem('msw-todos', JSON.stringify(todos))
```

**초기화 흐름**:
```
모듈 로드 시 load() 실행
    ↓
localStorage에 'msw-todos' 키가 있으면 → 파싱해서 사용 (이전 데이터 복원)
localStorage가 비어있으면 → seed 데이터 3개 사용
```

---

### `src/mocks/handlers.ts`

**왜 만들었나**: "어떤 URL로 어떤 HTTP 메서드가 오면 어떤 응답을 돌려줄지" 정의하는 파일이다.
실제 백엔드의 라우터/컨트롤러에 해당한다.

**정의된 핸들러**:

| 메서드 | URL | 동작 |
|--------|-----|------|
| GET | `/api/todos` | `db.getAll()` 반환 |
| POST | `/api/todos` | body의 `title`로 `db.create()` 후 201 반환 |
| PATCH | `/api/todos/:id` | body의 patch 객체로 `db.update()`, 없으면 404 |
| DELETE | `/api/todos/:id` | `db.delete()`, 없으면 404, 성공 시 204 |
| PUT | `/api/todos/reorder` | body의 `ids` 배열로 `db.reorder()` |

**핸들러 작성 방식**:
```ts
http.get('/api/todos', () => {
  return HttpResponse.json(db.getAll())   // JSON 응답
})

http.delete('/api/todos/:id', ({ params }) => {
  //                              ↑ URL 파라미터 자동 파싱
  const ok = db.delete(params.id as string)
  if (!ok) return new HttpResponse(null, { status: 404 })
  return new HttpResponse(null, { status: 204 })  // 본문 없는 응답
})
```

---

### `src/mocks/browser.ts`

**왜 만들었나**: `handlers`를 Service Worker에 등록하는 Worker 인스턴스를 만드는 파일이다.
`setupWorker`에 핸들러를 넘겨 Worker를 생성하고, `main.tsx`에서 이걸 `start()`한다.

```ts
export const worker = setupWorker(...handlers)
// main.tsx에서: worker.start() → Service Worker 브라우저에 등록
```

이 파일을 별도로 분리한 이유는 `main.tsx`에서 **동적 import**로 불러오기 위해서다.

```ts
// main.tsx
const { worker } = await import('./mocks/browser')  // 동적 import
```

브라우저 환경에서만 실행되어야 하는 코드를 번들에서 분리해 SSR 등 다른 환경에서 실수로 실행되지 않도록 한다.

---

### `src/main.tsx` (수정)

**왜 수정했나**: React 앱이 렌더되기 전에 MSW Service Worker가 먼저 등록되어야 한다.
Worker 등록 전에 `fetch`가 발생하면 MSW가 가로채지 못하고 실제 서버로 나가버린다.

**핵심 패턴**:
```ts
async function enableMocking() {
  if (import.meta.env.DEV) {              // 개발 환경에서만 실행
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
    //                                        ↑ 핸들러 없는 요청은 그냥 통과
  }
}

// Worker 등록이 완료된 후에 렌더 시작
enableMocking().then(() => {
  createRoot(...).render(...)
})
```

`onUnhandledRequest: 'bypass'`를 설정하는 이유: 핸들러가 없는 요청(예: Vite HMR, CDN 등)을
MSW가 경고 없이 그냥 통과시킨다. 없으면 콘솔에 경고가 쏟아진다.

---

### `src/hooks/useTodos.ts`

**왜 만들었나**: TodoPage에서 API 호출 로직을 분리하기 위한 커스텀 훅이다.
컴포넌트는 "무엇을 보여줄지"만 담당하고, API 호출은 이 훅이 담당하는 관심사 분리다.

나중에 MSW를 제거하고 실제 백엔드로 교체할 때 **이 파일만 수정**하면 된다.
TodoPage, TodoList, TodoItem은 전혀 건드리지 않아도 된다.

**내부 구조**:
```ts
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 마운트 시 목록 로드
  useEffect(() => { fetchTodos() }, [])

  // 각 함수: fetch → 성공 시 setTodos → 실패 시 throw
  // throw된 에러는 unhandledrejection → globalErrorHandler → Toast로 전달
  async function addTodo(title) { ... }
  async function deleteTodo(id) { ... }
  async function editTodo(id, title) { ... }
  async function toggleTodo(id, completed) { ... }
  async function reorderTodo(id, direction) { ... }

  return { todos, isLoading, addTodo, deleteTodo, editTodo, toggleTodo, reorderTodo }
}
```

**에러 처리 방식**:
각 함수에서 `!res.ok`이면 `throw new Error(...)` 한다.
try-catch 없이 throw만 하면 → async 함수의 Promise가 reject → `unhandledrejection` 이벤트 →
`globalErrorHandler.ts`가 잡아서 `app:error` CustomEvent 발행 → `Toast` 컴포넌트가 표시.

---

### `src/pages/TodoPage.tsx` (수정)

**왜 수정했나**: 기존에는 `useState`로 데이터를 직접 관리했다.
이제 `useTodos` 훅에서 데이터와 핸들러를 받아 쓰도록 변경했다.
로딩 중에는 스켈레톤 UI를 표시한다.

**변경 전 → 변경 후**:
```ts
// 변경 전: 로컬 상태로 직접 관리
const [todos, setTodos] = useState<Todo[]>(initialTodos)
const handleAdd = (title) => setTodos(prev => [...prev, { id: crypto.randomUUID(), ... }])

// 변경 후: 훅에서 API 연동된 함수를 받아서 사용
const { todos, isLoading, addTodo, ... } = useTodos()
```

---

## 개발자도구에서 확인하기

MSW가 정상 동작하면 브라우저 콘솔에 아래 메시지가 출력된다:
```
[MSW] Mocking enabled.
```

Network 탭을 열면 실제 HTTP 요청이 오가는 것처럼 보이지만,
Response를 보면 MSW가 반환한 mock 데이터임을 확인할 수 있다.

Application 탭 → Local Storage → `msw-todos` 키에 데이터가 저장되어 있으며,
새로고침 후에도 이 데이터가 유지된다.

---

## 실제 백엔드로 교체할 때

MSW 제거 시 수정이 필요한 파일은 `src/hooks/useTodos.ts` 하나뿐이다.
각 함수 안의 fetch URL을 실제 API 주소로 바꾸면 된다.
나머지 컴포넌트(TodoPage, TodoList, TodoItem)는 수정 불필요.

```ts
// useTodos.ts 수정 예시
async function addTodo(title: string) {
  // 변경 전: fetch('/api/todos', ...)    ← MSW가 가로채던 URL
  // 변경 후: fetch('https://api.myapp.com/todos', ...)  ← 실제 서버
}
```

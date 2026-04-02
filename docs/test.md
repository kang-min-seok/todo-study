# 테스트 학습 계획

## 학습 목표

이 실습이 끝났을 때 할 수 있어야 하는 것:

- 단위/통합/E2E 테스트의 차이를 설명하고 언제 각각을 써야 하는지 판단할 수 있다
- Vitest + React Testing Library로 컴포넌트와 커스텀 훅을 테스트할 수 있다
- MSW를 활용해 API 의존성을 격리한 통합 테스트를 작성할 수 있다
- "좋은 테스트"와 "나쁜 테스트"를 구분하는 기준을 갖는다

---

## 1. 테스트란 무엇인가

코드가 **의도한 대로 동작한다는 것을 기계적으로 검증하는 코드**다.

테스트가 없으면:
- 코드를 수정할 때마다 전체를 손으로 확인해야 한다
- 기능이 많아질수록 확인해야 할 경우의 수가 기하급수적으로 늘어난다
- 리팩토링이 두렵다 — "건드렸다가 다른 데서 뭔가 깨지면 어떡하지"

테스트가 있으면:
- 수정 후 `pnpm test`를 실행하면 무엇이 깨졌는지 즉시 알 수 있다
- 리팩토링을 자신 있게 할 수 있다
- 코드가 문서 역할도 한다 — "이 함수는 이런 상황에서 이렇게 동작해야 한다"

---

## 2. 테스트의 종류

### 단위 테스트 (Unit Test)

**"이 함수 하나가 올바르게 동작하는가?"**

가장 작은 단위(함수, 클래스, 컴포넌트 단독)를 격리해서 테스트한다.
외부 의존성(API, DB, 다른 모듈)은 **모두 가짜(mock)로 대체**한다.

```
[테스트 대상]    cn() 유틸
[입력]           'foo', { bar: true }
[기대 출력]      'foo bar'
[외부 의존]      없음
```

- 빠르다 (ms 단위)
- 실패 원인을 정확히 특정할 수 있다
- 하지만 "각 부품이 정상"이어도 "조합했을 때 정상"을 보장하지 않는다

---

### 통합 테스트 (Integration Test)

**"여러 모듈이 함께 동작했을 때 올바른가?"**

실제로 연결된 여러 모듈을 함께 실행한다.
단, 외부 시스템(실제 서버, 실제 DB)은 여전히 가짜로 대체한다.

```
[테스트 대상]    TodoPage 전체 (컴포넌트 + useTodos 훅 + apiFetch)
[입력]           사용자가 "할일 추가" 버튼 클릭
[기대 출력]      목록에 새 항목이 추가되어 있음
[외부 의존]      실제 서버 대신 MSW로 대체
```

- 단위 테스트보다 느리지만 현실에 가까운 검증을 한다
- 프론트엔드에서 가장 가치 있는 테스트 계층이다
- React Testing Library가 이 계층에 집중하도록 설계되어 있다

---

### E2E 테스트 (End-to-End Test)

**"실제 브라우저에서 사용자 시나리오 전체가 동작하는가?"**

실제 브라우저를 띄워서 실제 서버에 요청을 보내며 전체 흐름을 검증한다.
Playwright, Cypress 같은 도구를 사용한다.

```
[테스트 대상]    로그인 → Todo 추가 → 새로고침 → 데이터 유지 확인
[입력]           실제 브라우저 조작
[기대 출력]      페이지에 결과가 올바르게 보임
[외부 의존]      없음 (실제 서버, 실제 DB 사용)
```

- 가장 현실에 가깝다
- 하지만 느리고, 설정이 복잡하고, 깨지기 쉽다 (Flaky Test 문제)
- 핵심 사용자 시나리오에만 선택적으로 작성한다

---

### 테스트 피라미드

```
        △ E2E
       △△△△△ 통합
      △△△△△△△△ 단위
```

아래로 갈수록: 빠르고, 저렴하고, 격리성이 높다.
위로 갈수록: 느리고, 비싸고, 현실에 가깝다.

**실무 전략**: 단위 테스트를 가장 많이, E2E를 가장 적게.
단, React 생태계에서는 컴포넌트 특성상 **통합 테스트 비중이 상대적으로 높다.**

---

## 3. 좋은 테스트란 무엇인가

### 핵심 원칙: 구현이 아닌 동작을 테스트하라

나쁜 테스트:
```ts
// "useState가 호출되었는가?" → 구현 세부사항을 테스트
expect(useStateSpy).toHaveBeenCalled()
```

좋은 테스트:
```ts
// "사용자 입장에서 할일이 추가되었는가?" → 동작을 테스트
expect(screen.getByText('새 할일')).toBeInTheDocument()
```

구현을 테스트하면:
- 내부 코드를 리팩토링할 때마다 테스트가 깨진다
- 리팩토링을 막는 테스트가 된다 (테스트가 없는 것보다 나쁠 수 있다)

동작을 테스트하면:
- 내부 구현을 어떻게 바꿔도 사용자가 같은 결과를 보는 한 테스트가 통과한다
- 안전한 리팩토링을 가능하게 한다

---

### F.I.R.S.T 원칙

좋은 테스트가 갖춰야 할 5가지 속성:

| 속성 | 설명 |
|------|------|
| **Fast** | 빠르게 실행된다 (느린 테스트는 안 돌리게 된다) |
| **Independent** | 다른 테스트에 의존하지 않는다 (순서 무관) |
| **Repeatable** | 어떤 환경에서도 같은 결과가 나온다 |
| **Self-validating** | 통과/실패를 자동으로 판단한다 (눈으로 확인 불필요) |
| **Timely** | 코드 작성과 함께 작성한다 (나중에 몰아쓰면 고통) |

---

### AAA 패턴 (테스트 코드 구조)

모든 테스트는 이 3단계 구조로 작성한다:

```ts
it('할일을 추가하면 목록에 표시된다', async () => {
  // Arrange — 준비: 초기 상태 설정
  render(<TodoPage />)

  // Act — 실행: 사용자 행동 시뮬레이션
  await userEvent.type(screen.getByPlaceholderText('할일을 입력하세요'), '새 할일')
  await userEvent.click(screen.getByRole('button', { name: '추가' }))

  // Assert — 검증: 기대 결과 확인
  expect(screen.getByText('새 할일')).toBeInTheDocument()
})
```

---

### 테스트 커버리지에 대한 오해

**커버리지 100% = 좋은 테스트? → 아니다.**

```ts
// 커버리지는 100%지만 아무것도 검증하지 않는 테스트
it('실행은 된다', () => {
  addTodo('test')
  expect(true).toBe(true)  // 의미 없는 단언
})
```

커버리지는 **테스트가 어떤 코드를 실행했는지**만 측정한다.
그 코드가 올바른지는 측정하지 않는다.

실무에서 커버리지는 "테스트가 없는 곳을 찾는 도구"로 사용하고,
숫자 자체에 집착하지 않는다.

---

## 4. React Testing Library 철학

RTL(React Testing Library)의 핵심 철학:

> "테스트는 소프트웨어가 사용되는 방식과 유사할수록 더 많은 신뢰를 준다."
> — Kent C. Dodds (RTL 창시자)

**사용자가 보는 것을 쿼리한다.**

```ts
// 나쁜 쿼리 (구현 세부사항)
container.querySelector('.todo-item')
wrapper.find(TodoItem)

// 좋은 쿼리 (사용자가 인식하는 것)
screen.getByRole('button', { name: '삭제' })    // 역할 + 이름
screen.getByText('이벤트 루프 학습')             // 보이는 텍스트
screen.getByPlaceholderText('할일을 입력하세요') // placeholder
screen.getByLabelText('완료 여부')               // label과 연결된 input
```

쿼리 우선순위 (RTL 공식 권장):
1. `getByRole` — 접근성 역할 (가장 권장)
2. `getByLabelText` — 폼 요소
3. `getByPlaceholderText` — placeholder
4. `getByText` — 텍스트 내용
5. `getByTestId` — `data-testid` (최후의 수단)

---

## 5. 이 프로젝트의 테스트 전략

### 테스트 대상 선정 기준

| 테스트할 것 | 이유 |
|------------|------|
| `cn()` 유틸 | 순수 함수, 입출력이 명확 |
| `apiFetch()` 유틸 | 에러 처리 로직, 분기가 있음 |
| `useTodos` 훅 | 핵심 비즈니스 로직, 버그 발생 시 영향 큼 |
| `TodoForm` 컴포넌트 | 사용자 인터랙션 (입력, 제출, 유효성 검사) |
| `TodoItem` 컴포넌트 | 뷰/수정 모드 전환, 인터랙션 |
| `TodoPage` 통합 | 전체 흐름 (API 요청 → 상태 → 렌더) |

### 테스트하지 않을 것

| 테스트 안 할 것 | 이유 |
|----------------|------|
| Tailwind 클래스 | 스타일은 시각적 검증이 필요 (스냅샷 테스트도 권장하지 않음) |
| `main.tsx` | 부트스트랩 코드, 통합 테스트에서 커버됨 |
| MSW handlers | 테스트 자체가 MSW를 쓰기 때문에 handlers를 테스트하면 순환 |
| 서드파티 라이브러리 | 이미 해당 라이브러리가 자체 테스트를 가지고 있음 |

---

## 6. 실습 단계

### 6-1. 환경 설정

설치할 패키지:
```bash
pnpm add -D vitest @vitest/coverage-v8 jsdom
pnpm add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

생성할 파일:
- `vitest.config.ts` — 테스트 러너 설정
- `src/test/setup.ts` — `@testing-library/jest-dom` matchers 등록

### 6-2. 단위 테스트 실습

작성할 테스트 파일:
- `src/utils/cn.test.ts` — 순수 함수 단위 테스트
- `src/utils/apiFetch.test.ts` — fetch 유틸 단위 테스트

배울 개념:
- `describe` / `it` / `expect` 기본 구조
- `vi.fn()` mock 함수
- `vi.stubGlobal()` 전역 객체 모킹 (fetch)

### 6-3. 컴포넌트 테스트 실습

작성할 테스트 파일:
- `src/components/todo/TodoForm.test.tsx` — 폼 입력/제출 테스트
- `src/components/todo/TodoItem.test.tsx` — 뷰/수정 모드 전환 테스트

배울 개념:
- `render()` + `screen` 쿼리
- `userEvent.type()`, `userEvent.click()` 사용자 이벤트 시뮬레이션
- `waitFor()` 비동기 업데이트 대기

### 6-4. 훅 + MSW 통합 테스트 실습

작성할 테스트 파일:
- `src/hooks/useTodos.test.ts` — API 연동 훅 테스트

배울 개념:
- MSW `setupServer()` (Node 환경용) 설정
- `server.use()` 로 특정 테스트에서 핸들러 오버라이드
- 에러 응답 시뮬레이션 테스트

### 6-5. 페이지 통합 테스트 실습

작성할 테스트 파일:
- `src/pages/TodoPage.test.tsx` — 전체 사용자 시나리오 테스트

배울 개념:
- 로딩 상태 테스트 (`waitForElementToBeRemoved`)
- 여러 상호작용이 연결된 시나리오 테스트

---

## 7. 예상 결과물 (파일 목록)

```
vitest.config.ts
src/
  test/
    setup.ts
  utils/
    cn.test.ts
    apiFetch.test.ts
  components/
    todo/
      TodoForm.test.tsx
      TodoItem.test.tsx
  hooks/
    useTodos.test.ts
  pages/
    TodoPage.test.tsx
```

---

## 참고 자료

- [React Testing Library 공식 문서](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest 공식 문서](https://vitest.dev/)
- [Which query should I use? (RTL 쿼리 우선순위)](https://testing-library.com/docs/queries/about#priority)
- [Kent C. Dodds — Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)

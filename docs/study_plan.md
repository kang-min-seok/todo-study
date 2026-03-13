# 🚀 React & Infrastructure Mastery Roadmap
## 📅 학습 흐름 요약

1.  **이벤트 루프** (JS 기반 다지기)
2.  **글로벌 에러 처리** (앱 안정성)
3.  **환경 구분** (설정 분리)
4.  **MSW** (개발 편의)
5.  **테스트** (품질 보증)
6.  **Docker Compose** (컨테이너화)
7.  **Nginx** (웹 서버)
8.  **CI/CD** (자동화)
9.  **인프라 아키텍처** (전체 그림)
10. **모니터링** (운영 관측)

---

## 🛠 단계별 상세 학습 가이드

### 1단계 — 이벤트 루프 복습
* **목표**: JavaScript 비동기 동작 원리를 정확히 이해하고 React와의 연관성 파악
* **핵습 내용**:
    * Call Stack / Web APIs / Callback Queue / Microtask Queue 구조
    * `setTimeout`, `Promise`, `async/await` 실행 순서 비교
    * React 19 `useTransition`, `startTransition`과 이벤트 루프 연동
* **실습**: `EventLoopDemo.tsx` 구현, 브라우저 Performance 탭 분석

### 2단계 — 글로벌 에러 처리
* **목표**: 런타임 에러를 안전하게 포착하고 사용자에게 적절한 피드백 제공
* **학습 내용**:
    * React Error Boundary (`componentDidCatch`, `getDerivedStateFromError`)
    * 전역 에러 핸들링 (`window.onerror`, `unhandledrejection`)
    * React 19 `createRoot`의 `onUncaughtError`, `onRecoverableError` 옵션
* **실습**: 재사용 가능한 `ErrorBoundary.tsx` 및 `ErrorFallback.tsx` 구현

### 3단계 — 개발/배포 환경 구분
* **목표**: 환경별 설정을 분리하고 빌드 시 올바른 값이 주입되는지 확인
* **학습 내용**:
    * Vite 환경 변수 (`import.meta.env`, `.env` 우선순위)
    * `VITE_` 접두사 규칙과 타입 선언 (`vite-env.d.ts`)
* **실습**: `.env.development` / `.env.production` 설정 및 환경 변수 타입 세이프 래핑

### 4단계 — MSW (Mock Service Worker)
* **목표**: 백엔드 없이 API를 모킹하여 독립적인 프론트엔드 개발 환경 구축
* **학습 내용**:
    * Service Worker의 네트워크 인터셉트 원리
    * 브라우저(`setupWorker`) 및 Node(`setupServer`) 환경 설정
* **실습**: Todo API 핸들러 작성 및 개발 환경 조건부 활성화

### 5단계 — 테스트
* **목표**: 유닛/통합 테스트 구조 이해 및 작성
* **학습 내용**:
    * Vitest(러너) & React Testing Library(사용자 행동 중심 테스트)
    * MSW를 활용한 API 모킹 테스트 (4단계 연계)
* **실습**: `TodoList.test.tsx`, `useTodos.test.ts` 작성 및 커버리지 확인

### 6단계 — Docker Compose
* **목표**: 앱을 컨테이너화하고 로컬에서 프로덕션 유사 환경 구성
* **학습 내용**:
    * 멀티스테이지 빌드 (Node 빌드 → Nginx 서빙)
    * `docker-compose.yml` 서비스 오케스트레이션
* **실습**: `Dockerfile` 작성 및 컨테이너 실행 (`docker compose up`)

### 7단계 — Nginx
* **목표**: 웹 서버 설정으로 SPA 라우팅 및 성능 최적화
* **학습 내용**:
    * SPA `try_files` 설정 (새로고침 이슈 해결)
    * 정적 자산 캐싱 전략 및 Gzip/Brotli 압축
* **실습**: `nginx.conf` 최적화 및 리버스 프록시 설정

### 8단계 — CI/CD
* **목표**: 자동화된 파이프라인(Lint → Test → Build → Deploy) 구성
* **학습 내용**:
    * GitHub Actions Workflow 구성
    * pnpm 캐싱 전략 및 GHCR(Container Registry) 이미지 푸시
* **실습**: `.github/workflows/ci.yml`, `cd.yml` 작성

### 9단계 — 인프라 아키텍처
* **목표**: 전체 시스템 구성도 이해 및 문서화
* **학습 내용**:
    * 배포 방식 비교 (S3+CloudFront vs Container)
    * HTTPS 설정 (Let's Encrypt) 및 로드 밸런서 흐름
* **실습**: Mermaid를 활용한 `architecture.md` 작성

### 10단계 — 모니터링
* **목표**: 프로덕션 에러와 성능 지표 수집 및 시각화
* **학습 내용**:
    * Sentry 연동 (에러 추적 및 Source Map 업로드)
    * Web Vitals 측정 및 리포팅
* **실습**: `sentry.ts` 초기화 및 대시보드 에러 확인

---

## 📁 목표 파일 구조

```text
todo-study/
├── .github/workflows/         # 8단계: CI/CD
├── src/
│   ├── components/            # 2단계: ErrorBoundary
│   ├── config/env.ts          # 3단계: 환경 변수
│   ├── mocks/                 # 4단계: MSW 핸들러
│   ├── monitoring/            # 10단계: Sentry/Vitals
│   └── __tests__/             # 5단계: Vitest
├── docs/architecture.md       # 9단계: 인프라 다이어그램
├── Dockerfile                 # 6단계: 도커 빌드
├── docker-compose.yml         # 6단계: 오케스트레이션
├── nginx.conf                 # 7단계: 서버 설정
├── vitest.config.ts           # 5단계: 테스트 설정
├── .env.development           # 3단계: 환경 설정
└── .env.production
```
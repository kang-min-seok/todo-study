import ErrorBoundary from './components/error/ErrorBoundary'
import ErrorFallback from './components/error/ErrorFallback'
import Toast from './components/Toast'
import TodoPage from './pages/TodoPage'
import MainPage from './pages/MainPage'
import EditorPage from './pages/EditorPage'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/error-demo" element={<MainPage />} />
      </Routes>
      <Toast />
    </ErrorBoundary>
  )
}

export default App

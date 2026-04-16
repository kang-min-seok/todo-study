import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerGlobalErrorHandlers } from './utils/globalErrorHandler'
import { BrowserRouter } from 'react-router'

registerGlobalErrorHandlers()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

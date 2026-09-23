import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'md-editor-rt/lib/style.css'
import 'md-editor-rt/lib/preview.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

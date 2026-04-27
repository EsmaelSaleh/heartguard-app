import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { installDemoFetchMock } from './demo-mock'

// Install fetch mock before React renders when ?demo is present
if (new URLSearchParams(window.location.search).has('demo')) {
  installDemoFetchMock();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

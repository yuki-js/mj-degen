import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { QueryParamProvider } from './context/QueryParamContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryParamProvider>
      <App />
    </QueryParamProvider>
  </StrictMode>,
)

import './styles/index.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { authService } from './common/authService'
import { BrowserRouter } from 'react-router-dom'
import { refreshTokenAndSubscribe } from './common/api/refreshByInterval'

async function initApp() {
  await refreshTokenAndSubscribe()

  ReactDOM
    .createRoot(document.getElementById(`root`)!)
    .render(
      <React.StrictMode>
        <authService.AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </authService.AuthProvider>
      </React.StrictMode >,
    )
}

initApp()

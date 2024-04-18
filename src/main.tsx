import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { I18nProvider, I18nCore, DevTools } from './lib'

const i18n = I18nCore().use(DevTools()).init({ language: 'en' })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider i18n={i18n} fallback="Loading...">
      <App />
    </I18nProvider>
  </React.StrictMode>
)

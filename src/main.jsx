import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminStudio from './AdminStudio.jsx'
import './styles.css'
import './studio.css'

const isStudio = window.location.pathname.replace(/\/$/, '') === '/studio'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isStudio ? <AdminStudio /> : <App />}</React.StrictMode>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Performance monitoring
if (typeof window !== 'undefined') {
  // Optimize viewport for mobile
  const viewport = document.querySelector('meta[name="viewport"]')
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover')
  }
  
  // Preconnect to external resources
  const preconnect = document.createElement('link')
  preconnect.rel = 'preconnect'
  preconnect.href = 'https://fonts.googleapis.com'
  document.head.appendChild(preconnect)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

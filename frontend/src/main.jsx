import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#f1f5f9',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f1f5f9',
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)

// Hide splash overlay when GSAP timeline completes, with a fallback
let splashHidden = false
const hideSplash = () => {
  if (splashHidden) return
  const el = document.getElementById('app-splash')
  if (!el) return
  splashHidden = true
  el.classList.add('hide')
  el.addEventListener('transitionend', () => el.remove(), { once: true })
}

const onSplashDone = () => {
  if (splashHidden) return
  window.requestAnimationFrame(hideSplash)
}

document.addEventListener('splash:done', onSplashDone, { once: true })

// Fallback: ensure splash hides even if GSAP/CDN fails
setTimeout(() => { if (!splashHidden) hideSplash() }, 3000)

// Register service worker globally so push notifications work site-wide
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
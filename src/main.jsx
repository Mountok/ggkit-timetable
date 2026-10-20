import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SharePage from './pages/SharePage.jsx'
import FreeRoomsPage from './pages/FreeRoomsPage.jsx'
import CampusMapPage from './pages/CampusMapPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/share',
    element: <SharePage />,
  },
  {
    path: '/free-rooms',
    element: <FreeRoomsPage />,
  },
  {
    path: '/campus-map',
    element: <CampusMapPage />,
  },
])

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Не удалось зарегистрировать service worker:', error)
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

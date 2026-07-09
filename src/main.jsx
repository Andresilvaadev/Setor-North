import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ContentProvider } from './context/ContentContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

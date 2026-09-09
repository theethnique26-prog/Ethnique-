import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'   // ✅ THIS is where Tailwind loads
import { LoyaltyProvider } from "./context/LoyaltyContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AuthProvider } from "./context/AuthContext";
import {
  CartProvider,
} from "./context/CartContext";
import { WishlistProvider }
from "./context/Wishlistcontext";
import {Toaster} from "react-hot-toast";
import {
  CountryProvider
} from "./context/CoutryContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/theme.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <LoyaltyProvider>
            <CartProvider>
              <CountryProvider>
                <WishlistProvider>
                  <App />
                  <Toaster position="top-right" />
                </WishlistProvider>
              </CountryProvider>
            </CartProvider>
          </LoyaltyProvider>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
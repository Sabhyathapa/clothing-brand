import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import ProductGrid from './components/ProductGrid';
import ProductPageNew from './pages/ProductPageNew';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/Cart';
import CartCheckout from './components/CartCheckout';
import OrderConfirmation from './pages/OrderConfirmation';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import JeansPage from './pages/JeansPage';
import ShirtPage from './pages/ShirtPage';
import TShirtPage from './pages/TShirtPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <main>
              <Routes>
                <Route path="/" element={<ProductGrid />} />
                <Route path="/products" element={<ProductGrid />} />
                <Route path="/products/:id" element={<ProductPageNew />} />
                <Route path="/jeans" element={<JeansPage />} />
                <Route path="/shirts" element={<ShirtPage />} />
                <Route path="/tshirts" element={<TShirtPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CartCheckout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
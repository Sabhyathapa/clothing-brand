import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
`;

const ItemPrice = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e0e0e0;
  }
`;

const RemoveButton = styled.button`
  padding: 0.5rem;
  background: #ffebee;
  color: #c62828;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ffcdd2;
  }
`;

const CartSummary = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, error, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  if (loading) {
    return <CartContainer>Loading cart...</CartContainer>;
  }

  if (error) {
    return <CartContainer>Error: {error}</CartContainer>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CartContainer>
        <EmptyCart>
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart to see them here.</p>
          <CheckoutButton onClick={() => navigate('/')}>
            Continue Shopping
          </CheckoutButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <Title>Shopping Cart</Title>
      </CartHeader>
      <CartItems>
        {cart.items.map((item) => (
          <CartItem key={item.id}>
            <ItemImage src={item.product.images[0]} alt={item.product.name} />
            <ItemInfo>
              <ItemName>{item.product.name}</ItemName>
              <ItemPrice>${typeof item.product.price === 'number' ? item.product.price.toFixed(2) : 'N/A'}</ItemPrice>
            </ItemInfo>
            <QuantityControl>
              <QuantityButton
                onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
              >
                -
              </QuantityButton>
              <span>{item.quantity}</span>
              <QuantityButton
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              >
                +
              </QuantityButton>
              <RemoveButton onClick={() => removeFromCart(item.product_id)}>
                Remove
              </RemoveButton>
            </QuantityControl>
          </CartItem>
        ))}
      </CartItems>
      <CartSummary>
        <Total>
          <span>Total:</span>
          <span>${typeof cart.total === 'number' ? cart.total.toFixed(2) : 'N/A'}</span>
        </Total>
        <CheckoutButton onClick={() => navigate('/cart-checkout')}>
          Proceed to Checkout
        </CheckoutButton>
      </CartSummary>
    </CartContainer>
  );
};

export default Cart; 
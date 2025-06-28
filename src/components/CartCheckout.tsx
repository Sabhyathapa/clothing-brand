import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CheckoutItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
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

const OrderSummary = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #666;
`;

const Total = styled(SummaryItem)`
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin-top: 1rem;
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

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

const CartCheckout: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = 10; // Fixed shipping cost
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Here you would typically:
      // 1. Create an order in your database
      // 2. Process payment
      // 3. Clear the cart
      // 4. Navigate to order confirmation
      
      // For now, we'll just simulate a delay and navigate
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CheckoutContainer>
      <Title>Checkout</Title>
      <CheckoutGrid>
        <ItemsList>
          {cart.items.map((item) => (
            <CheckoutItem key={item.id}>
              <ItemImage src={item.product.images[0]} alt={item.product.name} />
              <ItemInfo>
                <ItemName>{item.product.name}</ItemName>
                <ItemPrice>
                  ${typeof item.product.price === 'number' ? item.product.price.toFixed(2) : 'N/A'} x {item.quantity}
                </ItemPrice>
              </ItemInfo>
            </CheckoutItem>
          ))}
        </ItemsList>
        <OrderSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          <SummaryItem>
            <span>Subtotal</span>
            <span>${typeof subtotal === 'number' ? subtotal.toFixed(2) : 'N/A'}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Shipping</span>
            <span>${typeof shipping === 'number' ? shipping.toFixed(2) : 'N/A'}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Tax</span>
            <span>${typeof tax === 'number' ? tax.toFixed(2) : 'N/A'}</span>
          </SummaryItem>
          <Total>
            <span>Total</span>
            <span>${typeof total === 'number' ? total.toFixed(2) : 'N/A'}</span>
          </Total>
          <PlaceOrderButton
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </PlaceOrderButton>
        </OrderSummary>
      </CheckoutGrid>
    </CheckoutContainer>
  );
};

export default CartCheckout; 
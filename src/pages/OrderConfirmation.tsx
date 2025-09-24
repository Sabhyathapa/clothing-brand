import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #38a169;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const OrderDetails = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const OrderNumber = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
`;

const OrderInfo = styled.p`
  color: #666;
  margin-bottom: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const PrimaryButton = styled(Button)`
  background: #000;
  color: white;

  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #000;
  border: 1px solid #ddd;

  &:hover {
    background: #f5f5f5;
  }
`;

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Generate a mock order number
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    // This would typically navigate to an orders page
    alert('Orders page coming soon!');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <ConfirmationContainer>
      <SuccessIcon>✓</SuccessIcon>
      <Title>Order Confirmed!</Title>
      <Subtitle>Thank you for your purchase. Your order has been successfully placed.</Subtitle>
      
      <OrderDetails>
        <OrderNumber>Order Number: {orderNumber}</OrderNumber>
        <OrderInfo>We've sent a confirmation email to {user.email}</OrderInfo>
        <OrderInfo>Your order will be processed and shipped within 1-2 business days</OrderInfo>
        <OrderInfo>You will receive tracking information once your order ships</OrderInfo>
      </OrderDetails>

      <ButtonGroup>
        <PrimaryButton onClick={handleContinueShopping}>
          Continue Shopping
        </PrimaryButton>
        <SecondaryButton onClick={handleViewOrders}>
          View My Orders
        </SecondaryButton>
      </ButtonGroup>
    </ConfirmationContainer>
  );
};

export default OrderConfirmation;

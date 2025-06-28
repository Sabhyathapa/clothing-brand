import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getProducts, Product } from '../lib/supabase';

const GridContainer = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const ProductCard = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0;
  text-align: center;
  letter-spacing: 0.5px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProductPrice = styled.span`
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
`;

const OldPrice = styled.span`
  font-size: 0.75rem;
  color: #999;
  text-decoration: line-through;
`;

const StockStatus = styled.span<{ status: 'in-stock' | 'limited' | 'out-of-stock' }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.status) {
      case 'in-stock':
        return '#e6f4ea';
      case 'limited':
        return '#fff3e0';
      case 'out-of-stock':
        return '#fce8e6';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'in-stock':
        return '#1e7e34';
      case 'limited':
        return '#e65100';
      case 'out-of-stock':
        return '#c62828';
      default:
        return '#666';
    }
  }};
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DiscountTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: #fce8e6;
  color: #c62828;
  border-radius: 4px;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const CartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
`;

const CartCount = styled.span`
  background: #FF4500;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <GridContainer>
      <NavBar>
        <Title>Wear Clothes That Matter</Title>
        <CartButton onClick={() => navigate('/cart')}>
          Cart
          {cart && cart.items.length > 0 && (
            <CartCount>{cart.items.length}</CartCount>
          )}
        </CartButton>
      </NavBar>
      <Grid>
        {products.map((product) => (
          <ProductWrapper key={product.id} onClick={() => handleProductClick(product.id)}>
            <ProductCard>
              <ProductImage src={product.images[0]} alt={product.name} />
            </ProductCard>
            <ProductInfo>
              <ProductTitle>{product.name}</ProductTitle>
              <PriceContainer>
                <ProductPrice>${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</ProductPrice>
                {typeof product.originalPrice === 'number' ? (
                  <OldPrice>${product.originalPrice.toFixed(2)}</OldPrice>
                ) : null}
              </PriceContainer>
              {product.discount > 0 && (
                <DiscountTag>{product.discount}% OFF</DiscountTag>
              )}
            </ProductInfo>
          </ProductWrapper>
        ))}
      </Grid>
    </GridContainer>
  );
};

export default ProductGrid; 
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Category = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: -1rem;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin: 0;
`;

const Tags = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #666;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
`;

const OldPrice = styled.span`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

const Discount = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: #f8f8f8;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #666;
`;

const OptionsTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 1rem 0 0.5rem;
`;

const VersionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const VersionImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #666;
  }
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SizeButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #666;
  }
`;

const Section = styled.div`
  border-top: 1px solid #eee;
  padding: 1rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  color: #333;
  margin: 0;
  padding: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const AddToCartButton = styled.button`
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

const ProductCheckout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await getProductById(id);
          setProduct(data);
        }
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product, 1, selectedSize);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <CheckoutContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      </CheckoutContainer>
    );
  }

  if (error || !product) {
    return (
      <CheckoutContainer>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {error || 'Product not found'}
        </div>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <ProductImage src={product.images[0]} alt={product.name} />
      <ProductInfo>
        <div>
          <Category>{product.category}</Category>
          <ProductTitle>{product.name}</ProductTitle>
          <Tags>
            <Tag>OUT-OF-STOCK</Tag>
            <Tag>{product.category.toUpperCase()}</Tag>
          </Tags>
        </div>

        <PriceContainer>
          <CurrentPrice>${product.price.toFixed(2)}</CurrentPrice>
          {product.originalPrice && (
            <OldPrice>${product.originalPrice.toFixed(2)}</OldPrice>
          )}
          {product.discount > 0 && (
            <Discount>{product.discount}% OFF</Discount>
          )}
        </PriceContainer>

        <div>
          <OptionsTitle>Choose Other Versions</OptionsTitle>
          <VersionsGrid>
            {product.images.map((image, index) => (
              <VersionImage key={index} src={image} alt={`Version ${index + 1}`} />
            ))}
          </VersionsGrid>
        </div>

        <div>
          <OptionsTitle>Choose The Size</OptionsTitle>
          <SizeGrid>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <SizeButton
                key={size}
                disabled={false}
                onClick={() => setSelectedSize(size)}
                style={selectedSize === size ? { borderColor: '#333' } : {}}
              >
                {size}
              </SizeButton>
            ))}
          </SizeGrid>
        </div>

        <Section>
          <SectionTitle>Product Description</SectionTitle>
          <p>{product.description}</p>
        </Section>

        <Section>
          <SectionTitle>Material</SectionTitle>
          <p>{product.material}</p>
        </Section>

        <Section>
          <SectionTitle>Delivery and Returns</SectionTitle>
          <p>{product.delivery}</p>
        </Section>

        <AddToCartButton
          onClick={handleAddToCart}
          disabled={isAddingToCart || !selectedSize}
        >
          {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
        </AddToCartButton>
      </ProductInfo>
    </CheckoutContainer>
  );
};

export default ProductCheckout; 
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../lib/supabase';

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem 0;
`;

const Breadcrumb = styled.div`
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const Tags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Tag = styled.span`
  padding: 0.25rem 1rem;
  border: 1px solid #000;
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  .current-price {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .original-price {
    font-size: 1rem;
    color: #666;
    text-decoration: line-through;
  }

  .discount {
    background: #f5f5f5;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }
`;

const VersionsTitle = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Versions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const VersionThumb = styled.div<{ $active?: boolean }>`
  width: 80px;
  height: 80px;
  background: #f5f5f5;
  cursor: pointer;
  border: 2px solid ${(props: { $active?: boolean }) => props.$active ? '#000' : 'transparent'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SizeTitle = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const SizeButton = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;
  border: 1px solid ${(props: { $active?: boolean }) => props.$active ? '#000' : '#ddd'};
  background: ${(props: { $active?: boolean }) => props.$active ? '#000' : '#fff'};
  color: ${(props: { $active?: boolean }) => props.$active ? '#fff' : '#000'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000;
  }
`;

const AccordionSection = styled.div`
  border-top: 1px solid #ddd;
  padding: 1rem 0;

  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const PurchaseButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #000;
  color: #fff;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #333;
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedVersion, setSelectedVersion] = React.useState<number>(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handlePurchaseNow = async () => {
    if (!user) {
      alert('Please log in to purchase items');
      navigate('/auth');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    try {
      await addToCart(product, 1, selectedSize);
      navigate('/checkout');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product to cart';
      alert(errorMessage);
    }
  };

  return (
    <ProductDetailContainer>
      <ProductImage>
        <img src={product.images[selectedVersion]} alt={product.name} />
      </ProductImage>
      
      <ProductInfo>
        <Breadcrumb>{product.category} / {product.name}</Breadcrumb>
        <ProductTitle>{product.name}</ProductTitle>
        
        <Tags>
          <Tag>OUT-OF-STOCK</Tag>
          <Tag>KIDS</Tag>
        </Tags>

        <Price>
          <span className="current-price">${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</span>
          <span className="original-price">${typeof product.original_price === 'number' ? product.original_price.toFixed(2) : 'N/A'}</span>
          <span className="discount">{product.discount}%</span>
        </Price>

        <VersionsTitle>Choose Other Versions</VersionsTitle>
        <Versions>
          {product.images.map((img, index) => (
            <VersionThumb 
              key={index} 
              $active={selectedVersion === index}
              onClick={() => setSelectedVersion(index)}
            >
              <img src={img} alt={`Version ${index + 1}`} />
            </VersionThumb>
          ))}
        </Versions>

        <SizeTitle>Choose The Size</SizeTitle>
        <SizeOptions>
          {['S', 'M', 'L', 'XL'].map(size => (
            <SizeButton
              key={size}
              $active={selectedSize === size}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </SizeButton>
          ))}
        </SizeOptions>

        <AccordionSection>
          <h3>Product Description <span>›</span></h3>
        </AccordionSection>

        <AccordionSection>
          <h3>Material <span>›</span></h3>
        </AccordionSection>

        <AccordionSection>
          <h3>Delivery and Returns <span>›</span></h3>
        </AccordionSection>

        <PurchaseButton onClick={handlePurchaseNow} disabled={!selectedSize}>
          Purchase Now
        </PurchaseButton>
      </ProductInfo>
    </ProductDetailContainer>
  );
};

export default ProductDetail; 
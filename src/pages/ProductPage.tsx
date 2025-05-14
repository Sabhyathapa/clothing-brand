import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getProductById, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  padding: 80px 20px 0;
  min-height: 100vh;
  background: #fff;
`;

const ProductContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 1;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
`;

const ProductPrice = styled.p`
  font-size: 1.5rem;
  color: #FF4500;
  font-weight: 600;
  margin-bottom: 20px;
`;

const ProductDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const DropdownSection = styled.div`
  margin-bottom: 20px;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s ease;

  &:hover {
    background: #eee;
  }
`;

const DropdownTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  background: #fff;
  border: ${props => props.isOpen ? '1px solid #eee' : 'none'};
  border-top: none;
  border-radius: 0 0 4px 4px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  padding: ${props => props.isOpen ? '15px' : '0'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
`;

const DropdownText = styled.p`
  margin: 0;
  color: #666;
  line-height: 1.6;
`;

const ArrowIcon = styled.span<{ isOpen: boolean }>`
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  transform: rotate(${props => props.isOpen ? '90deg' : '0deg'});
  display: inline-block;
`;

const SizeOptions = styled.div`
  margin-bottom: 20px;
`;

const SizeButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: ${props => props.active ? '#000' : '#f5f5f5'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 10px;

  &:hover {
    background: ${props => props.active ? '#333' : '#eee'};
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%) rotate(45deg);
    transition: height 0.6s ease;
  }

  &:hover::after {
    height: 450%;
  }
`;

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    if (id) {
      getProductById(id).then(setProduct);
    }
  }, [id]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const toggleDropdown = (section: string) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to cart');
      navigate('/auth');
      return;
    }

    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAddingToCart(true);
    try {
      console.log('Adding product to cart:', { 
        productId: product.id, 
        name: product.name, 
        size: selectedSize 
      });
      
      await addToCart(product, 1, selectedSize);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product to cart';
      alert(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Container>
      <ProductContainer>
        <ImageContainer>
          <ProductImage src={product.images[0]} alt={product.name} />
        </ImageContainer>
        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductPrice>
            ${product.price.toFixed(2)}
            {product.discount > 0 && (
              <>
                <span style={{ textDecoration: 'line-through', color: '#999', marginLeft: '10px', fontSize: '1rem' }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span style={{ color: '#4CAF50', marginLeft: '10px', fontSize: '1rem' }}>
                  {product.discount}% OFF
                </span>
              </>
            )}
          </ProductPrice>
          <ProductDescription>{product.description}</ProductDescription>

          <DropdownSection>
            <DropdownHeader onClick={() => toggleDropdown('description')}>
              <DropdownTitle>Product Description</DropdownTitle>
              <ArrowIcon isOpen={openDropdown === 'description'}>▶</ArrowIcon>
            </DropdownHeader>
            <DropdownContent isOpen={openDropdown === 'description'}>
              <DropdownText>{product.description}</DropdownText>
            </DropdownContent>
          </DropdownSection>

          <DropdownSection>
            <DropdownHeader onClick={() => toggleDropdown('material')}>
              <DropdownTitle>Material & Care</DropdownTitle>
              <ArrowIcon isOpen={openDropdown === 'material'}>▶</ArrowIcon>
            </DropdownHeader>
            <DropdownContent isOpen={openDropdown === 'material'}>
              <DropdownText>{product.material}</DropdownText>
            </DropdownContent>
          </DropdownSection>

          <DropdownSection>
            <DropdownHeader onClick={() => toggleDropdown('delivery')}>
              <DropdownTitle>Delivery & Returns</DropdownTitle>
              <ArrowIcon isOpen={openDropdown === 'delivery'}>▶</ArrowIcon>
            </DropdownHeader>
            <DropdownContent isOpen={openDropdown === 'delivery'}>
              <DropdownText>{product.delivery}</DropdownText>
            </DropdownContent>
          </DropdownSection>

          <SizeOptions>
            {['S', 'M', 'L', 'XL'].map(size => (
              <SizeButton
                key={size}
                active={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </SizeButton>
            ))}
          </SizeOptions>

          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedSize}
          >
            {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
          </AddToCartButton>
        </ProductInfo>
      </ProductContainer>
    </Container>
  );
};

export default ProductPage;
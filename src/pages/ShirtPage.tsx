import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory, Product } from '../lib/supabase';

const Container = styled.div`
  padding: 80px 20px 0;
  min-height: 100vh;
  background: #fff;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 0 20px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 0;
`;

const ProductCard = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  background: #f8f8f8;
  transition: transform 0.3s ease;
yy  aspect-ratio: 3/4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1;

  ${ProductCard}:hover & {
    transform: translateY(0);
  }
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
  text-shadow: none;
`;

const ProductPrice = styled.p`
  margin: 10px 0 0;
  font-size: 1.1rem;
  color: #FF4500;
  font-weight: 600;
  text-shadow: none;
`;

const SubscriptionSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');
  background-size: cover;
  background-position: center;
  padding: 80px 20px;
  text-align: center;
  color: white;
  margin-top: 60px;
`;

const SubscriptionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 600;
`;

const SubscriptionForm = styled.form`
  display: flex;
  gap: 10px;
  max-width: 500px;
  margin: 0 auto;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
`;

const SubscribeButton = styled.button`
  padding: 12px 30px;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const Footer = styled.footer`
  background: #000;
  color: #fff;
  padding: 60px 20px;
  margin-top: 60px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: #fff;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 10px;

      a {
        color: #ccc;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: #fff;
        }
      }
    }
  }
`;

const ShirtPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory('Shirts');
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
  };

  if (loading) {
    return (
      <Container>
        <PageHeader>
          <PageTitle>Loading...</PageTitle>
        </PageHeader>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <PageHeader>
          <PageTitle>Error</PageTitle>
          <PageDescription>{error}</PageDescription>
        </PageHeader>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>Shirts Collection</PageTitle>
        <PageDescription>Explore our premium collection of shirts, from classic Oxfords to casual flannels. Each piece is crafted with attention to detail and quality materials for lasting comfort and style.</PageDescription>
      </PageHeader>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
            <ProductImage src={product.images[0]} alt={product.name} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</ProductPrice>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>

      <SubscriptionSection>
        <SubscriptionTitle>Subscribe to Our Newsletter</SubscriptionTitle>
        <SubscriptionForm onSubmit={handleSubscribe}>
          <EmailInput type="email" placeholder="Enter your email" required />
          <SubscribeButton type="submit">Subscribe</SubscribeButton>
        </SubscriptionForm>
      </SubscriptionSection>

      <Footer>
        <FooterContent>
          <FooterSection>
            <h3>PRODUCT</h3>
            <ul>
              <li><a href="javascript:void(0)">Shirts</a></li>
              <li><a href="javascript:void(0)">T-Shirts</a></li>
              <li><a href="javascript:void(0)">Jeans</a></li>
            </ul>
          </FooterSection>
          <FooterSection>
            <h3>COMPANY</h3>
            <ul>
              <li><a href="javascript:void(0)">About Us</a></li>
              <li><a href="javascript:void(0)">Careers</a></li>
              <li><a href="javascript:void(0)">Contact</a></li>
            </ul>
          </FooterSection>
          <FooterSection>
            <h3>SUPPORT</h3>
            <ul>
              <li><a href="javascript:void(0)">FAQ</a></li>
              <li><a href="javascript:void(0)">Shipping</a></li>
              <li><a href="javascript:void(0)">Returns</a></li>
            </ul>
          </FooterSection>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default ShirtPage; 
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { getProductsByCategory, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

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
  grid-template-columns: repeat(2, 1fr);
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
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ProductInfo = styled.div`
  padding: 20px;
  text-align: center;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
`;

const ProductPrice = styled.p`
  margin: 10px 0 0;
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
`;

const SubscriptionSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');
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
  background: #f8f8f8;
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
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 10px;

      a {
        color: #666;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: #000;
        }
      }
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  a {
    color: #666;
    font-size: 1.2rem;
    transition: color 0.3s ease;

    &:hover {
      color: #000;
    }
  }
`;

const TShirtPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory('T-Shirts');
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

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
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
        <PageTitle>T-Shirts Collection</PageTitle>
        <PageDescription>Discover our curated selection of premium t-shirts, crafted with comfort and style in mind. From classic essentials to trendy designs, find the perfect tee for every occasion.</PageDescription>
      </PageHeader>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} onClick={() => handleProductClick(product.id)}>
            <ProductImage src={product.images[0]} alt={product.name} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
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
              <li><a href="#">T-Shirts</a></li>
              <li><a href="#">Jeans</a></li>
              <li><a href="#">Accessories</a></li>
            </ul>
          </FooterSection>
          <FooterSection>
            <h3>COMPANY</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </FooterSection>
          <FooterSection>
            <h3>SUPPORT</h3>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
            </ul>
          </FooterSection>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default TShirtPage; 
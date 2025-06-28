import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { getProductsByCategory, Product } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const JeansPageContainer = styled.div`
  min-height: 100vh;
  background: #fff;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 80px 20px 0;
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
  gap: 2rem;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  aspect-ratio: 3/4;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
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
  padding: 1.5rem;
  text-align: center;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);

  ${ProductCard}:hover & {
    transform: translateY(0);
  }
`;

const ProductTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ProductPrice = styled.p`
  font-size: 1.1rem;
  color: #FF4500;
  font-weight: 600;
`;

const SubscriptionSection = styled.section`
  background: url('https://assets.lummi.ai/assets/QmNSTnr2uUgoZF1HnDvJqfnUA2PMWhwDW4jEv8mmTN3nGp?auto=format&w=1500') center/cover no-repeat;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }
`;

const SubscriptionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 2rem;
`;

const SubscriptionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 200;
  margin-bottom: 2rem;
  line-height: 1.2;
  letter-spacing: 2px;
  color: #ffffff;
  font-family: 'Playfair Display', serif;
  
  span {
    display: block;
    font-size: 1.1rem;
    font-weight: 300;
    margin-top: 1.5rem;
    letter-spacing: 1px;
    color: #cccccc;
    font-family: 'Inter', sans-serif;
  }
`;

const EmailForm = styled.form`
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 2rem auto 0;
  padding: 0 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(255, 69, 0, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FF4500;
    background: #ffffff;
  }
`;

const SubscribeButton = styled.button`
  padding: 1rem 2rem;
  background: #333;
  color: white;
  border: none;
  font-size: 1rem;
  letter-spacing: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%) rotate(45deg);
    transition: height 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: #444;

    &::before {
      height: 450%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

const FooterSection = styled.footer`
  background: #000;
  color: #fff;
  padding: 4rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
`;

const FooterLinks = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.8rem;
  }

  a {
    color: #fff;
    text-decoration: none;
    font-size: 0.9rem;
    opacity: 0.8;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 3rem;

  a {
    color: #fff;
    opacity: 0.8;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const JeansPage: React.FC = () => {
  const navigate = useNavigate();
  const subscriptionRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory('Jeans');
        setProducts(data);
      } catch (err) {
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
    return <div>Loading...</div>;
  }

  return (
    <JeansPageContainer>
      <PageHeader>
        <PageTitle>Jeans Collection</PageTitle>
        <PageDescription>Explore our premium collection of jeans, featuring timeless classics and contemporary styles. From slim fit to relaxed, find the perfect pair that matches your style.</PageDescription>
      </PageHeader>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
            <ProductImage src={product.images[0]} alt={product.name} />
            <ProductInfo>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductPrice>${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</ProductPrice>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>

      <SubscriptionSection ref={subscriptionRef}>
        <SubscriptionContainer>
          <SubscriptionTitle>
            DISCOVER STYLE IS JUST A BUTTON PRESS AWAY
            <span>Join our community and get exclusive offers straight to your inbox</span>
          </SubscriptionTitle>
          <EmailForm onSubmit={handleSubscribe}>
            <EmailInput 
              type="email" 
              placeholder="Enter your email address" 
              required
            />
            <SubscribeButton type="submit">
              SUBSCRIBE
            </SubscribeButton>
          </EmailForm>
        </SubscriptionContainer>
      </SubscriptionSection>

      <FooterSection>
        <FooterContent>
          <SocialIcons>
            <a href="javascript:void(0)" aria-label="Twitter">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="javascript:void(0)" aria-label="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="javascript:void(0)" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.027-4.625 4.235 0 1.027.547 2.305 1.422 2.712.132.062.203.034.234-.094l.193-.793c.017-.071.009-.132-.049-.202-.288-.35-.521-.995-.521-1.597 0-1.544 1.169-3.038 3.161-3.038 1.72 0 2.924 1.172 2.924 2.848 0 1.894-.957 3.205-2.201 3.205-.687 0-1.201-.568-1.036-1.265.197-.833.58-1.73.58-2.331 0-.537-.288-.986-.89-.986-.986-.705 0-1.269.73-1.269 1.708 0 .623.211 1.044.211 1.044s-.694 2.934-.821 3.479c-.142.605-.086 1.454-.025 2.008-2.603-1.02-4.442-3.57-4.442-6.555 0-3.866 3.135-7 7-7s7 3.134 7 7-3.135 7-7 7z"/>
              </svg>
            </a>
            <a href="javascript:void(0)" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="javascript:void(0)" aria-label="YouTube">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </SocialIcons>
          <FooterGrid>
            <FooterLinks>
              <h3>PRODUCT</h3>
              <ul>
                <li><a href="javascript:void(0)">New Arrivals</a></li>
                <li><a href="javascript:void(0)">Best Sellers</a></li>
                <li><a href="javascript:void(0)">Sale</a></li>
              </ul>
            </FooterLinks>
            <FooterLinks>
              <h3>COMPANY</h3>
              <ul>
                <li><a href="javascript:void(0)">About Us</a></li>
                <li><a href="javascript:void(0)">Contact</a></li>
                <li><a href="javascript:void(0)">Careers</a></li>
              </ul>
            </FooterLinks>
            <FooterLinks>
              <h3>SUPPORT</h3>
              <ul>
                <li><a href="javascript:void(0)">FAQ</a></li>
                <li><a href="javascript:void(0)">Shipping</a></li>
                <li><a href="javascript:void(0)">Returns</a></li>
              </ul>
            </FooterLinks>
          </FooterGrid>
        </FooterContent>
      </FooterSection>
    </JeansPageContainer>
  );
};

export default JeansPage; 
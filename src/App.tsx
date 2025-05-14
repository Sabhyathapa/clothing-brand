import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { getProductById, Product } from './lib/supabase';
import ProductDetail from './pages/ProductDetail';
import ProductGrid from './components/ProductGrid';
import ProductCheckout from './components/ProductCheckout';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import JeansPage from './pages/JeansPage';
import TShirtPage from './pages/TShirtPage';
import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import { CartProvider, useCart } from './contexts/CartContext';
import Cart from './components/Cart';
import CartCheckout from './components/CartCheckout';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

gsap.registerPlugin(ScrollTrigger);

const AppContainer = styled.div`
  background: #ffffff;
  color: #000000;
  min-height: 100vh;
  overflow-x: hidden;
`;

const Hero = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
  padding: 0 2rem;
  animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  transform-origin: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 100%);
    z-index: 1;
    animation: gradientMove 8s ease-in-out infinite;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavItems = styled.div`
  display: flex;
  gap: 2rem;
    align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ShopDropdown = styled.div`
  position: relative;
  cursor: pointer;

  .dropdown-content {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover .dropdown-content {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  min-width: 200px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-top: 0.5rem;

  div {
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 4px;
    color: #333;

    &:hover {
      background: #f5f5f5;
      transform: translateX(5px);
      color: #000;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: block;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    padding: 6rem 2rem;
    z-index: 1000;
    align-items: center;
  justify-content: center;

    > div, > button {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      font-size: 1.8rem;
      font-weight: 200;
      letter-spacing: 0.2em;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      color: #000;
  position: relative;
      padding: 1rem 0;
      margin: 0.5rem 0;
      text-transform: uppercase;
      background: none;
      border: none;
      width: auto;

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 1px;
        bottom: 0;
        left: 50%;
        background-color: #000;
        transition: all 0.3s ease;
      }

      &:hover {
        opacity: 0.7;
        &::after {
          width: 100%;
          left: 0;
        }
      }
    }
  }
`;

const Number = styled.div`
  font-size: clamp(2.5rem, 5vw, 8rem);
  color: #FF4500;
  font-weight: 300;
`;

const DiscoverText = styled.div`
  margin: clamp(0.5rem, 1vw, 1rem) 0;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  
  p {
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
    font-weight: 500;
  }
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 10vw, 8rem);
  line-height: 1;
  margin: clamp(1rem, 2vw, 2rem) 0;
  font-weight: 900;
  text-align: left;
  
  span {
    display: inline-block;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
  text-align: left;
  padding-left: 2rem;

  > * {
    opacity: 0;
    transform: translateY(30px);
    animation: slideUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${Number} {
    animation-delay: 0.3s;
  }

  ${DiscoverText} {
    animation-delay: 0.6s;
  }

  ${Title} {
    animation-delay: 0.9s;
  }
`;

const SignUpButton = styled.button`
  padding: 0.5rem 1rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const LogoutButton = styled(SignUpButton)``;

const CartIcon = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    fill: currentColor;
    transition: color 0.2s;
  }
  
  &:hover svg {
    color: #FF4500;
  }
`;

const CartCount = styled.span`
    position: absolute;
  top: -8px;
  right: -8px;
  background: #FF4500;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const Navigation = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <NavContainer>
        <div onClick={() => navigate('/')}>HOME</div>
        <NavItems>
          <ShopDropdown>
            <div>SHOP</div>
            <DropdownContent className="dropdown-content">
              <div onClick={() => navigate('/category/jeans')}>JEANS</div>
              <div onClick={() => navigate('/category/t-shirts')}>T-SHIRTS</div>
              <div onClick={() => navigate('/category/shirts')}>SHIRTS</div>
            </DropdownContent>
          </ShopDropdown>
          <div onClick={() => navigate('/about')}>ABOUT</div>
          <div onClick={() => navigate('/contact')}>CONTACT</div>
          <CartIcon onClick={() => navigate('/cart')}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {cart && cart.items.length > 0 && <CartCount>{cart.items.length}</CartCount>}
          </CartIcon>
          {user ? (
            <LogoutButton onClick={handleLogout}>
              LOGOUT
            </LogoutButton>
          ) : (
            <SignUpButton onClick={() => navigate('/auth')}>
              SIGN UP
            </SignUpButton>
          )}
        </NavItems>
      </NavContainer>

      <HamburgerMenu 
        className={isMenuOpen ? 'open' : ''} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </HamburgerMenu>

      <MenuOverlay isOpen={isMenuOpen}>
        <MenuContent isOpen={isMenuOpen}>
          <div onClick={() => { navigate('/'); setIsMenuOpen(false); }}>HOME</div>
          <div onClick={() => { navigate('/category/jeans'); setIsMenuOpen(false); }}>JEANS</div>
          <div onClick={() => { navigate('/category/t-shirts'); setIsMenuOpen(false); }}>T-SHIRTS</div>
          <div onClick={() => { navigate('/category/shirts'); setIsMenuOpen(false); }}>SHIRTS</div>
          <div onClick={() => { navigate('/about'); setIsMenuOpen(false); }}>ABOUT</div>
          <div onClick={() => { navigate('/contact'); setIsMenuOpen(false); }}>CONTACT</div>
          <div onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}>CART</div>
          {user ? (
            <div onClick={() => { handleLogout(); setIsMenuOpen(false); }}>LOGOUT</div>
          ) : (
            <div onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}>SIGN UP</div>
          )}
        </MenuContent>
      </MenuOverlay>
    </>
  );
};

const SubscriptionSection = styled.section`
  background: url('https://assets.lummi.ai/assets/QmNSTnr2uUgoZF1HnDvJqfnUA2PMWhwDW4jEv8mmTN3nGp?auto=format&w=1500') center/cover no-repeat;
  padding: clamp(4rem, 6vw, 6rem) clamp(2rem, 5vw, 4rem);
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
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
  padding: 2rem;
`;

const SubscriptionTitle = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 200;
  margin-bottom: 2rem;
  line-height: 1.2;
  letter-spacing: 2px;
  color: #ffffff;
  font-family: 'Playfair Display', serif;
  
  span {
    display: block;
    font-size: clamp(1.1rem, 2vw, 1.5rem);
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

const FooterSection = styled.section`
  padding: 4rem 2rem;
  background: #ffffff;
  border-top: 1px solid #eaeaea;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 200px;

  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  a {
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 0.9rem;

    &:hover {
      color: #FF4500;
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;

  a {
    color: #000;
    transition: opacity 0.2s ease;

    svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    &:hover {
      opacity: 0.7;
    }
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  margin: 4rem 0;
  text-align: left;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 4rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }

  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
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
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s ease;

    &:hover {
      color: #000;
    }
  }
`;

const HamburgerMenu = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 30px;
  height: 20px;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 1000;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }
  
  span {
    width: 100%;
    height: 2px;
    background: #000;
    transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    transform-origin: center;
    border-radius: 2px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: #FF4500;
      border-radius: 2px;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    }
  }
  
  &:hover span::before {
    transform: scaleX(1);
    transform-origin: left;
  }
  
  &.open {
    background: #000;
    
    span {
      background: #fff;
      
      &::before {
        background: #fff;
      }
    }
    
    span:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }
    
    span:nth-child(2) {
      opacity: 0;
      transform: scale(0);
    }
    
    span:nth-child(3) {
      transform: translateY(-9px) rotate(-45deg);
    }
  }
`;

const MenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: ${({ isOpen }) => isOpen ? 'blur(10px)' : 'none'};
`;

const MenuContent = styled.div<{ isOpen: boolean }>`
  text-align: center;
  transform: translateY(${props => props.isOpen ? '0' : '20px'});
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
  position: relative;
  z-index: 1001;
  
  a {
    display: block;
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin: 1.5rem 0;
    color: #000;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    font-weight: 300;
    letter-spacing: 2px;
    text-transform: uppercase;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      width: 0;
      height: 2px;
      background: #FF4500;
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }
    
    &:hover {
      color: #FF4500;
      transform: translateX(10px);
      
      &::after {
        width: 100%;
      }
    }
  }
`;

const ImageSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageCard = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  background: #f5f5f5;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #FF4500;
    opacity: 0;
    z-index: 1;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 0.1;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const NavItem = styled.div`
  position: relative;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    color: #e0e0e0;
  }
`;

const NavLink = styled.a`
  color: inherit;
  text-decoration: none;
  display: block;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
`;

const MenuIcon = styled.div<{ isOpen: boolean }>`
  width: 20px;
  height: 2px;
  background: #000;
  position: relative;
  transition: all 0.3s ease;

  &::before, &::after {
    content: '';
    width: 100%;
    height: 100%;
    background: #000;
    position: absolute;
    transition: all 0.3s ease;
  }

  &::before {
    top: ${props => props.isOpen ? '8px' : '0'};
    transform: ${props => props.isOpen ? 'rotate(45deg)' : 'none'};
  }

  &::after {
    top: ${props => props.isOpen ? '8px' : '0'};
    transform: ${props => props.isOpen ? 'rotate(-45deg)' : 'none'};
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 2rem;

  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
`;

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <AppContainer>
      <HamburgerMenu 
        className={isMenuOpen ? 'open' : ''} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </HamburgerMenu>
      
      <MenuOverlay isOpen={isMenuOpen}>
        <MenuContent isOpen={isMenuOpen}>
          <Navigation />
        </MenuContent>
      </MenuOverlay>

      <Outlet />
    </AppContainer>
  );
};

const HomePage = () => {
  const heroRef = useRef(null);
  const imageSectionRef = useRef(null);
  const productGridRef = useRef(null);
  const subscriptionRef = useRef(null);
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
  };

  return (
    <>
      <Hero ref={heroRef}>
        <Navigation />
        <MainContent>
          <Number>02</Number>
          <DiscoverText>
            <span>DISCOVER //</span>
            <p>THE FUTURE</p>
            <p>OF STREETWEAR.</p>
          </DiscoverText>
          <Title>
            <span>BREAK</span><br />
            <span>THE</span> <span>MOLD.</span>
          </Title>
        </MainContent>
      </Hero>

      <ImageSection ref={imageSectionRef}>
        <ImageCard>
          <img 
            src="https://www.lummi.ai/api/pro/image/ca0fbd67-8cfb-461b-aa35-47305d283cc4?asset=original&cb=AvRmPp&auto=format&w=1500" 
            alt="Fashion Image 1"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </ImageCard>
        <ImageCard>
          <img 
            src="https://assets.lummi.ai/assets/QmSSrAYPY9Gh79vuHRUPx7SKcBcwXQCB98MjM8Nwc8EAkG?auto=format&w=1500" 
            alt="Fashion Image 2"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </ImageCard>
      </ImageSection>

      <div ref={productGridRef}>
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          margin: '4rem 0',
          fontWeight: '300',
          letterSpacing: '2px'
        }}>
          TRENDING NOW
        </h2>
        <ProductGrid />
      </div>

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
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.027-4.625 4.235 0 1.027.547 2.305 1.422 2.712.132.062.203.034.234-.094l.193-.793c.017-.071.009-.132-.049-.202-.288-.35-.521-.995-.521-1.597 0-1.544 1.169-3.038 3.161-3.038 1.72 0 2.924 1.172 2.924 2.848 0 1.894-.957 3.205-2.201 3.205-.687 0-1.201-.568-1.036-1.265.197-.833.58-1.73.58-2.331 0-.537-.288-.986-.89-.986-.986-.705 0-1.269.73-1.269 1.708 0 .623.211 1.044.211 1.044s-.694 2.934-.821 3.479c-.142.605-.086 1.454-.025 2.008-2.603-1.02-4.442-3.57-4.442-6.555 0-3.866 3.135-7 7-7s7 3.134 7 7-3.135 7-7 7z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </SocialIcons>
          <FooterGrid>
            <FooterLinks>
              <h3>PRODUCT</h3>
              <ul>
                <li><a href="#">New Arrivals</a></li>
                <li><a href="#">Best Sellers</a></li>
                <li><a href="#">Sale</a></li>
              </ul>
            </FooterLinks>
            <FooterLinks>
              <h3>COMPANY</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </FooterLinks>
            <FooterLinks>
              <h3>SUPPORT</h3>
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Shipping</a></li>
                <li><a href="#">Returns</a></li>
              </ul>
            </FooterLinks>
          </FooterGrid>
        </FooterContent>
      </FooterSection>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
      <Routes>
            <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/product/:id" element={<ProductCheckout />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/cart-checkout" element={<CartCheckout />} />
              <Route path="/category/jeans" element={<JeansPage />} />
              <Route path="/category/t-shirt" element={<TShirtPage />} />
              <Route path="/checkout" element={<ProductCheckout />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
      </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 

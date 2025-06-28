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
import ShirtPage from './pages/ShirtPage';
import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import { CartProvider, useCart } from './contexts/CartContext';
import Cart from './components/Cart';
import CartCheckout from './components/CartCheckout';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ErrorBoundary from './components/ErrorBoundary';

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
  background: #1a1a1a;
  padding: 0 2rem;
  transform-origin: center;

  &::before {
    content: '';
    position: absolute;
    width: 150vmax;
    height: 150vmax;
    background: radial-gradient(
      circle at center,
      #ffb3b3 0%,
      #ffc4a3 25%,
      #ffd699 50%,
      #ffe699 75%,
      #fff2cc 100%
    );
    opacity: 0.8;
    filter: blur(80px);
    animation: sphereMove 20s ease-in-out infinite;
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @keyframes sphereMove {
    0% {
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
    }
    33% {
      transform: translate(-30%, -40%) scale(1.1) rotate(120deg);
    }
    66% {
      transform: translate(-60%, -30%) scale(0.9) rotate(240deg);
    }
    100% {
      transform: translate(-50%, -50%) scale(1) rotate(360deg);
    }
  }

  
  &:hover::before {
    animation-play-state: paused;
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

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
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
    transform: translateY(60px) scale(0.97);
    animation: heroStaggerFade 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  > *:nth-child(1) { animation-delay: 0.6s; }
  > *:nth-child(2) { animation-delay: 1.0s; }
  > *:nth-child(3) { animation-delay: 1.4s; }
  > *:nth-child(4) { animation-delay: 1.8s; }

  @keyframes heroStaggerFade {
    0% {
      opacity: 0;
      transform: translateY(60px) scale(0.97);
      filter: blur(8px);
    }
    60% {
      opacity: 1;
      transform: translateY(-8px) scale(1.01);
      filter: blur(0px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0px);
    }
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
        $isOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="hamburger-bar bar1"></div>
        <div className="hamburger-bar bar2"></div>
        <div className="hamburger-bar bar3"></div>
      </HamburgerMenu>

      <MenuOverlay $isOpen={isMenuOpen}>
        <MenuContent $isOpen={isMenuOpen}>
          <div onClick={() => { navigate('/'); setIsMenuOpen(false); }}>HOME</div>
          <ShopDropdown>
            <div>SHOP</div>
            <DropdownContent className="dropdown-content" style={{position: 'static', boxShadow: 'none', background: 'none', minWidth: 'unset', padding: 0, marginTop: 0}}>
              <div onClick={() => { navigate('/category/jeans'); setIsMenuOpen(false); }}>JEANS</div>
              <div onClick={() => { navigate('/category/t-shirts'); setIsMenuOpen(false); }}>T-SHIRTS</div>
              <div onClick={() => { navigate('/category/shirts'); setIsMenuOpen(false); }}>SHIRTS</div>
            </DropdownContent>
          </ShopDropdown>
          <div onClick={() => { navigate('/about'); setIsMenuOpen(false); }}>ABOUT</div>
          <div onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}>CART</div>
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

const HamburgerMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;

  @media (max-width: 768px) {
    display: flex;
  }

  .hamburger-bar {
    position: absolute;
    left: 8px;
    width: 24px;
    height: 1.5px;
    background: #222;
    border-radius: 1.5px;
    transition: all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  }
  .bar1 {
    top: 12px;
    transform: ${({ $isOpen }) => $isOpen ? 'translateY(7px) rotate(45deg)' : 'none'};
  }
  .bar2 {
    top: 19px;
    opacity: ${({ $isOpen }) => $isOpen ? 0 : 1};
    transform: ${({ $isOpen }) => $isOpen ? 'scaleX(0.5)' : 'none'};
  }
  .bar3 {
    top: 26px;
    transform: ${({ $isOpen }) => $isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'};
  }
`;

const MenuOverlay = styled.div<{ $isOpen: boolean }>`
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
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: ${props => props.$isOpen ? 'blur(10px)' : 'none'};
`;

const MenuContent = styled.div<{ $isOpen: boolean }>`
  text-align: center;
  transform: translateY(${props => props.$isOpen ? '0' : '20px'});
  opacity: ${props => props.$isOpen ? 1 : 0};
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

const MenuIcon = styled.div<{ $isOpen: boolean }>`
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
    top: ${props => props.$isOpen ? '8px' : '0'};
    transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'none'};
  }

  &::after {
    top: ${props => props.$isOpen ? '8px' : '0'};
    transform: ${props => props.$isOpen ? 'rotate(-45deg)' : 'none'};
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
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <AppContainer>
      <Navigation />
      <HamburgerMenu 
        $isOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="hamburger-bar bar1"></div>
        <div className="hamburger-bar bar2"></div>
        <div className="hamburger-bar bar3"></div>
      </HamburgerMenu>
      
      <MenuOverlay $isOpen={isMenuOpen}>
        <MenuContent $isOpen={isMenuOpen}>
          <div onClick={() => { navigate('/'); setIsMenuOpen(false); }}>HOME</div>
          <div onClick={() => { navigate('/category/jeans'); setIsMenuOpen(false); }}>JEANS</div>
          <div onClick={() => { navigate('/category/t-shirts'); setIsMenuOpen(false); }}>T-SHIRTS</div>
          <div onClick={() => { navigate('/category/shirts'); setIsMenuOpen(false); }}>SHIRTS</div>
          <div onClick={() => { navigate('/about'); setIsMenuOpen(false); }}>ABOUT</div>
          <div onClick={() => { navigate('/contact'); setIsMenuOpen(false); }}>CONTACT</div>
          <div onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}>CART</div>
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
            <a href="javascript:void(0)" aria-label="Twitter">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" />
              </svg>
            </a>
            <a href="javascript:void(0)" aria-label="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.36 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.36-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.36-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.054-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.36 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.74 0 8.332.014 7.052.072 2.694.272.272 2.694.072 7.052.014 8.332 0 8.74 0 12c0 3.26.014 3.668.072 4.948.2 4.358 2.622 6.78 6.98 6.98C8.332 23.986 8.74 24 12 24c3.26 0 3.668-.014 4.948-.072 4.358-.2 6.78-2.622 6.98-6.98.058-1.28.072-1.688.072-4.948 0-3.26-.014-3.668-.072-4.948-.2-4.358-2.622-6.78-6.98-6.98C15.668.014 15.26 0 12 0z" />
              </svg>
            </a>
            <a href="javascript:void(0)" aria-label="Pinterest">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.387 7.627 11.093-.105-.944-.2-2.395.042-3.428.219-.97 1.41-6.18 1.41-6.18s-.36-.72-.36-1.78c0-1.67.97-2.92 2.18-2.92 1.03 0 1.53.77 1.53 1.7 0 1.04-.66 2.6-1 4.05-.29 1.23.62 2.23 1.84 2.23 2.21 0 3.91-2.33 3.91-5.7 0-2.98-2.14-5.07-5.2-5.07-3.54 0-5.62 2.65-5.62 5.39 0 1.07.41 2.22.92 2.84.1.12.11.23.08.35-.09.38-.29 1.23-.33 1.4-.05.21-.17.25-.39.15-1.45-.59-2.36-2.44-2.36-3.93 0-3.2 2.61-6.89 7.78-6.89 4.16 0 6.89 3.01 6.89 6.25 0 4.27-2.37 7.45-5.89 7.45-1.18 0-2.29-.64-2.67-1.36l-.73 2.78c-.21.8-.62 1.8-.92 2.41C9.7 23.82 10.84 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </a>
            <a href="javascript:void(0)" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
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
    </>
  );
};

const ProductDetailWrapper = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await getProductById(id);
        setProduct(data);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;
  return <ProductDetail product={product} />;
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContainer>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="category/jeans" element={<JeansPage />} />
                  <Route path="category/t-shirts" element={<TShirtPage />} />
                  <Route path="category/shirts" element={<ShirtPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="auth" element={<AuthPage />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<CartCheckout />} />
                  <Route path="product/:id" element={<ProductDetailWrapper />} />
                </Route>
              </Routes>
            </AppContainer>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; 

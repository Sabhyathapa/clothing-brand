import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { getProducts, Product } from '../lib/supabase';

// Ensure homepage titles match the visible photo by inferring from image URL
const buildNameOverrides = (products: Product[]): Record<string, string> => {
  const overrides: Record<string, string> = {};

  // Exact image URLs provided by you
  const TSHIRT_URL = 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTahCboOUCXdJ1KhebtxZYAFmRXyaGwZEqZab0rXJnRRqF5lFFcAjLFInYEtet_JlcQMJX_8CtBzjojRGbIpGaMnKpxhVfNlux-vUYwYgdVuk0vTZ-xsSRXjeM9';
  const JEANS_URL  = 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR5E47qNGf3blLIdzwSSk_cus4HXgJEN4o9TuUoAD20chHjU0ueru-3ZvbAEuwB7jli7iYWIy2wr9WlZHTxEA1ag_Dt0440sMZE1PP9veMSKNbvfveAOAbCFw';

  products.forEach((p) => {
    const img0 = (Array.isArray(p.images) && p.images[0]) ? String(p.images[0]) : '';
    const category = String((p as any).category || '').toLowerCase();
    const lowerName = String(p.name || '').toLowerCase();

    // 1) Deterministic override by exact image URL
    if (img0 === JEANS_URL && lowerName.indexOf('jean') === -1) {
      overrides[p.id] = 'Slim Fit Jeans';
      return;
    }
    if (img0 === TSHIRT_URL && (lowerName.indexOf('t-shirt') === -1 && lowerName.indexOf('tee') === -1)) {
      overrides[p.id] = 'Classic White T-Shirt';
      return;
    }

    // 2) Fallback by category if clearly mismatched
    if (category === 'jeans' && lowerName.indexOf('jean') === -1) {
      overrides[p.id] = 'Slim Fit Jeans';
      return;
    }
    if (category === 't-shirts' && lowerName.indexOf('t-shirt') === -1 && lowerName.indexOf('tee') === -1) {
      overrides[p.id] = 'Classic White T-Shirt';
      return;
    }
  });

  return overrides;
};

const GridContainer = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
`;

// Top navigation with responsive hamburger
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid rgba(0,0,0,0.06);
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
`;

const Brand = styled.div`
  font-weight: 800;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
  cursor: pointer;
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const ShopGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 120%;
  left: 0;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  border-radius: 10px;
  padding: 10px;
  min-width: 180px;
  display: none;
  flex-direction: column;
  z-index: 100;

  ${ShopGroup}:hover & {
    display: flex;
  }
`;

const DropdownItem = styled.button`
  background: transparent;
  border: none;
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #111;
  font-size: 0.95rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const NavItem = styled.button`
  background: transparent;
  border: none;
  color: #111;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.4rem 0.2rem;
  position: relative;
  transition: color 0.2s ease;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    height: 1px;
    width: 0%;
    background: currentColor;
    transition: width 0.25s ease;
  }

  &:hover { color: #000; }
  &:hover:after { width: 100%; }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AuthButton = styled.button`
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #000;
  background: #000;
  color: #fff;
  cursor: pointer;
  font-size: 0.92rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.25);
  }
`;

const HamburgerButton = styled.button`
  width: 40px;
  height: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.08);
  background: #fff;
  cursor: pointer;

  @media (max-width: 900px) {
    display: inline-flex;
  }
`;

const MobileMenu = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: #ffffff;
  box-shadow: -8px 0 24px rgba(0,0,0,0.12);
  transform: translateX(${(p: { $open: boolean }) => (p.$open ? '0%' : '100%')});
  transition: transform 0.28s ease;
  z-index: 70;
  padding: 0;
  display: flex;
  flex-direction: column;

  @media (min-width: 901px) {
    display: none;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  background: #fafafa;
`;

const MobileMenuContent = styled.div`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const MobileNavItem = styled.button`
  text-align: left;
  background: transparent;
  border: none;
  color: #111;
  font-size: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const MobileShopGroup = styled.div`
  position: relative;
`;

const MobileShopDropdown = styled.div<{ $open: boolean }>`
  max-height: ${(p: { $open: boolean }) => (p.$open ? '200px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: #f8f8f8;
`;

const MobileDropdownItem = styled.button`
  text-align: left;
  background: transparent;
  border: none;
  color: #666;
  font-size: 0.9rem;
  padding: 0.75rem 2.5rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #e8e8e8;
    color: #333;
  }
`;

const MobileCloseButton = styled.button`
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: rgba(0,0,0,0.08);
  margin: 0.5rem 0;
`;

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  opacity: ${(p: { $open: boolean }) => (p.$open ? 1 : 0)};
  pointer-events: ${(p: { $open: boolean }) => (p.$open ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
  z-index: 60;
`;

// Hero section with background image
const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 1.25rem;
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 3rem 1.25rem;
  min-height: 760px;
  border-radius: 1.2rem;
  background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)),
              url('/hero-bg.png');
  background-size: cover; /* ensure large coverage */
  background-position: 70% center; /* bring face further into view */
  background-repeat: no-repeat;
  color: #ffffff;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 2.25rem 1rem;
    min-height: 600px;
    background-position: 50% center; /* better face visibility on phones */
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.4rem;
  line-height: 1.1;
  letter-spacing: 0.5px;
  color: #ffffff;
  font-weight: 800;

  @media (max-width: 900px) {
    font-size: 2.6rem;
    line-height: 1.15;
  }

  @media (max-width: 600px) {
    font-size: 2.2rem;
    line-height: 1.2;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.05rem;
  color: #e8e8e8;
  max-width: 560px;

  @media (max-width: 900px) {
    font-size: 0.98rem;
  }

  @media (max-width: 600px) {
    font-size: 0.92rem;
  }
`;

const HeroCTA = styled.button`
  width: fit-content;
  padding: 0.9rem 1.4rem;
  border-radius: 6px;
  border: none;
  background: #000;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    background: #222;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
`;

// Removed separate hero images; background image is applied to the section

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #333;
  font-weight: 400;
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

const ProductCardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;

  ${ProductCard}:hover & {
    opacity: 1;
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

const StockStatus = styled.span<{ $status: 'in-stock' | 'limited' | 'out-of-stock' }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${(props: { $status: 'in-stock' | 'limited' | 'out-of-stock' }) => {
    switch (props.$status) {
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
  color: ${(props: { $status: 'in-stock' | 'limited' | 'out-of-stock' }) => {
    switch (props.$status) {
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
  background:rgb(0, 0, 0);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
`;

// Subscription section (restored)
const SubscriptionSection = styled.section`
  background: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)),
              url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3');
  background-size: cover;
  background-position: center;
  padding: 96px 20px;
  text-align: center;
  color: white;
  margin: 60px auto 0;
  font-family: 'Playfair Display', serif;
  max-width: 1400px;
  border-radius: 12px;
  overflow: hidden; /* ensure children don't visually overflow rounded corners */
`;

const SubscriptionTitle = styled.h2`
  font-size: 2.6rem;
  margin-bottom: 16px;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

const SubscriptionForm = styled.form`
  display: flex;
  gap: 10px;
  max-width: 560px;
  margin: 0.75rem auto 0;
  flex-wrap: wrap; /* allow wrapping on small screens */

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  min-width: 0; /* prevent flex overflow */
`;

const SubscribeButton = styled.button`
  padding: 12px 30px;
  background: #ffffff;
  color: #000;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0,0,0,0.25);
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// Footer (restored)
const Footer = styled.footer`
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  background: #0b0b0b;
  color: #eaeaea;
  padding: 72px 20px;
  margin-top: 60px;
  border-top: 1px solid #181818;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  font-family: 'Playfair Display', serif;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  justify-items: center;
  text-align: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    margin-bottom: 14px;
    color: #ffffff;
    letter-spacing: 1px;
    font-weight: 300;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.95rem;
    letter-spacing: 0.4px;
    transition: color 0.2s ease, opacity 0.2s ease, background-size 0.25s ease;
    background-image: linear-gradient(currentColor, currentColor);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 0% 1px;

    &:hover {
      color: #ffffff;
      opacity: 1;
      background-size: 100% 1px;
    }
  }
`;

const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileShopOpen, setMobileShopOpen] = React.useState(false);
  const nameOverrides = React.useMemo(() => buildNameOverrides(products), [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from Supabase...');
        const data = await getProducts();
        console.log('Products fetched:', data);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };


  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.stopPropagation(); // Prevent navigation to product detail
    
    if (!user) {
      alert('Please log in to add items to cart');
      navigate('/auth');
      return;
    }

    setAddingToCart(product.id);
    try {
      await addToCart(product, 1, 'M'); // Default size M
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product to cart';
      alert(errorMessage);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header>
        <HeaderInner>
          <Brand onClick={() => navigate('/')}>Bloom</Brand>
          <DesktopNav>
            <NavItem onClick={() => navigate('/')}>Home</NavItem>
            <ShopGroup>
              <NavItem onClick={() => navigate('/products')}>Shop</NavItem>
              <Dropdown>
                <DropdownItem onClick={() => navigate('/jeans')}>Jeans</DropdownItem>
                <DropdownItem onClick={() => navigate('/tshirts')}>T‑Shirts</DropdownItem>
                <DropdownItem onClick={() => navigate('/shirts')}>Shirts</DropdownItem>
              </Dropdown>
            </ShopGroup>
            <NavItem onClick={() => navigate('/about')}>About</NavItem>
            <NavItem onClick={() => navigate('/contact')}>Contact</NavItem>
          </DesktopNav>
          <HeaderActions>
             <AuthButton onClick={() => navigate('/auth')}>
               Sign In
             </AuthButton>
            <HamburgerButton aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </HamburgerButton>
          </HeaderActions>
        </HeaderInner>
      </Header>
      <Backdrop $open={mobileOpen} onClick={() => setMobileOpen(false)} />
      <MobileMenu $open={mobileOpen}>
        <MobileMenuHeader>
          <Brand onClick={() => { setMobileOpen(false); navigate('/'); }}>Bloom</Brand>
          <MobileCloseButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            ×
          </MobileCloseButton>
        </MobileMenuHeader>
        
        <MobileMenuContent>
          <MobileNavItem onClick={() => { setMobileOpen(false); navigate('/'); }}>
            Home
          </MobileNavItem>
          
          <MobileShopGroup>
            <MobileNavItem onClick={() => setMobileShopOpen(!mobileShopOpen)}>
              Shop
              <span style={{ transform: mobileShopOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                ▶
              </span>
            </MobileNavItem>
            <MobileShopDropdown $open={mobileShopOpen}>
              <MobileDropdownItem onClick={() => { setMobileOpen(false); navigate('/jeans'); }}>
                Jeans
              </MobileDropdownItem>
              <MobileDropdownItem onClick={() => { setMobileOpen(false); navigate('/tshirts'); }}>
                T-Shirts
              </MobileDropdownItem>
              <MobileDropdownItem onClick={() => { setMobileOpen(false); navigate('/shirts'); }}>
                Shirts
              </MobileDropdownItem>
            </MobileShopDropdown>
          </MobileShopGroup>
          
          <MobileDivider />
          
          <MobileNavItem onClick={() => { setMobileOpen(false); navigate('/about'); }}>
            About
          </MobileNavItem>
          <MobileNavItem onClick={() => { setMobileOpen(false); navigate('/contact'); }}>
            Contact
          </MobileNavItem>
        </MobileMenuContent>
      </MobileMenu>
      <GridContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Timeless Style. Everyday Comfort.</HeroTitle>
          <HeroSubtitle>
            Discover premium essentials crafted with attention to detail. Elevate your wardrobe with pieces made to last.
          </HeroSubtitle>
          
        </HeroContent>
      </HeroSection>

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
          <ProductWrapper key={product.id}>
             <ProductCard onClick={() => handleProductClick(product.id)}>
               <ProductImage src={product.images[0]} alt={product.name} />
              <ProductCardOverlay>
                <AddToCartButton 
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleAddToCart(e, product)}
                  disabled={addingToCart === product.id}
                >
                  {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                </AddToCartButton>
              </ProductCardOverlay>
            </ProductCard>
            <ProductInfo>
              <ProductTitle>{nameOverrides[product.id] ?? product.name}</ProductTitle>
              <PriceContainer>
                <ProductPrice>${typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}</ProductPrice>
                {typeof product.original_price === 'number' ? (
                  <OldPrice>${product.original_price.toFixed(2)}</OldPrice>
                ) : null}
              </PriceContainer>
              {product.discount > 0 && (
                <DiscountTag>{product.discount}% OFF</DiscountTag>
              )}
            </ProductInfo>
          </ProductWrapper>
        ))}
      </Grid>

      <SubscriptionSection>
        <SubscriptionTitle>Join Our Journal</SubscriptionTitle>
        <p style={{maxWidth: 680, margin: '0 auto', opacity: 0.9, fontWeight: 300, letterSpacing: 0.3}}>
          Be the first to know about limited drops, early access, and stories from our atelier.
          We write only when we have something worth your time.
        </p>
        <SubscriptionForm onSubmit={(e: React.FormEvent) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
          <EmailInput type="email" placeholder="Your email address" required />
          <SubscribeButton type="submit">Subscribe</SubscribeButton>
        </SubscriptionForm>
      </SubscriptionSection>

      <Footer>
        <FooterContent>
          <FooterSection>
            <h3>PRODUCT</h3>
            <ul>
              <li><a href="javascript:void(0)">New Arrivals</a></li>
              <li><a href="javascript:void(0)">Best Sellers</a></li>
              <li><a href="javascript:void(0)">Sale</a></li>
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
    </GridContainer>
    </>
  );
};

export default ProductGrid; 




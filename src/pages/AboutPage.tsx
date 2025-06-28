import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #000000;
`;

const AboutHero = styled.section`
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://assets.lummi.ai/assets/QmNSTnr2uUgoZF1HnDvJqfnUA2PMWhwDW4jEv8mmTN3nGp?auto=format&w=1500') center/cover no-repeat;
  color: white;
  padding: 0 2rem;
`;

const AboutTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 300;
  font-family: 'Playfair Display', serif;
  letter-spacing: 1px;
`;

const AboutSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Playfair Display', serif;
  font-weight: 300;
`;

const ContentSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ContentCard = styled.div`
  padding: 2rem;
  background: #f8f8f8;
  border-radius: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #000000;
    font-family: 'Playfair Display', serif;
    font-weight: 300;
  }

  p {
    color: #666;
    line-height: 1.6;
    font-family: 'Inter', Arial, sans-serif;
    font-weight: 300;
  }
`;

const FooterSection = styled.footer`
  background: #000000;
  color: white;
  padding: 4rem 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterColumn = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: white;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.8rem;

      a {
        color: #999;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: white;
        }
      }
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <AboutContainer>
      <AboutHero>
        <AboutTitle>About Us</AboutTitle>
        <AboutSubtitle>
          Discover our story and commitment to quality fashion
        </AboutSubtitle>
      </AboutHero>

      <ContentSection>
        <ContentGrid>
          <ContentCard>
            <h3>Our Story</h3>
            <p>
              Founded with a passion for quality and style, we've been crafting premium clothing
              since 2020. Our journey began with a simple mission: to provide exceptional
              fashion that combines comfort, durability, and contemporary design.
            </p>
          </ContentCard>

          <ContentCard>
            <h3>Our Mission</h3>
            <p>
              We strive to create sustainable, high-quality clothing that empowers individuals
              to express their unique style while making a positive impact on the environment
              and our community.
            </p>
          </ContentCard>

          <ContentCard>
            <h3>Our Values</h3>
            <p>
              Quality, sustainability, and ethical manufacturing are at the heart of everything
              we do. We believe in creating lasting relationships with our customers and
              partners.
            </p>
          </ContentCard>
        </ContentGrid>
      </ContentSection>

      <FooterSection>
        <FooterContent>
          <FooterColumn>
            <h3>About Us</h3>
            <ul>
              <li><a href="javascript:void(0)">Our Story</a></li>
              <li><a href="javascript:void(0)">Careers</a></li>
              <li><a href="javascript:void(0)">Press</a></li>
              <li><a href="javascript:void(0)">Blog</a></li>
            </ul>
          </FooterColumn>

          <FooterColumn>
            <h3>Customer Service</h3>
            <ul>
              <li><a href="javascript:void(0)">Contact Us</a></li>
              <li><a href="javascript:void(0)">Shipping Policy</a></li>
              <li><a href="javascript:void(0)">Returns & Exchanges</a></li>
              <li><a href="javascript:void(0)">FAQ</a></li>
            </ul>
          </FooterColumn>

          <FooterColumn>
            <h3>Connect With Us</h3>
            <SocialLinks>
              <a href="javascript:void(0)" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="javascript:void(0)" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z"/>
                </svg>
              </a>
              <a href="javascript:void(0)" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </SocialLinks>
          </FooterColumn>
        </FooterContent>
      </FooterSection>
    </AboutContainer>
  );
};

export default AboutPage; 
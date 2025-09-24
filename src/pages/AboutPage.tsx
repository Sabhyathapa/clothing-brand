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
  color: black;
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
  font-weight: 200;
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

      {/* FooterSection removed as requested */}
    </AboutContainer>
  );
};

export default AboutPage; 
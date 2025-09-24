import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  font-weight: 300;
  text-align: center;
  margin-bottom: 2rem;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #666;
  font-weight: 300;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 300;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #333;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 300;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #333;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #333;
    transform: translateY(-2px);
  }
`;

const FooterSection = styled.section`
  padding: 4rem 2rem;
  background: #ffffff;
  border-top: 1px solid #eaeaea;
  margin-top: auto;
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
    font-weight: 300;
  }

  a {
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;
    font-size: 0.9rem;
    font-weight: 300;

    &:hover {
      color: #000;
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
    font-weight: 300;
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
    font-weight: 300;

    &:hover {
      color: #000;
    }
  }
`;

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ContactContainer>
      <Title>Contact Us</Title>
      <ContactForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Message</Label>
          <TextArea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <SubmitButton type="submit">Send Message</SubmitButton>
      </ContactForm>

      {/* FooterSection removed as requested */}
    </ContactContainer>
  );
};

export default ContactPage; 
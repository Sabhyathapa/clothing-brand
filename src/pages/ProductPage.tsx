import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getProductById, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  padding: 80px 20px 0;
  min-height: 100vh;
  background: #fff;
`;

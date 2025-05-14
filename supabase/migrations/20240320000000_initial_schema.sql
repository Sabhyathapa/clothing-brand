-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create products table
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price decimal not null,
  original_price decimal,
  discount integer,
  images text[] not null,
  category text not null,
  description text,
  material text,
  delivery text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert initial categories
insert into categories (name, slug, description) values
  ('Shirts', 'shirts', 'Collection of premium shirts'),
  ('T-Shirts', 't-shirts', 'Collection of comfortable t-shirts'),
  ('Jeans', 'jeans', 'Collection of classic jeans');

-- Insert initial products
insert into products (name, price, original_price, discount, images, category, description, material, delivery) values
  ('Classic Oxford Shirt', 59.99, 79.99, 25, ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'], 'Shirts', 'Classic Oxford shirt perfect for formal and casual occasions.', '100% Cotton, Machine washable', 'Free shipping on orders over $100. 30-day return policy.'),
  ('Denim Button-Up', 49.99, 69.99, 28, ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'], 'Shirts', 'Stylish denim button-up shirt for a casual, trendy look.', '100% Cotton Denim, Machine washable', 'Free shipping on orders over $100. 30-day return policy.'),
  ('Linen Casual Shirt', 69.99, 89.99, 22, ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'], 'Shirts', 'Breathable linen shirt perfect for summer days.', '100% Linen, Machine washable', 'Free shipping on orders over $100. 30-day return policy.'),
  ('Classic White T-Shirt', 29.99, 39.99, 25, ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'], 'T-Shirts', 'Essential white t-shirt for everyday wear.', '100% Cotton, Machine washable', 'Free shipping on orders over $100. 30-day return policy.'),
  ('Slim Fit Jeans', 79.99, 99.99, 20, ARRAY['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'], 'Jeans', 'Modern slim fit jeans with premium denim.', '98% Cotton, 2% Elastane, Machine washable', 'Free shipping on orders over $100. 30-day return policy.');

-- Enable Row Level Security (RLS)
alter table products enable row level security;
alter table categories enable row level security;

-- Create RLS policies
create policy "Enable read access for all users" on products
  for select using (true);

create policy "Enable read access for all users" on categories
  for select using (true); 
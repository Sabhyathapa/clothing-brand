-- Enable RLS on tables
alter table products enable row level security;
alter table categories enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Enable read access for all users" on products;
drop policy if exists "Enable read access for all users" on categories;

-- Create RLS policies for products
create policy "Enable read access for all users" on products
  for select using (true);

create policy "Enable insert for authenticated users only" on products
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on products
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on products
  for delete using (auth.role() = 'authenticated');

-- Create RLS policies for categories
create policy "Enable read access for all users" on categories
  for select using (true);

create policy "Enable insert for authenticated users only" on categories
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on categories
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on categories
  for delete using (auth.role() = 'authenticated'); 
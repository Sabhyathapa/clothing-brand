-- Add size column to cart_items table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'cart_items' 
        AND column_name = 'size'
    ) THEN
        ALTER TABLE cart_items ADD COLUMN size TEXT NOT NULL DEFAULT 'M';
    END IF;
END $$;

-- Drop existing unique constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'cart_items_cart_id_product_id_key'
    ) THEN
        ALTER TABLE cart_items DROP CONSTRAINT cart_items_cart_id_product_id_key;
    END IF;
END $$;

-- Add new unique constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'cart_items_cart_id_product_id_size_key'
    ) THEN
        ALTER TABLE cart_items ADD CONSTRAINT cart_items_cart_id_product_id_size_key 
        UNIQUE (cart_id, product_id, size);
    END IF;
END $$; 
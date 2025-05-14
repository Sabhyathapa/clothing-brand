import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size: string;
  product: Product;
}

interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity: number, size: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching cart for user:', user.id);

      // Get most recent cart for user
      let { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (cartError) {
        console.error('Error fetching cart:', cartError);
        if (cartError.code === 'PGRST116') {
          // Cart doesn't exist, create one
          console.log('Creating new cart for user:', user.id);
          const { data: newCart, error: createError } = await supabase
            .from('carts')
            .insert([{ user_id: user.id }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating cart:', createError);
            throw new Error('Failed to create cart: ' + createError.message);
          }
          cartData = newCart;
        } else {
          throw new Error('Failed to fetch cart: ' + cartError.message);
        }
      }

      if (!cartData) {
        throw new Error('Failed to create or fetch cart');
      }

      console.log('Cart data:', cartData);

      // Get cart items with product details
      let { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          size,
          product:products(*)
        `)
        .eq('cart_id', cartData.id);

      if (itemsError) {
        console.error('Error fetching cart items:', itemsError);
        throw new Error('Failed to fetch cart items: ' + itemsError.message);
      }

      if (!items) {
        console.log('No items in cart');
        items = [];
      }

      console.log('Cart items:', items);

      // Type assertion for items with proper Product type
      const typedItems = items.map(item => ({
        ...item,
        product: item.product as unknown as Product
      })) as CartItem[];

      const total = typedItems.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      );

      setCart({
        id: cartData.id,
        items: typedItems,
        total
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product: Product, quantity: number, size: string) => {
    if (!user) {
      throw new Error('User must be logged in to add items to cart');
    }

    try {
      setLoading(true);
      console.log('Adding to cart:', { product, quantity, size, userId: user.id });

      // Get most recent cart for user
      let { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (cartError) {
        console.error('Error fetching cart:', cartError);
        if (cartError.code === 'PGRST116') {
          // Cart doesn't exist, create one
          console.log('Creating new cart for user:', user.id);
          const { data: newCart, error: createError } = await supabase
            .from('carts')
            .insert([{ user_id: user.id }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating cart:', createError);
            throw new Error('Failed to create cart: ' + createError.message);
          }
          cartData = newCart;
        } else {
          throw new Error('Failed to fetch cart: ' + cartError.message);
        }
      }

      if (!cartData) {
        throw new Error('Failed to create or fetch cart');
      }

      console.log('Cart data:', cartData);

      // Check if item already exists in cart with the same size
      const { data: existingItem, error: existingError } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('cart_id', cartData.id)
        .eq('product_id', product.id)
        .eq('size', size)
        .maybeSingle();

      if (existingError) {
        console.error('Error checking existing item:', existingError);
        throw new Error('Failed to check existing item: ' + existingError.message);
      }

      if (existingItem) {
        console.log('Updating existing item:', existingItem);
        // Update quantity if item exists with same size
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('cart_id', cartData.id)
          .eq('product_id', product.id)
          .eq('size', size);

        if (updateError) {
          console.error('Error updating cart item:', updateError);
          throw new Error('Failed to update cart item: ' + updateError.message);
        }
      } else {
        console.log('Inserting new item');
        // Insert new item if it doesn't exist
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cartData.id,
            product_id: product.id,
            quantity,
            size
          });

        if (insertError) {
          console.error('Error inserting cart item:', insertError);
          throw new Error('Failed to add item to cart: ' + insertError.message);
        }
      }

      // Refresh cart data
      await fetchCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(errorMessage);
      console.error('Error adding to cart:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user || !cart) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || !cart) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('cart_id', cart.id)
        .eq('product_id', productId);

      if (error) throw error;

      // Update cart state directly instead of fetching
      const updatedItems = cart.items.map(item => 
        item.product_id === productId 
          ? { ...item, quantity } 
          : item
      );

      const newTotal = updatedItems.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      );

      setCart({
        ...cart,
        items: updatedItems,
        total: newTotal
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
      console.error('Error updating quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user || !cart) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id);

      if (error) throw error;
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
-- =====================================================
-- BASE DE DONNÉES COMPLÈTE - EVA SHOE
-- Conforme au Cahier des Charges Fonctionnel
-- Version 2.1 - Septembre 2026
-- =====================================================

-- =====================================================
-- 0. ACTIVATION DES EXTENSIONS NÉCESSAIRES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- =====================================================
-- 1. CRÉATION DES TABLES
-- =====================================================

-- 1.1 TABLE : categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.2 TABLE : products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  sale_price DECIMAL(10,2) CHECK (sale_price >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand TEXT,
  gender TEXT CHECK (gender IN ('homme', 'femme', 'enfant', 'unisexe')),
  weight DECIMAL(10,2) CHECK (weight >= 0),
  dimensions TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.3 TABLE : variants
CREATE TABLE IF NOT EXISTS public.variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) CHECK (price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  reserved_quantity INTEGER DEFAULT 0 CHECK (reserved_quantity >= 0),
  security_stock INTEGER DEFAULT 5 CHECK (security_stock >= 0),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.4 TABLE : product_images
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.variants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.5 TABLE : collections
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.6 TABLE : collection_products
CREATE TABLE IF NOT EXISTS public.collection_products (
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

-- 1.7 TABLE : profiles (extension Supabase Auth)
DO $$
BEGIN
  -- Créer la table si elle n'existe pas
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT,
      first_name TEXT,
      last_name TEXT,
      avatar_url TEXT,
      phone TEXT,
      role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'manager')),
      preferences JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE
    );
  ELSE
    -- Ajouter les colonnes manquantes si la table existe déjà
    BEGIN
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client';
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    -- Ajouter la contrainte sur role si elle n'existe pas
    BEGIN
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('client', 'admin', 'manager'));
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
  
  -- Mettre à jour l'email depuis auth.users si nécessaire
  UPDATE public.profiles 
  SET email = auth.users.email 
  FROM auth.users 
  WHERE public.profiles.id = auth.users.id 
    AND (public.profiles.email IS NULL OR public.profiles.email = '');
END $$;

-- 1.8 TABLE : addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  country TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  type TEXT DEFAULT 'both' CHECK (type IN ('shipping', 'billing', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.9 TABLE : orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  shipping_instructions TEXT,
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
  shipping_fee DECIMAL(10,2) DEFAULT 0 CHECK (shipping_fee >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'in_transit', 'delivered', 'cancelled', 'refunded', 'returned')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'mobile_money', 'card', 'wallet')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference TEXT,
  tracking_number TEXT,
  whatsapp_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.10 TABLE : order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  variant_size TEXT,
  variant_color TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.11 TABLE : order_status_history
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'in_transit', 'delivered', 'cancelled', 'refunded', 'returned')),
  note TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.12 TABLE : reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.13 TABLE : promotions
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping', 'bogo')),
  value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.14 TABLE : promo_codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE,
  max_uses INTEGER DEFAULT 1 CHECK (max_uses > 0),
  used_count INTEGER DEFAULT 0 CHECK (used_count >= 0),
  min_order_amount DECIMAL(10,2) CHECK (min_order_amount >= 0),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.15 TABLE : carts
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  items JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.16 TABLE : stock_movements
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id UUID NOT NULL REFERENCES public.variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'reserve', 'release')),
  reference TEXT,
  note TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stock_before INTEGER NOT NULL,
  stock_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.17 TABLE : stock_alerts
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variant_id UUID NOT NULL REFERENCES public.variants(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock')),
  threshold INTEGER NOT NULL CHECK (threshold >= 0),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 1.18 TABLE : shipments
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  tracking_number TEXT UNIQUE,
  carrier TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'picked', 'transit', 'delivered', 'failed')),
  delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 1.19 TABLE : notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order', 'payment', 'shipping', 'promotion')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.20 TABLE : favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- 1.21 TABLE : wishlists
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.22 TABLE : wishlist_items
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (wishlist_id, product_id)
);

-- 1.23 TABLE : offline_sales
CREATE TABLE IF NOT EXISTS public.offline_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  device_id TEXT,
  order_number TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  items JSONB DEFAULT '[]'::jsonb,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE
);

-- 1.24 TABLE : offline_sync_queue
CREATE TABLE IF NOT EXISTS public.offline_sync_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  device_id TEXT,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('sale', 'stock_update', 'order_update')),
  payload JSONB NOT NULL,
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'processing', 'synced', 'failed')),
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE
);

-- 1.25 TABLE : offline_conflicts
CREATE TABLE IF NOT EXISTS public.offline_conflicts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  device_id TEXT,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'stock', 'order')),
  entity_id UUID NOT NULL,
  local_value JSONB NOT NULL,
  server_value JSONB NOT NULL,
  resolution_status TEXT DEFAULT 'pending' CHECK (resolution_status IN ('pending', 'resolved', 'ignored')),
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 1.26 TABLE : payment_transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  currency TEXT DEFAULT 'XAF',
  method TEXT NOT NULL CHECK (method IN ('card', 'mobile_money', 'wallet', 'cash')),
  provider TEXT,
  reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);


-- =====================================================
-- 2. INDEXES POUR OPTIMISATION
-- =====================================================

-- 2.1 Index sur les produits
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);

-- 2.2 Index sur les variantes
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_size ON public.variants(size);
CREATE INDEX IF NOT EXISTS idx_variants_color ON public.variants(color);
CREATE INDEX IF NOT EXISTS idx_variants_stock_quantity ON public.variants(stock_quantity);

-- 2.3 Index sur les catégories
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- 2.4 Index sur les commandes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- 2.5 Index sur les lignes de commande
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant_id ON public.order_items(variant_id);

-- 2.6 Index sur les avis
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_published ON public.reviews(is_published);

-- 2.7 Index sur les favoris
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites(product_id);

-- 2.8 Index sur les mouvements de stock
CREATE INDEX IF NOT EXISTS idx_stock_movements_variant_id ON public.stock_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON public.stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON public.stock_movements(type);

-- 2.9 Index sur les notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- 2.10 Index sur les expéditions
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);

-- 2.11 Index sur les codes promo
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON public.promo_codes(is_active);

-- 2.12 Index sur les collections
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_is_active ON public.collections(is_active);

-- 2.13 Index sur les profils
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- 2.14 Index sur les adresses
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_is_default ON public.addresses(is_default);

-- 2.15 Index sur les transactions
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON public.payment_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);

-- 2.16 Index pour la recherche full-text (avec pg_trgm)
CREATE INDEX IF NOT EXISTS idx_products_name_trgm 
ON public.products 
USING GIN (name gin_trgm_ops);

-- 2.17 Index sur le mode hors ligne
CREATE INDEX IF NOT EXISTS idx_offline_sales_user_id ON public.offline_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_sales_sync_status ON public.offline_sales(sync_status);
CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_user_id ON public.offline_sync_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_sync_status ON public.offline_sync_queue(sync_status);


-- =====================================================
-- 3. FONCTIONS ET PROCÉDURES STOCKÉES
-- =====================================================

-- 3.1 Fonction : Mettre à jour le stock après une vente
CREATE OR REPLACE FUNCTION public.update_stock_after_order(
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_stock INTEGER;
BEGIN
  SELECT stock_quantity INTO v_current_stock
  FROM public.variants
  WHERE id = p_variant_id
  FOR UPDATE;

  IF v_current_stock < p_quantity THEN
    RETURN FALSE;
  END IF;

  UPDATE public.variants
  SET stock_quantity = stock_quantity - p_quantity,
      updated_at = NOW()
  WHERE id = p_variant_id;

  INSERT INTO public.stock_movements (
    variant_id, quantity, type, reference, stock_before, stock_after
  ) VALUES (
    p_variant_id,
    -p_quantity,
    'out',
    'Vente par commande',
    v_current_stock,
    v_current_stock - p_quantity
  );

  RETURN TRUE;
END;
$$;

-- 3.2 Fonction : Réapprovisionner le stock
CREATE OR REPLACE FUNCTION public.add_stock(
  p_variant_id UUID,
  p_quantity INTEGER,
  p_reference TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_stock INTEGER;
BEGIN
  SELECT stock_quantity INTO v_current_stock
  FROM public.variants
  WHERE id = p_variant_id
  FOR UPDATE;

  UPDATE public.variants
  SET stock_quantity = stock_quantity + p_quantity,
      updated_at = NOW()
  WHERE id = p_variant_id;

  INSERT INTO public.stock_movements (
    variant_id, quantity, type, reference, note, stock_before, stock_after
  ) VALUES (
    p_variant_id,
    p_quantity,
    'in',
    p_reference,
    p_note,
    v_current_stock,
    v_current_stock + p_quantity
  );
END;
$$;

-- 3.3 Fonction : Vérifier et créer les alertes de stock
CREATE OR REPLACE FUNCTION public.check_stock_alerts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.stock_quantity <= NEW.security_stock AND NEW.stock_quantity > 0 THEN
    INSERT INTO public.stock_alerts (
      variant_id, alert_type, threshold
    ) VALUES (
      NEW.id,
      'low_stock',
      NEW.security_stock
    ) ON CONFLICT DO NOTHING;
  END IF;

  IF NEW.stock_quantity = 0 THEN
    INSERT INTO public.stock_alerts (
      variant_id, alert_type, threshold
    ) VALUES (
      NEW.id,
      'out_of_stock',
      0
    ) ON CONFLICT DO NOTHING;
  END IF;

  UPDATE public.stock_alerts
  SET is_resolved = TRUE, resolved_at = NOW()
  WHERE variant_id = NEW.id
    AND is_resolved = FALSE
    AND alert_type IN ('low_stock', 'out_of_stock')
    AND (
      (alert_type = 'low_stock' AND NEW.stock_quantity > NEW.security_stock)
      OR (alert_type = 'out_of_stock' AND NEW.stock_quantity > 0)
    );

  RETURN NEW;
END;
$$;

-- 3.4 Fonction : Générer un numéro de commande unique
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_year TEXT;
  v_count INTEGER;
  v_order_number TEXT;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');

  SELECT COUNT(*) + 1 INTO v_count
  FROM public.orders
  WHERE order_number LIKE 'EVA-' || v_year || '-%';

  v_order_number := 'EVA-' || v_year || '-' || LPAD(v_count::TEXT, 4, '0');

  RETURN v_order_number;
END;
$$;

-- 3.5 Fonction : Calculer le prix total d'une commande
CREATE OR REPLACE FUNCTION public.calculate_order_total(p_order_id UUID)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
  v_total DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(total_price), 0)
  INTO v_total
  FROM public.order_items
  WHERE order_id = p_order_id;

  RETURN v_total;
END;
$$;

-- 3.6 Procédure : Annuler une commande et rembourser le stock
CREATE OR REPLACE PROCEDURE public.cancel_order(p_order_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_item RECORD;
BEGIN
  UPDATE public.orders
  SET status = 'cancelled',
      updated_at = NOW()
  WHERE id = p_order_id;

  FOR v_order_item IN
    SELECT * FROM public.order_items WHERE order_id = p_order_id
  LOOP
    IF v_order_item.variant_id IS NOT NULL THEN
      UPDATE public.variants
      SET stock_quantity = stock_quantity + v_order_item.quantity,
          updated_at = NOW()
      WHERE id = v_order_item.variant_id;
    END IF;
  END LOOP;
END;
$$;

-- 3.7 Fonction : Recherche de produits
CREATE OR REPLACE FUNCTION public.search_products(
  p_search_term TEXT,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  price DECIMAL,
  sale_price DECIMAL,
  description TEXT,
  relevance REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.price,
    p.sale_price,
    p.description,
    ts_rank(
      to_tsvector('french', p.name || ' ' || COALESCE(p.description, '')),
      plainto_tsquery('french', p_search_term)
    ) AS relevance
  FROM public.products p
  WHERE is_published = TRUE
    AND is_active = TRUE
    AND to_tsvector('french', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('french', p_search_term)
  ORDER BY relevance DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- 3.8 Fonction : Récupérer les produits en promotion
CREATE OR REPLACE FUNCTION public.get_products_on_sale(
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  price DECIMAL,
  sale_price DECIMAL,
  discount_percent INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.price,
    p.sale_price,
    ROUND(((p.price - p.sale_price) / p.price) * 100)::INTEGER AS discount_percent
  FROM public.products p
  WHERE is_published = TRUE
    AND is_active = TRUE
    AND sale_price IS NOT NULL
    AND sale_price < price
  ORDER BY discount_percent DESC
  LIMIT p_limit;
END;
$$;

-- 3.9 Fonction : Statistiques du vendeur
CREATE OR REPLACE FUNCTION public.get_vendor_stats()
RETURNS TABLE (
  total_orders BIGINT,
  total_revenue DECIMAL,
  avg_order_value DECIMAL,
  total_products BIGINT,
  low_stock_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::BIGINT FROM public.orders WHERE status != 'cancelled') AS total_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE status != 'cancelled') AS total_revenue,
    (SELECT COALESCE(AVG(total_amount), 0) FROM public.orders WHERE status != 'cancelled') AS avg_order_value,
    (SELECT COUNT(*)::BIGINT FROM public.products WHERE is_active = TRUE AND is_published = TRUE) AS total_products,
    (SELECT COUNT(*)::BIGINT FROM public.variants WHERE stock_quantity <= security_stock) AS low_stock_count;
END;
$$;

-- 3.10 Fonction : Récupérer les produits par variante
CREATE OR REPLACE FUNCTION public.get_products_by_variant(
  p_size TEXT DEFAULT NULL,
  p_color TEXT DEFAULT NULL
)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  variant_id UUID,
  size TEXT,
  color TEXT,
  price DECIMAL,
  stock_quantity INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS product_id,
    p.name AS product_name,
    v.id AS variant_id,
    v.size,
    v.color,
    COALESCE(v.price, p.price) AS price,
    v.stock_quantity
  FROM public.products p
  INNER JOIN public.variants v ON p.id = v.product_id
  WHERE p.is_published = TRUE
    AND p.is_active = TRUE
    AND (p_size IS NULL OR v.size = p_size)
    AND (p_color IS NULL OR v.color = p_color)
    AND v.stock_quantity > 0
  ORDER BY p.name, v.size, v.color;
END;
$$;


-- =====================================================
-- 4. TRIGGERS (DÉCLENCHEURS)
-- =====================================================

-- 4.1 Trigger : Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_categories_update BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_products_update BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_variants_update BEFORE UPDATE ON public.variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_collections_update BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_orders_update BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_profiles_update BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_addresses_update BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_reviews_update BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_promotions_update BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_shipments_update BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_payment_transactions_update BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4.2 Trigger : Vérification des alertes de stock
CREATE TRIGGER trigger_check_stock_alerts
AFTER UPDATE OF stock_quantity ON public.variants
  FOR EACH ROW EXECUTE FUNCTION public.check_stock_alerts();

CREATE TRIGGER trigger_check_stock_alerts_insert
AFTER INSERT ON public.variants
  FOR EACH ROW EXECUTE FUNCTION public.check_stock_alerts();

-- 4.3 Trigger : Génération automatique du numéro de commande
CREATE OR REPLACE FUNCTION public.generate_order_number_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_generate_order_number
BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number_trigger();

-- 4.4 Trigger : Historique des statuts de commande
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (
      order_id, status, note, user_id
    ) VALUES (
      NEW.id,
      NEW.status,
      'Changement automatique de statut',
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_order_status
AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();

-- 4.5 Trigger : Mise à jour du panier
CREATE OR REPLACE FUNCTION public.update_cart_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_cart_update BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.update_cart_timestamp();

-- 4.6 Trigger : Création automatique du profil après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_create_profile
AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4.7 Trigger : Réservation de stock lors de l'ajout au panier
CREATE OR REPLACE FUNCTION public.reserve_stock_on_cart_add()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item JSONB;
  v_variant_id UUID;
  v_quantity INTEGER;
  v_current_stock INTEGER;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    v_variant_id := (v_item->>'variant_id')::UUID;
    v_quantity := (v_item->>'quantity')::INTEGER;

    SELECT stock_quantity INTO v_current_stock
    FROM public.variants
    WHERE id = v_variant_id
    FOR UPDATE;

    IF v_current_stock < v_quantity THEN
      RAISE EXCEPTION 'Stock insuffisant pour la variante %', v_variant_id;
    END IF;

    UPDATE public.variants
    SET reserved_quantity = reserved_quantity + v_quantity,
        updated_at = NOW()
    WHERE id = v_variant_id;
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_reserve_stock
BEFORE INSERT OR UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.reserve_stock_on_cart_add();

-- 4.8 Trigger : Validation de la commande (libération du stock réservé)
CREATE OR REPLACE FUNCTION public.process_order_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item RECORD;
  v_variant_id UUID;
  v_quantity INTEGER;
  v_current_stock INTEGER;
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    FOR v_item IN
      SELECT * FROM public.order_items WHERE order_id = NEW.id
    LOOP
      v_variant_id := v_item.variant_id;
      v_quantity := v_item.quantity;

      IF v_variant_id IS NOT NULL THEN
        UPDATE public.variants
        SET reserved_quantity = reserved_quantity - v_quantity,
            stock_quantity = stock_quantity - v_quantity,
            updated_at = NOW()
        WHERE id = v_variant_id;

        SELECT stock_quantity + v_quantity INTO v_current_stock
        FROM public.variants
        WHERE id = v_variant_id;

        INSERT INTO public.stock_movements (
          variant_id, quantity, type, reference, stock_before, stock_after
        ) VALUES (
          v_variant_id,
          -v_quantity,
          'out',
          'Commande ' || NEW.order_number,
          v_current_stock,
          v_current_stock - v_quantity
        );
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_process_order_stock
AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.process_order_stock();


-- =====================================================
-- 5. VALIDATION DE LA BASE DE DONNÉES
-- =====================================================

-- Vérifier les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifier les fonctions créées
SELECT proname 
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace 
ORDER BY proname;

-- Vérifier les triggers créés
SELECT tgname 
FROM pg_trigger 
WHERE tgrelid = 'public.orders'::regclass;
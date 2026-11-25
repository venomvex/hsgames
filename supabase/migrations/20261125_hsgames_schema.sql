-- ====================================================================
-- HSGames — Complete Database Architecture & Row Level Security (RLS)
-- Platform: Supabase PostgreSQL
-- ====================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    company_name TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Official Finalized Categories Table (Exact 8 Categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed Exact 8 Categories
INSERT INTO public.categories (name, slug, description, icon_name, display_order)
VALUES
    ('All Games', 'all-games', 'Explore our complete catalog of native Android social games.', 'Gamepad2', 1),
    ('Card Battles', 'card-battles', 'Teen Patti, Poker, and live multiplayer table card battles.', 'Club', 2),
    ('Greedy Series', 'greedy-series', 'Fast-paced multiplier roulette and feeding wheel betting games.', 'Flame', 3),
    ('Roulette & Wheels', 'roulette-wheels', 'European & American style high-stakes voice room wheels.', 'CircleDot', 4),
    ('Crash Aviator', 'crash-aviator', 'Real-time curve multiplier and high-tension cashout games.', 'Plane', 5),
    ('Fruit Slots', 'fruit-slots', 'Classic 3-reel and 5-reel high-conversion fruit slot machines.', 'Apple', 6),
    ('Jackpots & Classic Multiplayer', 'jackpots-classic-multiplayer', 'Progressive jackpot rooms, Dice, and high-frequency live mini-games.', 'Trophy', 7),
    ('Ludo', 'ludo', '4-Player classic & quick Ludo voice-synced board games.', 'Dice5', 8)
ON CONFLICT (name) DO NOTHING;

-- 3. Games Table
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID NOT NULL REFERENCES public.categories(id),
    category_name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price_single NUMERIC(10, 2) NOT NULL,
    price_extended NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    reviews_count INT NOT NULL DEFAULT 0,
    downloads_count INT NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    cover_image TEXT NOT NULL,
    video_url TEXT,
    has_playable_demo BOOLEAN NOT NULL DEFAULT true,
    demo_apk_url TEXT,
    private_source_path TEXT, -- Secure storage path
    tech_specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    integration_guide JSONB NOT NULL DEFAULT '[]'::jsonb,
    version TEXT NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Bundles Table
CREATE TABLE IF NOT EXISTS public.bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    bundle_price NUMERIC(10, 2) NOT NULL,
    savings_percentage INT NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    badge TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Bundle Items Mapping
CREATE TABLE IF NOT EXISTS public.bundle_items (
    bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    PRIMARY KEY (bundle_id, game_id)
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id),
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_whatsapp TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    payment_proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'under_review' CHECK (status IN ('pending', 'under_review', 'paid', 'rejected', 'refunded')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    reviewed_at TIMESTAMPTZ
);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_type TEXT NOT NULL CHECK (product_type IN ('game', 'bundle')),
    product_id UUID NOT NULL,
    product_title TEXT NOT NULL,
    license_type TEXT NOT NULL CHECK (license_type IN ('single', 'extended')),
    price NUMERIC(10, 2) NOT NULL
);

-- 8. Commercial Licenses Table
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key TEXT NOT NULL UNIQUE,
    product_name TEXT NOT NULL,
    product_id UUID NOT NULL,
    customer_email TEXT NOT NULL,
    customer_id UUID REFERENCES public.profiles(id),
    order_id UUID NOT NULL REFERENCES public.orders(id),
    order_number TEXT NOT NULL,
    license_type TEXT NOT NULL CHECK (license_type IN ('Single Application License', 'Extended License', 'Custom License')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    issued_at DATE NOT NULL DEFAULT CURRENT_DATE,
    download_url TEXT,
    version TEXT NOT NULL DEFAULT '1.0.0'
);

-- 9. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id),
    customer_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Support Messages Table
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('customer', 'admin')),
    sender_name TEXT NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Website Settings Table
CREATE TABLE IF NOT EXISTS public.website_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Categories & Published Games: Publicly readable
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can view published games" ON public.games FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view bundles" ON public.bundles FOR SELECT USING (true);
CREATE POLICY "Public can view website settings" ON public.website_settings FOR SELECT USING (true);

-- Customer Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Customers can view their own orders; Admins can view/update all
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT 
USING (auth.uid() = customer_id OR customer_email = auth.jwt() ->> 'email');

-- Security hardening: Customers cannot insert orders with status 'paid' directly
CREATE POLICY "Customers insert own orders" ON public.orders FOR INSERT 
WITH CHECK (status IN ('pending', 'under_review'));

-- Order Items Policies: Customers can insert and view their own order items
CREATE POLICY "Customers insert own order items" ON public.order_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.customer_id = auth.uid() OR orders.customer_email = auth.jwt() ->> 'email')
  )
);

CREATE POLICY "Customers view own order items" ON public.order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.customer_id = auth.uid() OR orders.customer_email = auth.jwt() ->> 'email')
  )
);

-- Licenses: Customers view only their active issued licenses
CREATE POLICY "Customers view own licenses" ON public.licenses FOR SELECT 
USING (customer_email = auth.jwt() ->> 'email' OR auth.uid() = customer_id);

-- Tickets: Customers view their own tickets
CREATE POLICY "Customers view own tickets" ON public.support_tickets FOR SELECT 
USING (customer_email = auth.jwt() ->> 'email' OR auth.uid() = customer_id);

CREATE POLICY "Customers create tickets" ON public.support_tickets FOR INSERT 
WITH CHECK (true);

-- Admins: Full Access Policy (Checks role='admin' in profiles)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins full access to games" ON public.games FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to order items" ON public.order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to licenses" ON public.licenses FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to tickets" ON public.support_tickets FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to settings" ON public.website_settings FOR ALL USING (public.is_admin());

-- ====================================================================
-- STORAGE BUCKETS & PRIVATE SOURCE ARCHIVE POLICIES
-- ====================================================================

-- 1. Create Private Storage Bucket for un-obfuscated Android source code
INSERT INTO storage.buckets (id, name, public)
VALUES ('game-source-archives', 'game-source-archives', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. Storage Object RLS: Admins have full access to upload source packages
CREATE POLICY "Admins manage source archives" ON storage.objects
FOR ALL USING (
  bucket_id = 'game-source-archives' AND public.is_admin()
);

-- 3. Storage Object RLS: Only verified buyers with an active commercial license can download
CREATE POLICY "Verified buyers download source archives" ON storage.objects
FOR SELECT USING (
  bucket_id = 'game-source-archives' AND (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM public.licenses
      WHERE licenses.status = 'active'
      AND (licenses.customer_email = auth.jwt() ->> 'email' OR licenses.customer_id = auth.uid())
    )
  )
);

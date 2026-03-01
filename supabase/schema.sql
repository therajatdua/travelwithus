-- ============================================================
-- TravelWithUs – Supabase Schema  v2 (Production / RBAC)
-- ============================================================
-- Run this in the Supabase SQL Editor to bootstrap the DB.
-- Assumes the built-in auth.users table is already in place.
-- ============================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES – syncs with auth.users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  avatar_url TEXT,
  role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Public profile data, 1-to-1 with auth.users';
COMMENT ON COLUMN public.profiles.role IS 'RBAC role: admin | user';

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── RLS: profiles ────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "profiles_select_own"   ON public.profiles FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "profiles_update_own"   ON public.profiles FOR UPDATE  USING (auth.uid() = user_id);
-- Admins have full access
CREATE POLICY "profiles_admin_all"    ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 2. PACKAGES – travel destinations
-- ============================================================
CREATE TABLE IF NOT EXISTS public.packages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  theme_key   TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  base_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'USD',
  hero_image  TEXT NOT NULL DEFAULT '',
  features    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.packages IS 'Travel packages / destinations';

-- Seed the 5 launch destinations
INSERT INTO public.packages (slug, theme_key, name, description, base_price, hero_image, features)
VALUES
  ('mumbai',   'mumbai',   'Mumbai',          'Temples, street food & golden chaos.',    999,  '/images/mumbai-hero.jpg',   '{"transport":["Flight","Train","Bus"],"nights":4}'),
  ('rio',      'rio',      'Rio de Janeiro',  'Carnival beats & beachside energy.',      1299, '/images/rio-hero.jpg',      '{"transport":["Flight"],"nights":4}'),
  ('thailand', 'thailand', 'Thailand',        'Temples, floating markets & full-moon.',  1149, '/images/thailand-hero.jpg', '{"transport":["Flight","Bus","Ferry"],"nights":4}'),
  ('italy',    'italy',    'Italy',           'Pasta, Prosecco & Renaissance drama.',    2199, '/images/italy-hero.jpg',    '{"transport":["Flight","Train"],"nights":4}'),
  ('tokyo',    'tokyo',    'Tokyo',           'Neon streets, sakura dreams & ramen.',    1899, '/images/tokyo-hero.jpg',    '{"transport":["Flight","Train"],"nights":4}')
ON CONFLICT (slug) DO NOTHING;

-- ── RLS: packages ─────────────────────────────────────────────
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
-- Everyone can read packages (public catalog)
CREATE POLICY "packages_select_public" ON public.packages FOR SELECT USING (true);
-- Only admins can insert/update/delete packages
CREATE POLICY "packages_admin_write"   ON public.packages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 3. BOOKINGS – user reservations
-- ============================================================
CREATE TYPE public.booking_status   AS ENUM ('pending', 'paid', 'cancelled', 'completed');
CREATE TYPE public.payment_status_t AS ENUM ('unpaid', 'paid', 'refunded');

CREATE TABLE IF NOT EXISTS public.bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id        UUID NOT NULL REFERENCES public.packages(id) ON DELETE RESTRICT,
  status            public.booking_status   NOT NULL DEFAULT 'pending',
  payment_status    public.payment_status_t NOT NULL DEFAULT 'unpaid',
  origin_country    TEXT NOT NULL DEFAULT '',
  origin_state      TEXT NOT NULL DEFAULT '',
  origin_city       TEXT NOT NULL,
  transport_mode    TEXT NOT NULL,
  pax_info          JSONB NOT NULL DEFAULT '{"adults":1,"children":0,"seniors":0}',
  total_pax         INT GENERATED ALWAYS AS (
                      (pax_info->>'adults')::int +
                      (pax_info->>'children')::int +
                      (pax_info->>'seniors')::int
                    ) STORED,
  base_price        NUMERIC(10,2) NOT NULL,
  total_amount      NUMERIC(10,2) NOT NULL,
  ai_itinerary      JSONB NOT NULL DEFAULT '{}',
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.bookings IS 'Travel bookings linking users to packages';

CREATE INDEX IF NOT EXISTS idx_bookings_user    ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_package ON public.bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status  ON public.bookings(status);

-- ── RLS: bookings ─────────────────────────────────────────────
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
-- Users can read and write their own bookings only
CREATE POLICY "bookings_select_own"  ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookings_insert_own"  ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings_update_own"  ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
-- Admins have full access to all bookings
CREATE POLICY "bookings_admin_all"   ON public.bookings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 4. AUTO-UPDATE updated_at TRIGGER (shared)
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_packages_updated_at ON public.packages;
CREATE TRIGGER set_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON public.bookings;
CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,                       -- e.g. "mumbai"
  theme_key   TEXT UNIQUE NOT NULL,                       -- maps to CSS data-theme
  name        TEXT NOT NULL,                              -- "Mumbai"
  description TEXT NOT NULL DEFAULT '',
  base_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'USD',
  hero_image  TEXT NOT NULL DEFAULT '',
  features    JSONB NOT NULL DEFAULT '{}',                -- flexible feature bag
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.packages IS 'Travel packages / destinations';

-- Seed the 5 launch destinations
INSERT INTO public.packages (slug, theme_key, name, description, base_price, hero_image, features)
VALUES
  ('mumbai',   'mumbai',   'Mumbai',          'Temples, street food & golden chaos.',    999,  '/images/mumbai-hero.jpg',   '{"transport":["Flight","Train","Bus"],"nights":4}'),
  ('rio',      'rio',      'Rio de Janeiro',  'Carnival beats & beachside energy.',      1299, '/images/rio-hero.jpg',      '{"transport":["Flight"],"nights":4}'),
  ('thailand', 'thailand', 'Thailand',        'Temples, floating markets & full-moon.',  1149, '/images/thailand-hero.jpg',  '{"transport":["Flight","Bus","Ferry"],"nights":4}'),
  ('italy',    'italy',    'Italy',           'Pasta, Prosecco & Renaissance drama.',    2199, '/images/italy-hero.jpg',    '{"transport":["Flight","Train"],"nights":4}'),
  ('tokyo',    'tokyo',    'Tokyo',           'Neon streets, sakura dreams & ramen.',    1899, '/images/tokyo-hero.jpg',    '{"transport":["Flight","Train"],"nights":4}')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 3. BOOKINGS – user reservations
-- ============================================================
CREATE TYPE public.booking_status AS ENUM ('pending', 'paid', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS public.bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id        UUID NOT NULL REFERENCES public.packages(id) ON DELETE RESTRICT,
  status            public.booking_status NOT NULL DEFAULT 'pending',
  origin_country    TEXT NOT NULL DEFAULT '',                -- ISO country code
  origin_state      TEXT NOT NULL DEFAULT '',                -- ISO state code
  origin_city       TEXT NOT NULL,
  transport_mode    TEXT NOT NULL,
  pax_details       JSONB NOT NULL DEFAULT '{"adults":1,"children":0,"seniors":0}',
  total_pax         INT GENERATED ALWAYS AS (
                      (pax_details->>'adults')::int +
                      (pax_details->>'children')::int +
                      (pax_details->>'seniors')::int
                    ) STORED,
  base_price        NUMERIC(10,2) NOT NULL,
  total_price       NUMERIC(10,2) NOT NULL,
  ai_customization  JSONB NOT NULL DEFAULT '{}',          -- AI-generated itinerary
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.bookings IS 'Travel bookings linking users to packages';

CREATE INDEX idx_bookings_user    ON public.bookings(user_id);
CREATE INDEX idx_bookings_package ON public.bookings(package_id);
CREATE INDEX idx_bookings_status  ON public.bookings(status);

-- ============================================================
-- 4. AUTO-UPDATE updated_at TRIGGER (shared)
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: users can read own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Profiles: users can update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Packages (public read-only) ─────────────────────────────
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Packages: public read"
  ON public.packages FOR SELECT
  USING (true);

-- ── Bookings ────────────────────────────────────────────────
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings: authenticated users can insert own"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Bookings: users can read own"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- Done. All tables, triggers, indexes, and RLS policies active.
-- ============================================================

-- ==============================================================================
-- CONNECTUP: BLOGS TABLE & ADMIN ACCESS ROW-LEVEL SECURITY (RLS)
-- Run this script in the Supabase SQL Editor (or standard PostgreSQL)
-- This enforces:
--   1. Public visitors can only view published blogs.
--   2. Only users with role = 'ADMIN' in public.profiles can INSERT, UPDATE, DELETE.
--   3. Automatically maintains updated_at triggers and performance indexes.
-- ==============================================================================

-- 1. Create the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    company TEXT DEFAULT 'CONNECTUP',
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'Ecosystem & Market',
    badge TEXT DEFAULT 'DISPATCH',
    author TEXT DEFAULT 'ConnectUp Editorial',
    author_role TEXT DEFAULT 'Editorial Lead',
    author_avatar TEXT,
    date TEXT DEFAULT to_char(now(), 'Mon DD, YYYY'),
    read_time TEXT DEFAULT '5 min read',
    image TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    views TEXT DEFAULT '1.2k',
    views_count INTEGER DEFAULT 120,
    takeaways TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON public.blogs(featured);

-- 3. Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blogs_updated_at ON public.blogs;
CREATE TRIGGER trg_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_blogs_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to allow clean re-runs
DROP POLICY IF EXISTS "Public can view published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can view all blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can delete blogs" ON public.blogs;

-- Policy (A): Anyone can read published posts
CREATE POLICY "Public can view published blogs"
ON public.blogs
FOR SELECT
USING (published = true);

-- Policy (B): Admins can view ALL posts (including unpublished drafts)
CREATE POLICY "Admins can view all blogs"
ON public.blogs
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
);

-- Policy (C): Only Admins can create new blog posts
CREATE POLICY "Admins can insert blogs"
ON public.blogs
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
);

-- Policy (D): Only Admins can modify blog posts
CREATE POLICY "Admins can update blogs"
ON public.blogs
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
);

-- Policy (E): Only Admins can delete blog posts
CREATE POLICY "Admins can delete blogs"
ON public.blogs
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
);

-- ==============================================================================
-- 6. Initial Seed Articles (Optional - creates starter posts if table is empty)
-- ==============================================================================
INSERT INTO public.blogs (title, company, excerpt, content, category, badge, author, author_role, date, read_time, image, featured, published, views, takeaways)
SELECT 
  'OMMAX x Singulier join forces to create Europe’s leading AI management consulting platform',
  'OMMAX x SINGULIER',
  'A landmark transaction uniting 600+ AI practitioners to accelerate enterprise digital transformation across European markets.',
  '<h2>A Landmark European AI Consolidation</h2><p>We are thrilled to announce that portfolio company OMMAX has joined forces with Singulier to establish Europe''s premier AI-first management consulting platform. This strategic union combines deep digital execution expertise with world-class advisory capabilities.</p><p>Since our early-stage backing, OMMAX has scaled revenues significantly, partnering with premier private equity sponsors and global enterprises to unlock value through artificial intelligence and automation strategies.</p><blockquote>"This transaction marks a pivotal moment for European tech leadership, proving that specialized AI consulting can scale rapidly across international borders."</blockquote><h3>Key Highlights of the Transaction</h3><ul><li><strong>Expanded Reach:</strong> Over 600 AI specialists across London, Munich, Paris, and Zurich.</li><li><strong>Comprehensive AI Suite:</strong> End-to-end capabilities from generative AI roadmap design to proprietary data pipeline engineering.</li><li><strong>Sustained Value Creation:</strong> Deep integration with European sponsors to optimize portfolio company operations.</li></ul><p>We congratulate the leadership teams at both companies as they pioneer the next era of European enterprise tech transformation.</p>',
  'Portfolio Exit',
  'PORTFOLIO EXIT',
  'Sarah Chen',
  'Managing Partner, Enterprise Tech',
  'Oct 22, 2026',
  '4 min read',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
  true,
  true,
  '14.2k',
  ARRAY[
    'Unites over 600 specialized AI engineers and management consultants across London, Munich, Paris, and Zurich.',
    'Positions the joint entity as the primary digital execution partner for Tier-1 European private equity sponsors.',
    'Expands proprietary ML workflows that reduce enterprise deployment cycles from months to days.'
  ]
WHERE NOT EXISTS (SELECT 1 FROM public.blogs LIMIT 1);

INSERT INTO public.blogs (title, company, excerpt, content, category, badge, author, author_role, date, read_time, image, featured, published, views, takeaways)
SELECT 
  'Saronic x NVIDIA collaborate to power autonomous surface vessel artificial intelligence',
  'SARONIC x NVIDIA',
  'Integrating real-time edge computing on autonomous naval vessels to enable tactical autonomy and swarm synchronization at sea.',
  '<h2>Powering Next-Gen Maritime Autonomy</h2><p>Saronic Technologies has officially announced a multi-year strategic partnership with NVIDIA to bring accelerated computing and real-time sensor fusion to autonomous maritime defense vessels.</p><p>By embedding advanced robotics edge platforms directly into Saronic''s surface vessels, defense units can process terabytes of sonar, radar, and optical imagery at zero latency directly at sea.</p><blockquote>"Modern naval defense cannot rely on high-latency satellite feeds. Autonomous assets must think, adapt, and coordinate at the tactical edge."</blockquote><h3>Strategic Impact & Innovation</h3><ul><li><strong>Edge AI at Scale:</strong> Onboard multi-modal neural network processing without relying on high-latency satellite feeds.</li><li><strong>Swarm Intelligence:</strong> Coordinated fleet navigation permitting multi-vessel tactical maneuvers.</li><li><strong>Rapid Deployment:</strong> Modular hardware integration allowing field upgrades in under 15 minutes.</li></ul><p>As early backers of Saronic, we are immensely proud to see their vision of modern maritime sovereignty become reality alongside world-class technology partners.</p>',
  'Defense Tech',
  'PORTFOLIO NEWS',
  'Marcus Vance',
  'Head of DeepTech Capital',
  'Oct 14, 2026',
  '6 min read',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  true,
  true,
  '22.8k',
  ARRAY[
    'Zero-latency multi-modal neural network processing directly onboard autonomous naval surface vessels.',
    'Eliminates reliance on fragile satellite downlinks in contested maritime electronic warfare zones.',
    'Modular edge hardware architecture allows full software and payload swap in under 15 minutes.'
  ]
WHERE NOT EXISTS (SELECT 1 FROM public.blogs WHERE title LIKE 'Saronic%');

INSERT INTO public.blogs (title, company, excerpt, content, category, badge, author, author_role, date, read_time, image, featured, published, views, takeaways)
SELECT 
  'The Art of the Swipe: How Intuitive Discovery Accelerates Pre-Seed Rounds from Weeks to Days',
  'CONNECTUP DISPATCH',
  'Why high-conviction early-stage syndication is shifting from closed country-club backrooms to high-velocity algorithmic discovery.',
  '<h2>The Paradigm Shift in Early-Stage Syndication</h2><p>Historically, early-stage allocations were restricted to private social circles in Sand Hill Road and Mayfair. As tech hubs expand across Austin, Nairobi, Lagos, Berlin, and Singapore, capital distribution must modernize at the speed of software.</p><p>Through ConnectUp''s curated discovery and dispatch architecture, vetted founders match directly with verified angels and institutional partners based on mandate alignment rather than geographic proximity.</p><blockquote>"Geography is no longer destiny for founders with verifiable velocity."</blockquote><h3>Key Drivers of the New Syndicate Model</h3><ul><li><strong>Speed to Term Sheet:</strong> Average founder time to first committed angel cheque dropped from 6 weeks to 8 days.</li><li><strong>Zero Gatekeeping:</strong> Transparent algorithmic scoring verifies proof of execution, customer traction, and code velocity.</li><li><strong>Collaborative Due Diligence:</strong> Co-investors review verified metrics, founder pitch decks, and live references in one unified room.</li></ul>',
  'Ecosystem & Market',
  'DISPATCH',
  'Alex Rivera',
  'Head of Platform',
  'Sep 28, 2026',
  '5 min read',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  false,
  true,
  '19.1k',
  ARRAY[
    'Founder time to first confirmed angel commitment decreased from an industry average of 42 days to just 8 days.',
    'Verified traction signals replace subjective warm intros, leveling the playing field for international builders.'
  ]
WHERE NOT EXISTS (SELECT 1 FROM public.blogs WHERE title LIKE 'The Art of the Swipe%');

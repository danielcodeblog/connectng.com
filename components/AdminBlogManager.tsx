import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Plus, Search, Filter, Edit3, Trash2, Eye, CheckCircle2, 
  XCircle, Clock, Globe, Lock, Share2, Copy, Check, ExternalLink, 
  Sparkles, RefreshCw, Layers, ArrowUpRight, ChevronRight, AlertCircle,
  Code, Database, Tag, Calendar, User, BookOpen, Star, HelpCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BlogPost } from '../types';
import { StorageService } from '../services/storageService';
import { BLOG_POSTS as DEFAULT_BLOG_POSTS } from './BlogPage';

interface AdminBlogManagerProps {
  onNavigateToPublicBlog?: () => void;
  showToast?: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

const CATEGORY_OPTIONS = [
  'Portfolio Exit',
  'Defense Tech',
  'AI Research',
  'Ecosystem & Market',
  'Founder Guides',
  'Engineering & Data',
  'Company News'
];

const PRESET_IMAGES = [
  { label: 'Founders & Investors', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Defense / Robotics', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI & Data Mesh', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Syndicate & Dealflow', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Golden Gate Tech Hub', url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=1200&q=80' }
];

export const SQL_SCHEMA_SCRIPT = `-- ==============================================================================
-- CONNECTUP: BLOGS TABLE & ADMIN ACCESS ROW-LEVEL SECURITY (RLS)
-- Run this script in the Supabase SQL Editor (or standard PostgreSQL)
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

-- 3. Trigger for automatic updated_at timestamp
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

-- Policy (A): Public and visitors can view published blogs
CREATE POLICY "Public can view published blogs"
ON public.blogs
FOR SELECT
USING (published = true);

-- Policy (B): Admins can view ALL blogs (including unpublished drafts)
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

-- Policy (C): Only Admins can insert new blogs
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

-- Policy (D): Only Admins can update blogs
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

-- Policy (E): Only Admins can delete blogs
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
);`;

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({ 
  onNavigateToPublicBlog, 
  showToast 
}) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('CONNECTUP');
  const [formCategory, setFormCategory] = useState('Ecosystem & Market');
  const [formBadge, setFormBadge] = useState('DISPATCH');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState('Editorial Team');
  const [formAuthorRole, setFormAuthorRole] = useState('Platform Contributor');
  const [formReadTime, setFormReadTime] = useState('4 min read');
  const [formImage, setFormImage] = useState(PRESET_IMAGES[0].url);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublished, setFormPublished] = useState(true);
  const [formTakeaways, setFormTakeaways] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBlogs = async () => {
    setIsRefreshing(true);
    try {
      const data = await StorageService.getBlogPosts();
      if (data && data.length > 0) {
        setBlogs(data);
      } else {
        // Fallback to defaults
        setBlogs(DEFAULT_BLOG_POSTS);
        try {
          localStorage.setItem('connectup_blogs_list', JSON.stringify(DEFAULT_BLOG_POSTS));
        } catch {}
      }
    } catch (e) {
      console.warn('Failed to load blogs:', e);
      setBlogs(DEFAULT_BLOG_POSTS);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filtered Blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter(post => {
      const matchSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === 'All' || post.category === categoryFilter;

      const isPublished = post.published !== false;
      const matchStatus = 
        statusFilter === 'All' || 
        (statusFilter === 'Published' && isPublished) || 
        (statusFilter === 'Draft' && !isPublished);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [blogs, searchQuery, categoryFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter(b => b.published !== false).length;
    const drafts = total - published;
    const featured = blogs.filter(b => b.featured).length;
    return { total, published, drafts, featured };
  }, [blogs]);

  // Form Handlers
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCompany('CONNECTUP DISPATCH');
    setFormCategory('Ecosystem & Market');
    setFormBadge('DISPATCH');
    setFormExcerpt('');
    setFormContent('<h2>Overview</h2>\n<p>Write your detailed article content here. You can use standard HTML formatting or clean prose.</p>');
    setFormAuthor('ConnectUp Editorial');
    setFormAuthorRole('Market Intelligence');
    setFormReadTime('4 min read');
    setFormImage(PRESET_IMAGES[0].url);
    setFormFeatured(false);
    setFormPublished(true);
    setFormTakeaways(['Key market trend observation', 'Quantifiable syndicate insight']);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setFormTitle(post.title);
    setFormCompany(post.company || 'CONNECTUP');
    setFormCategory(post.category);
    setFormBadge(post.badge || 'DISPATCH');
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormAuthor(post.author);
    setFormAuthorRole(post.authorRole || 'Contributor');
    setFormReadTime(post.readTime || '4 min read');
    setFormImage(post.image);
    setFormFeatured(!!post.featured);
    setFormPublished(post.published !== false);
    setFormTakeaways(post.takeaways && post.takeaways.length > 0 ? post.takeaways : ['']);
    setIsEditorOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast?.('Title Required', 'Please provide a headline for the blog article.', 'error');
      return;
    }

    setIsSubmitting(true);
    const cleanTakeaways = formTakeaways.map(t => t.trim()).filter(Boolean);

    try {
      if (editingId) {
        // Update existing
        await StorageService.updateBlogPost(editingId, {
          title: formTitle.trim(),
          company: formCompany.trim(),
          category: formCategory.trim(),
          badge: formBadge.trim().toUpperCase(),
          excerpt: formExcerpt.trim(),
          content: formContent.trim(),
          author: formAuthor.trim(),
          authorRole: formAuthorRole.trim(),
          readTime: formReadTime.trim(),
          image: formImage.trim(),
          featured: formFeatured,
          published: formPublished,
          takeaways: cleanTakeaways
        });
        showToast?.('Article Updated', `"${formTitle.slice(0, 30)}..." updated successfully.`, 'success');
      } else {
        // Create new
        await StorageService.createBlogPost({
          title: formTitle.trim(),
          company: formCompany.trim(),
          category: formCategory.trim(),
          badge: formBadge.trim().toUpperCase(),
          excerpt: formExcerpt.trim(),
          content: formContent.trim(),
          author: formAuthor.trim(),
          authorRole: formAuthorRole.trim(),
          readTime: formReadTime.trim(),
          image: formImage.trim(),
          featured: formFeatured,
          published: formPublished,
          takeaways: cleanTakeaways
        });
        showToast?.('Article Published', `"${formTitle.slice(0, 30)}..." created successfully.`, 'success');
      }

      await fetchBlogs();
      setIsEditorOpen(false);
    } catch (err: any) {
      console.error('Error saving blog post:', err);
      showToast?.('Save Failed', err.message || 'Could not save post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const nextState = post.published === false;
    try {
      await StorageService.togglePublishBlogPost(post.id, nextState);
      setBlogs(prev => prev.map(p => p.id === post.id ? { ...p, published: nextState } : p));
      showToast?.(
        nextState ? 'Article Published' : 'Article Moved to Draft',
        `"${post.title.slice(0, 30)}..." is now ${nextState ? 'public on /blog' : 'hidden from public view'}.`,
        'info'
      );
    } catch (err: any) {
      showToast?.('Failed to update status', err.message, 'error');
    }
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    const nextState = !post.featured;
    try {
      await StorageService.updateBlogPost(post.id, { featured: nextState });
      setBlogs(prev => prev.map(p => p.id === post.id ? { ...p, featured: nextState } : p));
      showToast?.(
        nextState ? 'Featured in Carousel' : 'Unfeatured',
        `"${post.title.slice(0, 30)}..." ${nextState ? 'will display in the hero banner' : 'removed from hero banner'}.`,
        'success'
      );
    } catch (err: any) {
      showToast?.('Failed to update featured', err.message, 'error');
    }
  };

  const handleDeletePost = async (id: string | number) => {
    try {
      await StorageService.deleteBlogPost(id);
      setBlogs(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
      showToast?.('Article Deleted', 'The blog article was removed permanently.', 'success');
    } catch (err: any) {
      showToast?.('Deletion Failed', err.message, 'error');
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopiedSql(true);
    showToast?.('SQL Copied to Clipboard', 'You can now paste and run this script in your Supabase SQL Editor.', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-400/20 text-amber-700 dark:text-amber-300 rounded-xl">
                <FileText size={20} className="stroke-[2.5]" />
              </span>
              <h2 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">
                Editorial & Blog Management
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">

            {/* Refresh */}
            <button
              onClick={fetchBlogs}
              disabled={isRefreshing}
              title="Refresh articles"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-amber-500' : ''} />
            </button>

            {/* View Public Blog */}
            {onNavigateToPublicBlog && (
              <button
                onClick={onNavigateToPublicBlog}
                className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Globe size={14} />
                <span>View Live Blog</span>
                <ArrowUpRight size={13} className="text-zinc-400" />
              </button>
            )}

            {/* Create Post Button */}
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Compose Article</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Total Posts</span>
            <div className="text-lg font-black text-zinc-900 dark:text-zinc-100 tabular-nums">{stats.total}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 dark:text-emerald-300">Published (Public)</span>
            <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums">{stats.published}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-300">Drafts (Hidden)</span>
            <div className="text-lg font-black text-amber-700 dark:text-amber-400 tabular-nums">{stats.drafts}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
            <span className="text-[10px] uppercase font-mono tracking-wider text-purple-700 dark:text-purple-300">Hero Featured</span>
            <div className="text-lg font-black text-purple-700 dark:text-purple-400 tabular-nums">{stats.featured}</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search articles by title, author, topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-xs"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Status selector */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shrink-0">
            {(['All', 'Published', 'Draft'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === s 
                    ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-amber-400 cursor-pointer shadow-xs"
          >
            <option value="All">All Categories</option>
            {CATEGORY_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles List / Table */}
      {isLoading ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
          <RefreshCw size={24} className="animate-spin text-amber-500 mx-auto mb-3" />
          <p className="text-xs text-zinc-500">Loading articles from database...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-12 text-center">
          <BookOpen size={32} className="text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No Articles Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || categoryFilter !== 'All' || statusFilter !== 'All'
              ? 'No articles match your active filter parameters. Try clearing the filters.'
              : 'No articles exist yet. Click below to compose your first article.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl hover:bg-amber-300 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            <span>Compose Article</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBlogs.map((post) => {
            const isPublished = post.published !== false;
            return (
              <div
                key={post.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-4 sm:p-5 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left Info with Image */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.featured && (
                      <span className="absolute top-1 left-1 bg-amber-400 text-zinc-950 p-1 rounded-md shadow-xs" title="Featured Hero Article">
                        <Star size={10} className="fill-zinc-950" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                        {post.company || 'CONNECTUP'}
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-700">·</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {post.category}
                      </span>
                      {/* Published / Draft Pill */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                        isPublished 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {isPublished ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 font-mono pt-0.5">
                      <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 font-semibold">
                        <User size={11} /> {post.author}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {post.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {post.readTime}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {post.views || '1.2k'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions Bar */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                  {/* Feature Toggle */}
                  <button
                    onClick={() => handleToggleFeatured(post)}
                    title={post.featured ? "Remove from Hero carousel" : "Feature in Hero carousel"}
                    className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      post.featured 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' 
                        : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Star size={15} className={post.featured ? 'fill-amber-500 text-amber-500' : ''} />
                  </button>

                  {/* Publish/Unpublish Toggle */}
                  <button
                    onClick={() => handleTogglePublish(post)}
                    title={isPublished ? "Unpublish (Make Draft)" : "Publish (Make Public)"}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                      isPublished 
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300' 
                        : 'border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {isPublished ? 'Live' : 'Draft'}
                  </button>

                  {/* Preview Button */}
                  <button
                    onClick={() => setPreviewPost(post)}
                    title="Preview Reader View"
                    className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <Eye size={15} />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(post)}
                    title="Edit Article"
                    className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <Edit3 size={15} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmId(post.id)}
                    title="Delete Article"
                    className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====================================================================== */}
      {/* COMPOSE / EDIT ARTICLE MODAL */}
      {/* ====================================================================== */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-amber-400 text-zinc-950 rounded-xl">
                    <Edit3 size={16} className="stroke-[2.5]" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-950 dark:text-white">
                      {editingId ? 'Edit Blog Article' : 'Compose New Article'}
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      {editingId ? `Editing Post ID: ${editingId}` : 'Admin authoring for public ConnectUp Blog'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body / Scrollable Form */}
              <form onSubmit={handleSavePost} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Article Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* Grid: Company tagline & Category & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Company / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {CATEGORY_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs uppercase font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Short Excerpt / Teaser
                  </label>
                  <textarea
                    rows={2}
                    placeholder=""
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Cover Image & Presets */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Cover Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder=""
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    {formImage && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
                        <img src={formImage} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Author Info & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Author Name
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Author Role / Title
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      placeholder=""
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(e.target.value)}
                      className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Key Takeaways */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Key Takeaways (Executive Summary Bullets)
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormTakeaways([...formTakeaways, ''])}
                      className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Add Bullet
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-400 w-4 text-right">{idx + 1}.</span>
                        <input
                          type="text"
                          placeholder=""
                          value={takeaway}
                          onChange={(e) => {
                            const updated = [...formTakeaways];
                            updated[idx] = e.target.value;
                            setFormTakeaways(updated);
                          }}
                          className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400"
                        />
                        {formTakeaways.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setFormTakeaways(formTakeaways.filter((_, i) => i !== idx))}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-md"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Article Content / HTML / Markdown Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Article Body (Supports HTML & Paragraphs)
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFormContent(prev => prev + '\n<h2>Section Heading</h2>')}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
                      >
                        + H2
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormContent(prev => prev + '\n<p>New paragraph text...</p>')}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
                      >
                        + Paragraph
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormContent(prev => prev + '\n<blockquote>"Quote from founder or leader"</blockquote>')}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
                      >
                        + Quote
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={8}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Toggles: Featured & Published */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {/* Published Switch */}
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formPublished}
                        onChange={(e) => setFormPublished(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          Publish Article
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {formPublished ? 'Visible to all visitors on /blog' : 'Save as private draft only'}
                        </div>
                      </div>
                    </label>

                    {/* Featured Switch */}
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" /> Featured Article
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          Display in Hero Slider on blog landing page
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Modal Footer / Save Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting && <RefreshCw size={13} className="animate-spin" />}
                    <span>{editingId ? 'Update Article' : 'Publish Article'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================================== */}
      {/* SQL SCHEMA & SETUP MODAL */}
      {/* ====================================================================== */}
      <AnimatePresence>
        {isSqlModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-amber-400 text-zinc-950 rounded-xl">
                    <Database size={18} className="stroke-[2.5]" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-950 dark:text-white">
                      PostgreSQL / Supabase SQL Schema
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Blogs table definition with Admin-only Row Level Security (RLS) policies
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSqlModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-start gap-3">
                  <Sparkles size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <p className="font-bold">How to apply this schema:</p>
                    <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-amber-800 dark:text-amber-300">
                      <li>Copy the SQL script below with 1-click.</li>
                      <li>Open your <strong>Supabase Dashboard</strong> &rarr; <strong>SQL Editor</strong> &rarr; <strong>New query</strong>.</li>
                      <li>Paste and hit <strong>Run</strong>.</li>
                      <li>
                        Public visitors can SELECT published articles, while only users with <code className="bg-amber-200/50 dark:bg-amber-900/50 px-1 rounded">role = &apos;ADMIN&apos;</code> in <code className="bg-amber-200/50 dark:bg-amber-900/50 px-1 rounded">public.profiles</code> can INSERT, UPDATE, or DELETE articles.
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Code Window */}
                <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100">
                  <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-400">blogs_schema.sql</span>
                    <button
                      onClick={handleCopySql}
                      className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {copiedSql ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[380px] text-amber-100/90 select-all">
                    {SQL_SCHEMA_SCRIPT}
                  </pre>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">
                  Saved locally in file: <code className="font-bold text-zinc-700 dark:text-zinc-300">/blogs_schema.sql</code>
                </span>
                <button
                  onClick={() => setIsSqlModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================================== */}
      {/* ARTICLE PREVIEW MODAL */}
      {/* ====================================================================== */}
      <AnimatePresence>
        {previewPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-600">
                    Reader Preview
                  </span>
                  <span className="text-zinc-400">·</span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {previewPost.published !== false ? 'Published (Live)' : 'Draft (Admin Only)'}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewPost(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100">
                  <img src={previewPost.image} alt={previewPost.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 text-amber-800 dark:text-amber-300">
                      {previewPost.badge || previewPost.category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">{previewPost.date}</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-xs text-zinc-400 font-mono">{previewPost.readTime}</span>
                  </div>

                  <h1 className="text-2xl font-black text-zinc-950 dark:text-white leading-tight">
                    {previewPost.title}
                  </h1>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                    {previewPost.excerpt}
                  </p>
                </div>

                {/* Takeaways */}
                {previewPost.takeaways && previewPost.takeaways.length > 0 && (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Executive Takeaways</h4>
                    <ul className="space-y-1.5">
                      {previewPost.takeaways.map((t, idx) => (
                        <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Content */}
                <div 
                  className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-3"
                  dangerouslySetInnerHTML={{ __html: previewPost.content }}
                />
              </div>

              <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const postToEdit = previewPost;
                    setPreviewPost(null);
                    handleOpenEdit(postToEdit);
                  }}
                  className="px-4 py-2 bg-amber-400 text-zinc-950 text-xs font-bold rounded-xl hover:bg-amber-300 cursor-pointer"
                >
                  Edit Article
                </button>
                <button
                  onClick={() => setPreviewPost(null)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ====================================================================== */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  <Trash2 size={20} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">Delete Blog Article?</h3>
                  <p className="text-xs text-zinc-500">This action cannot be undone and deletes the post permanently.</p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

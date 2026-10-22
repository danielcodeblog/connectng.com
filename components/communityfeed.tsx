import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StorageService } from '../services/storageService';
import { CommunityPost, UserRole } from '../types';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  PlusSquare, Play, Volume2, VolumeX, Loader2, 
  UserPlus, UserCheck, Trash2, ChevronLeft, ChevronRight, X,
  Image as ImageIcon, Plus, Check, RotateCcw,
  Settings, BarChart2, Smile, Share2, Repeat2,
  Shield, Globe, Target, Quote, Hash,
  Award, HeartHandshake, Radio, Users,
  ArrowRight, ShieldCheck, Zap, Compass, Filter, Building2, Briefcase,
  Pencil, Camera, Palette, Maximize2, ExternalLink, ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VentureConnections } from './VentureConnections';
import { CreatePostModal } from './CreatePostModal';
import { CommunityCharterModal } from './community/CommunityCharterModal';
import { CommunityExchange } from './community/CommunityExchange';
import { CommunityTownHall } from './community/CommunityTownHall';
import { CommunityMilestones } from './community/CommunityMilestones';
import { CommunitySpotlight } from './community/CommunitySpotlight';
import { CustomizeBannerModal, BannerConfig } from './community/CustomizeBannerModal';
import { ThemePickerModal } from './community/ThemePickerModal';
import { 
  COMMUNITY_THEMES, 
  getStoredCommunityTheme, 
  saveCommunityTheme, 
  CommunityThemeConfig, 
  CommunityThemeId 
} from './community/communityTheme';

import pavilionHeroImg from '../src/assets/images/community_pavilion_hero_1791197922330.jpg';

interface CommunityFeedProps {
  userProfile: any;
  onMessage?: (authorId: string) => void;
  onViewProfile?: (userId: string) => void;
  refreshTrigger?: number;
  onAddPost?: () => void;
  onQuotePost?: (post: CommunityPost) => void;
  initialTab?: 'for-you' | 'following' | 'bookmarks' | 'profile';
  onModalStateChange?: (isOpen: boolean) => void;
}

type CommunityMode = 'dispatches' | 'exchange' | 'townhall' | 'milestones';

const CommunityFeed: React.FC<CommunityFeedProps> = ({ 
  userProfile, 
  onMessage, 
  onViewProfile,
  refreshTrigger = 0,
  onAddPost,
  onQuotePost,
  initialTab = 'for-you',
  onModalStateChange
}) => {
  const [communityMode, setCommunityMode] = useState<CommunityMode>('dispatches');
  const [feedSubTab, setFeedSubTab] = useState<'for-you' | 'following' | 'bookmarks'>('for-you');
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  // User Customizable Banner State
  const DEFAULT_BANNER: BannerConfig = {
    imageUrl: pavilionHeroImg,
    tag: 'ConnectUp Ecosystem',
    title: 'Where Visionaries Exchange Conviction',
    subtitle: 'Share unvarnished war stories, trade customer intros, and build authentic founder & investor relationships with zero gatekeeping.',
  };

  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(() => {
    try {
      const saved = localStorage.getItem('connectup_custom_community_banner');
      if (saved) {
        return { ...DEFAULT_BANNER, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_BANNER;
  });

  const [isCustomizeBannerOpen, setIsCustomizeBannerOpen] = useState(false);

  // Community Theme State (Defaults to Stealth Slate - strictly non-purple)
  const [currentTheme, setCurrentTheme] = useState<CommunityThemeConfig>(() => getStoredCommunityTheme());
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const handleSelectTheme = (themeId: CommunityThemeId) => {
    const newTheme = COMMUNITY_THEMES[themeId] || COMMUNITY_THEMES.slate;
    setCurrentTheme(newTheme);
    saveCommunityTheme(themeId);
  };

  const handleSaveBanner = (newConfig: BannerConfig) => {
    setBannerConfig(newConfig);
    try {
      localStorage.setItem('connectup_custom_community_banner', JSON.stringify(newConfig));
    } catch {}
  };

  const handleResetBanner = () => {
    setBannerConfig(DEFAULT_BANNER);
    try {
      localStorage.removeItem('connectup_custom_community_banner');
    } catch {}
  };

  // Pledge state
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [isPledged, setIsPledged] = useState<boolean>(() => {
    try {
      return localStorage.getItem('connectup_community_pledge_signed') === 'true';
    } catch {
      return false;
    }
  });

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pull to refresh
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startTouchY = useRef(0);
  const PULL_THRESHOLD = 80;

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<{commentId: string, postId: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({});
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [postMenuOpen, setPostMenuOpen] = useState<string | null>(null);

  // Quick Composer
  const [quickPostContent, setQuickPostContent] = useState('');
  const [quickSelectedImage, setQuickSelectedImage] = useState<File | null>(null);
  const [quickImagePreview, setQuickImagePreview] = useState<string | null>(null);
  const [isQuickPosting, setIsQuickPosting] = useState(false);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Reports
  const [reportPost, setReportPost] = useState<any | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Optimistic tracking
  const [reposts, setReposts] = useState<Record<string, number>>({});
  const [reposted, setReposted] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  // Topics
  const [topics, setTopics] = useState<string[]>([]);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [activeTopicModal, setActiveTopicModal] = useState<string | null>(null);
  const [showPavilionHero, setShowPavilionHero] = useState<boolean>(() => {
    try {
      return localStorage.getItem('connectup_hide_pavilion_hero') !== 'true';
    } catch {
      return true;
    }
  });

  // Wide Image Lightbox Modal State
  const [viewingImage, setViewingImage] = useState<{
    url: string;
    caption?: string;
    author?: string;
  } | null>(null);

  // Keyboard listener for Escape key to close image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewingImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if any popup or modal is open to hide mobile navigation temporarily
  const isAnyModalOpen = Boolean(
    isCustomizeBannerOpen ||
    isThemePickerOpen ||
    isCharterOpen ||
    viewingImage ||
    reportPost ||
    postToDelete ||
    commentToDelete ||
    showAddTopicModal ||
    activeTopicModal ||
    isExchangeModalOpen ||
    isMilestoneModalOpen
  );

  useEffect(() => {
    onModalStateChange?.(isAnyModalOpen);
  }, [isAnyModalOpen, onModalStateChange]);

  useEffect(() => {
    return () => {
      onModalStateChange?.(false);
    };
  }, [onModalStateChange]);

  // Load user & topics
  useEffect(() => {
    StorageService.getCurrentUserId().then(id => setCurrentUserId(id));
    StorageService.getCommunityTopics().then(dbTopics => setTopics(dbTopics));
  }, []);

  // Handle initial tab
  useEffect(() => {
    if (initialTab === 'bookmarks') {
      setCommunityMode('dispatches');
      setFeedSubTab('bookmarks');
    }
  }, [initialTab]);

  const loadPosts = useCallback(async (pageNum: number = 0, isRefresh: boolean = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else if (pageNum === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const fetched = await StorageService.getCommunityPosts(pageNum, 15);
      if (pageNum === 0) {
        setPosts(fetched);
      } else {
        setPosts(prev => [...prev, ...fetched]);
      }
      setHasMore(fetched.length === 15);
    } catch (err) {
      console.error('Error loading community posts:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    loadPosts(0);
  }, [refreshTrigger, selectedTag, loadPosts]);

  const handleRefresh = useCallback(() => {
    setPage(0);
    loadPosts(0, true);
  }, [loadPosts]);

  // Touch handlers for pull to refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startTouchY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startTouchY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.4, 120));
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    setIsPulling(false);
    if (pullDistance >= PULL_THRESHOLD) {
      handleRefresh();
    }
    setPullDistance(0);
  };

  // Add / Remove topics
  const handleAddTopic = async (topicName: string) => {
    const clean = topicName.trim().replace(/^#/, '');
    if (!clean) return;
    const updated = await StorageService.addCommunityTopic(clean);
    setTopics(updated);
    setSelectedTag(clean);
    setShowAddTopicModal(false);
    setNewTopicInput('');
  };

  const handleRemoveTopic = async (e: React.MouseEvent, topicToRemove: string) => {
    e.stopPropagation();
    const updated = await StorageService.deleteCommunityTopic(topicToRemove);
    setTopics(updated);
    if (selectedTag?.toLowerCase() === topicToRemove.toLowerCase()) {
      setSelectedTag(null);
    }
  };

  // Like / Applaud
  const handleLike = async (postId: string, currentLiked: boolean, currentCount: number) => {
    const nextLiked = !currentLiked;
    const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

    // Optimistic UI
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: nextLiked, likes: nextCount };
      }
      return p;
    }));

    try {
      await StorageService.likePost(postId, nextLiked);
    } catch (err) {
      // Revert if error
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, isLiked: currentLiked, likes: currentCount };
        }
        return p;
      }));
    }
  };

  // Follow author
  const handleFollow = async (authorId: string, currentFollowing: boolean = false) => {
    const nextState = !currentFollowing;
    setPosts(prev => prev.map(p => {
      if (p.authorId === authorId) {
        return { ...p, isFollowingAuthor: nextState };
      }
      return p;
    }));

    try {
      if (nextState) {
        await StorageService.followUser(authorId);
      } else {
        await StorageService.unfollowUser(authorId);
      }
    } catch (err) {
      setPosts(prev => prev.map(p => {
        if (p.authorId === authorId) {
          return { ...p, isFollowingAuthor: currentFollowing };
        }
        return p;
      }));
    }
  };

  // Bookmark
  const handleBookmark = (postId: string) => {
    setBookmarked(prev => {
      const next = !prev[postId];
      return { ...prev, [postId]: next };
    });
  };

  // Repost
  const handleRepost = (post: CommunityPost) => {
    setReposted(prev => ({ ...prev, [post.id]: !prev[post.id] }));
    setReposts(prev => ({
      ...prev,
      [post.id]: (prev[post.id] || post.reposts || 0) + (reposted[post.id] ? -1 : 1)
    }));
  };

  // Delete Post
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const success = await StorageService.deleteCommunityPost(postToDelete);
      if (success) {
        setPosts(prev => prev.filter(p => p.id !== postToDelete));
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  // Comments
  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    setIsSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      const result = await StorageService.addCommentToPost(postId, content, userProfile);
      if (result.success && result.comment) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: p.comments + 1,
              commentsList: [result.comment!, ...(p.commentsList || [])]
            };
          }
          return p;
        }));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);
    try {
      const { commentId, postId } = commentToDelete;
      const success = await StorageService.deleteCommunityComment(commentId);
      if (success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              comments: Math.max(0, p.comments - 1),
              commentsList: (p.commentsList || []).filter(c => c.id !== commentId)
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    } finally {
      setIsDeleting(false);
      setCommentToDelete(null);
    }
  };

  // Quick Post Creation
  const handleQuickImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuickSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuickImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateQuickPost = async () => {
    if (!quickPostContent.trim() && !quickSelectedImage) return;
    setIsQuickPosting(true);
    try {
      const extractedTags = Array.from(quickPostContent.matchAll(/#([\w-]+)/g)).map(m => m[1]);
      if (selectedTag && !extractedTags.includes(selectedTag)) {
        extractedTags.push(selectedTag);
      }

      const { success, post } = await StorageService.createCommunityPost(
        quickPostContent,
        extractedTags,
        {
          name: userProfile?.name || 'Fellow',
          title: userProfile?.title || 'Ecosystem Member',
          avatarUrl: userProfile?.avatarUrl,
        },
        quickSelectedImage || undefined
      );

      if (success && post) {
        setPosts(prev => [post, ...prev]);
        setQuickPostContent('');
        setQuickSelectedImage(null);
        setQuickImagePreview(null);
      }
    } catch (err) {
      console.error('Error creating quick post:', err);
    } finally {
      setIsQuickPosting(false);
    }
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (feedSubTab === 'following' && !p.isFollowingAuthor) return false;
      if (feedSubTab === 'bookmarks' && !bookmarked[p.id] && !p.isBookmarked) return false;

      if (selectedTag) {
        const tagLower = selectedTag.toLowerCase();
        const hasTagInArray = p.tags?.some(t => t.toLowerCase() === tagLower);
        const hasTagInContent = p.content?.toLowerCase().includes(`#${tagLower}`);
        return hasTagInArray || hasTagInContent;
      }
      return true;
    });
  }, [posts, feedSubTab, selectedTag, bookmarked]);

  return (
    <div className={`flex justify-start items-start w-full max-w-full min-h-screen gap-x-5 lg:gap-x-7 ${currentTheme.bgPageClass} font-sans text-zinc-950 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900 pl-2 sm:pl-4 pr-2 sm:pr-4 relative transition-colors duration-300`}>
      
      {/* Dynamic Ambient Background Atmosphere Glow (Theme-driven, strictly non-purple) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 opacity-80" 
        style={{ background: currentTheme.ambientGradientDark }}
        aria-hidden="true"
      />

      {/* ========================================================
          LEFT SIDEBAR: Curated Topics & Fellowship Directory
         ======================================================== */}
      <div className="hidden lg:flex flex-col w-[280px] xl:w-[310px] shrink-0 sticky top-4 self-start h-fit max-h-[calc(100vh-32px)] py-4 px-1 overflow-y-auto no-scrollbar order-1 space-y-4 z-30">
        
        {/* Collective Identity Badge */}
        <div className={`p-5 rounded-3xl ${currentTheme.bgSurfaceClass} shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-3 transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <span 
              className="text-[11px] font-mono uppercase tracking-wider font-bold"
              style={{ color: currentTheme.primaryHex }}
            >
              The Collective
            </span>
            {isPledged && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Pledged</span>
              </span>
            )}
          </div>
          <h3 className="font-serif font-bold text-lg text-zinc-950 dark:text-white leading-tight">
            ConnectUp Fellowship
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
            A high-conviction alliance of 4,280+ founders, angels, and operators building together.
          </p>

          <button
            onClick={() => setIsCharterOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: currentTheme.primaryHex }} />
            <span>{isPledged ? 'Review Covenant' : 'Sign Founder Covenant'}</span>
          </button>
        </div>

        {/* Discussion Topics */}
        <div className={`p-5 rounded-3xl ${currentTheme.bgSurfaceClass} shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4 transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" style={{ color: currentTheme.primaryHex }} />
              <h4 className="font-display font-bold text-sm text-zinc-950 dark:text-white">Topics</h4>
            </div>
            <button
              onClick={() => setShowAddTopicModal(true)}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Add a discussion topic"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedTag && (
            <div 
              className="flex items-center justify-between rounded-xl px-3 py-1.5 text-xs border"
              style={{ 
                backgroundColor: `${currentTheme.primaryHex}15`,
                borderColor: `${currentTheme.primaryHex}35`
              }}
            >
              <span className="font-bold text-zinc-900 dark:text-white truncate">
                #{selectedTag}
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-xs font-bold hover:underline cursor-pointer ml-2"
                style={{ color: currentTheme.primaryHex }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Clean Segmented Buttons for Topics (Zero-Pill discipline) */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                !selectedTag
                  ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs font-bold'
                  : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 border-zinc-200/70 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              All Topics
            </button>

            {topics.map(topic => {
              const isSelected = selectedTag?.toLowerCase() === topic.toLowerCase();
              return (
                <div
                  key={topic}
                  onClick={() => setSelectedTag(isSelected ? null : topic)}
                  className={`group px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'text-white font-bold shadow-xs border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 border-zinc-200/70 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  style={isSelected ? {
                    background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.secondaryHex})`
                  } : undefined}
                >
                  <span>#{topic}</span>
                  <button
                    onClick={(e) => handleRemoveTopic(e, topic)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
                    title={`Remove #${topic}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================
          MAIN LANE: Top Bar Contract + Pavilion + Dynamic Feed
         ======================================================== */}
      <div 
        className={`w-full max-w-[720px] xl:max-w-[760px] flex flex-col ${currentTheme.bgMainLaneClass} min-h-screen relative border-x order-2 animate-in fade-in duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.02)] z-10 transition-colors duration-300`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sticky Top Bar Contract: 3 zones */}
        <div className={`sticky top-0 z-40 ${currentTheme.bgHeaderClass} backdrop-blur-2xl border-b shrink-0 w-full overflow-hidden transition-colors duration-300`}>
          
          {/* Main Top Navigation Row */}
          <div className="px-5 py-3.5 flex items-center justify-between gap-3">
            {/* Zone 1: Logo and brand wordmark */}
            <div className="flex items-center gap-2.5">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 200 200" 
                className="w-7 h-7 select-none shrink-0 drop-shadow-xs"
              >
                <defs>
                  <radialGradient id="left-node-radial-comm" cx="32%" cy="32%" r="68%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="65%" stopColor="#E4E4E7" />
                    <stop offset="100%" stopColor="#A1A1AA" />
                  </radialGradient>
                  <radialGradient id="right-node-radial-comm" cx="32%" cy="32%" r="68%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="55%" stopColor="#EAB308" />
                    <stop offset="100%" stopColor="#854D0E" />
                  </radialGradient>
                  <linearGradient id="connector-grad-comm" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E4E4E7" />
                    <stop offset="25%" stopColor="#FFFFFF" />
                    <stop offset="70%" stopColor="#FDE047" />
                    <stop offset="100%" stopColor="#EAB308" />
                  </linearGradient>
                </defs>
                <path d="M 60 140 Q 100 60 140 60" fill="none" stroke="url(#connector-grad-comm)" strokeWidth="18" strokeLinecap="round" />
                <circle cx="60" cy="140" r="36" fill="url(#left-node-radial-comm)" />
                <circle cx="140" cy="60" r="36" fill="url(#right-node-radial-comm)" />
              </svg>
              <h1 className="text-xl font-serif font-black tracking-tight text-zinc-950 dark:text-zinc-50 select-none">
                Connect<span className="text-amber-400">Up</span>
              </h1>
            </div>

            {/* Zone 3: Primary Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Picker Trigger */}
              <button
                onClick={() => setIsThemePickerOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-200 cursor-pointer active:scale-95 shadow-2xs"
                title={`Change Community Theme (Current: ${currentTheme.name})`}
              >
                <span 
                  className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10 shrink-0 shadow-2xs" 
                  style={{ background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.secondaryHex})` }}
                />
                <Palette className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          </div>

          {/* Navigation Modes Segmented Bar (Posts, Exchange, Circles, Town Hall, Milestones) */}
          <div className="px-5 py-2 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setCommunityMode('dispatches')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  communityMode === 'dispatches'
                    ? 'text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
                style={communityMode === 'dispatches' ? {
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.secondaryHex})`
                } : undefined}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Posts</span>
              </button>

              <button
                onClick={() => setCommunityMode('exchange')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  communityMode === 'exchange'
                    ? 'text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
                style={communityMode === 'exchange' ? {
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.secondaryHex})`
                } : undefined}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>The Exchange</span>
              </button>

              <button
                onClick={() => setCommunityMode('milestones')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  communityMode === 'milestones'
                    ? 'text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
                style={communityMode === 'milestones' ? {
                  background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.secondaryHex})`
                } : undefined}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Wins & Milestones</span>
              </button>

            </div>

            {/* Sub-filtering if in Dispatches mode */}
            {communityMode === 'dispatches' && (
              <div className="flex items-center gap-1 shrink-0 border-l border-zinc-200 dark:border-zinc-800 pl-2">
                <button
                  onClick={() => setFeedSubTab('for-you')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    feedSubTab === 'for-you' ? 'font-bold' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                  style={feedSubTab === 'for-you' ? { color: currentTheme.primaryHex } : undefined}
                >
                  All
                </button>
                <button
                  onClick={() => setFeedSubTab('following')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    feedSubTab === 'following' ? 'font-bold' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                  style={feedSubTab === 'following' ? { color: currentTheme.primaryHex } : undefined}
                >
                  Following
                </button>
                <button
                  onClick={() => setFeedSubTab('bookmarks')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    feedSubTab === 'bookmarks' ? 'font-bold' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                  style={feedSubTab === 'bookmarks' ? { color: currentTheme.primaryHex } : undefined}
                >
                  Saved
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Pavilion Body Content */}
        <div 
          className="flex flex-col w-full h-full pb-32"
          style={{ 
            transform: isPulling ? `translateY(${pullDistance}px)` : (isRefreshing ? `translateY(${PULL_THRESHOLD}px)` : 'none'), 
            transition: isPulling ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {/* Pull to refresh spinner */}
          <div className="absolute top-0 left-0 w-full h-[80px] -translate-y-full flex items-center justify-center pointer-events-none">
            {isRefreshing ? (
              <RotateCcw className="w-5 h-5 text-amber-500 animate-spin" />
            ) : (
              <div 
                className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shadow-sm text-zinc-400"
                style={{ transform: `rotate(${Math.min(pullDistance * 3, 180)}deg)` }}
              >
                <RotateCcw className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* DYNAMIC MODE RENDERING */}
          <AnimatePresence mode="wait">
            {communityMode === 'exchange' && (
              <motion.div
                key="exchange"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 sm:p-6"
              >
                <CommunityExchange 
                  userProfile={userProfile}
                  theme={currentTheme}
                  onMessage={onMessage}
                  onViewProfile={onViewProfile}
                  onModalStateChange={setIsExchangeModalOpen}
                />
              </motion.div>
            )}

            {communityMode === 'townhall' && (
              <motion.div
                key="townhall"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 sm:p-6"
              >
                <CommunityTownHall 
                  userProfile={userProfile} 
                  theme={currentTheme}
                />
              </motion.div>
            )}

            {communityMode === 'milestones' && (
              <motion.div
                key="milestones"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 sm:p-6"
              >
                <CommunityMilestones 
                  userProfile={userProfile}
                  theme={currentTheme}
                  onMessage={onMessage}
                  onViewProfile={onViewProfile}
                  onModalStateChange={setIsMilestoneModalOpen}
                />
              </motion.div>
            )}

            {communityMode === 'dispatches' && (
              <motion.div
                key="dispatches"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Inline Quick Dispatch Composer */}
              <div className={`p-5 border-b border-zinc-200/70 dark:border-zinc-800/80 ${currentTheme.bgComposerClass} transition-colors duration-300`}>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                    {userProfile?.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-zinc-500">
                        {userProfile?.name?.[0] || 'U'}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <textarea
                      id="quick-post-textarea"
                      rows={2}
                      value={quickPostContent}
                      onChange={(e) => setQuickPostContent(e.target.value)}
                      placeholder="Share a milestone, request an intro, or post an update..."
                      className="w-full bg-transparent text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none resize-none font-sans"
                    />

                    {quickImagePreview && (
                      <div 
                        onClick={() => setViewingImage({
                          url: quickImagePreview,
                          caption: quickPostContent ? (quickPostContent.length > 80 ? quickPostContent.substring(0, 80) + '...' : quickPostContent) : 'Attachment Preview',
                          author: userProfile?.name || 'Your Dispatch Draft'
                        })}
                        className="group relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-56 w-fit cursor-pointer"
                        title="Click picture to view wide"
                      >
                        <img src={quickImagePreview} alt="Preview" className="h-44 w-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 border border-white/20">
                            <Maximize2 className="w-3 h-3 text-amber-400" />
                            <span>View Wide</span>
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickSelectedImage(null);
                            setQuickImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 cursor-pointer z-10 transition-colors"
                          title="Remove attached image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2.5 border-t border-zinc-200/50 dark:border-zinc-800/50">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={quickFileInputRef}
                          onChange={handleQuickImageSelect}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => quickFileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-all cursor-pointer font-medium text-xs active:scale-95"
                          title="Attach Photo"
                        >
                          <ImageIcon className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="text-xs font-semibold">{quickSelectedImage ? 'Photo Attached' : 'Photo'}</span>
                        </button>

                        {selectedTag && (
                          <span 
                            className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"
                            style={{ 
                              color: currentTheme.primaryHex,
                              backgroundColor: `${currentTheme.primaryHex}18`
                            }}
                          >
                            <span>#{selectedTag}</span>
                            <button 
                              onClick={() => setSelectedTag(null)}
                              className="hover:opacity-70 cursor-pointer ml-0.5"
                              title="Clear tag filter"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleCreateQuickPost}
                        disabled={isQuickPosting || (!quickPostContent.trim() && !quickSelectedImage)}
                        className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs disabled:opacity-40 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 text-white"
                        style={{ 
                          background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.secondaryHex})` 
                        }}
                      >
                        {isQuickPosting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <span>Post</span>
                            <Send className="w-3 h-3 fill-current" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && posts.length === 0 && (
                <div className="flex items-center justify-center py-20 text-zinc-400">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              )}

              {/* Timeline of Posts */}
              <div className="divide-y divide-zinc-150 dark:divide-zinc-800/80">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => {
                    const isLiked = !!post.isLiked;
                    const isBookmarked = !!bookmarked[post.id] || !!post.isBookmarked;

                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className={`p-5 sm:p-6 ${currentTheme.bgSurfaceHoverClass} transition-colors flex gap-4`}
                      >
                        {/* Left column: Avatar */}
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            onClick={() => onViewProfile && onViewProfile(post.authorId)}
                            className="w-11 h-11 rounded-full overflow-hidden cursor-pointer relative bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 shadow-xs ring-2 ring-zinc-100 dark:ring-zinc-800/60"
                          >
                            {post.avatar ? (
                              <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-sm">
                                {post.author?.[0] || 'U'}
                              </div>
                            )}
                          </div>
                          {post.authorVerified && (
                            <div className="mt-1.5" title="Verified Ecosystem Fellow">
                              <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3.5]" />
                            </div>
                          )}
                        </div>

                        {/* Right column: Content + Actions */}
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Header unboxed metadata line */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 text-xs sm:text-sm">
                              <span
                                onClick={() => onViewProfile && onViewProfile(post.authorId)}
                                className="font-bold text-zinc-950 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 hover:underline cursor-pointer truncate"
                              >
                                {post.author || 'Ecosystem Member'}
                              </span>

                              <span className="text-zinc-300 dark:text-zinc-600" aria-hidden="true">·</span>

                              <span className="text-zinc-400 text-xs font-mono font-normal">
                                {post.time}
                              </span>

                              {currentUserId !== post.authorId && (
                                <>
                                  <span className="text-zinc-300 dark:text-zinc-600" aria-hidden="true">·</span>
                                  <button
                                    onClick={() => handleFollow(post.authorId, post.isFollowingAuthor)}
                                    className={`text-xs font-bold transition-colors cursor-pointer ${
                                      post.isFollowingAuthor
                                        ? 'text-zinc-400 hover:text-red-500'
                                        : 'text-amber-500 hover:text-amber-400'
                                    }`}
                                  >
                                    {post.isFollowingAuthor ? 'Following' : 'Follow'}
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Post menu */}
                            <div className="relative">
                              <button
                                onClick={() => setPostMenuOpen(postMenuOpen === post.id ? null : post.id)}
                                className="w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer"
                              >
                                <MoreHorizontal size={16} />
                              </button>

                              {postMenuOpen === post.id && (
                                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1 z-50">
                                  {currentUserId === post.authorId ? (
                                    <button
                                      onClick={() => {
                                        setPostToDelete(post.id);
                                        setPostMenuOpen(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Trash2 size={13} /> Delete
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setReportPost(post);
                                        setReportReason('');
                                        setPostMenuOpen(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 cursor-pointer"
                                    >
                                      <Shield size={13} /> Report
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Post Content */}
                          <p className="text-xs sm:text-[14px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
                            {post.content}
                          </p>

                          {/* Image Attachment - Click to view wide */}
                          {post.imageUrl && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingImage({
                                  url: post.imageUrl!,
                                  caption: post.content ? (post.content.length > 90 ? post.content.substring(0, 90) + '...' : post.content) : 'Dispatch Attachment',
                                  author: post.author
                                });
                              }}
                              className="group relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 max-h-80 w-fit mt-2 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                              title="Click picture to view wide"
                            >
                              <img
                                src={post.imageUrl}
                                alt="Dispatch attachment"
                                className="w-full h-auto object-cover max-h-80 transition-transform duration-300 group-hover:scale-[1.02]"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 border border-white/20 shadow-lg translate-y-1 group-hover:translate-y-0">
                                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                                  <span>View Wide</span>
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Unboxed tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 font-medium pt-1">
                              {post.tags.map(t => (
                                <span
                                  key={t}
                                  onClick={() => setSelectedTag(t)}
                                  className="hover:text-amber-500 cursor-pointer"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action controls row */}
                          <div className="pt-2 flex items-center justify-between text-zinc-500 max-w-md">
                            {/* Applaud / Like */}
                            <button
                              onClick={() => handleLike(post.id, !!post.isLiked, post.likes)}
                              className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer group ${
                                isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                              }`}
                            >
                              <div className="p-1.5 rounded-lg group-hover:bg-rose-500/10">
                                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                              </div>
                              <span className="font-mono tabular-nums">{post.likes}</span>
                            </button>

                            {/* Replies */}
                            <button
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer group hover:text-amber-500"
                            >
                              <div className="p-1.5 rounded-lg group-hover:bg-amber-500/10">
                                <MessageCircle size={16} />
                              </div>
                              <span className="font-mono tabular-nums">{post.comments}</span>
                            </button>

                            {/* Repost / Quote */}
                            <button
                              onClick={() => onQuotePost ? onQuotePost(post) : handleRepost(post)}
                              className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer group ${
                                reposted[post.id] ? 'text-emerald-500 font-bold' : 'hover:text-emerald-500'
                              }`}
                            >
                              <div className="p-1.5 rounded-lg group-hover:bg-emerald-500/10">
                                <Repeat2 size={16} />
                              </div>
                              <span className="font-mono tabular-nums">{reposts[post.id] || post.reposts || 0}</span>
                            </button>

                            {/* Bookmark */}
                            <button
                              onClick={() => handleBookmark(post.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isBookmarked ? 'text-amber-500 bg-amber-400/10' : 'hover:text-amber-500'
                              }`}
                              title="Bookmark signal"
                            >
                              <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                            </button>

                            {/* Direct Message Author */}
                            {currentUserId !== post.authorId && onMessage && (
                              <button
                                onClick={() => onMessage(post.authorId)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                                title="Message Author Privately"
                              >
                                <Send size={15} />
                              </button>
                            )}
                          </div>

                          {/* Expanded Comments Thread */}
                          <AnimatePresence>
                            {expandedComments[post.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pt-3 space-y-3"
                              >
                                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#151518] border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                                  {post.commentsList && post.commentsList.length > 0 ? (
                                    <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar">
                                      {post.commentsList.map(comment => (
                                        <div key={comment.id} className="flex gap-2.5 text-left pt-2 first:pt-0">
                                          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                                            {comment.avatar ? (
                                              <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-500">
                                                {comment.author?.[0] || 'U'}
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-1.5 text-[11px]">
                                                <span className="font-bold text-zinc-950 dark:text-white">{comment.author}</span>
                                                <span className="text-zinc-400">·</span>
                                                <span className="text-zinc-400 font-mono">{comment.time}</span>
                                              </div>
                                              {currentUserId === comment.authorId && (
                                                <button
                                                  onClick={() => setCommentToDelete({ commentId: comment.id, postId: post.id })}
                                                  className="text-zinc-400 hover:text-red-500 cursor-pointer p-0.5"
                                                >
                                                  <Trash2 size={11} />
                                                </button>
                                              )}
                                            </div>
                                            <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-0.5 leading-relaxed">
                                              {comment.content}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-zinc-400 text-center py-2 font-medium">
                                      No replies yet. Start the conversation.
                                    </p>
                                  )}

                                  {/* Reply input */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                                    <input
                                      type="text"
                                      placeholder="Share your perspective..."
                                      value={commentInputs[post.id] || ''}
                                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                                      className="flex-1 px-3 py-1.5 bg-white dark:bg-[#1C1C20] border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:border-amber-400 text-zinc-950 dark:text-white"
                                    />
                                    <button
                                      onClick={() => handleCommentSubmit(post.id)}
                                      disabled={isSubmittingComment[post.id] || !commentInputs[post.id]?.trim()}
                                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs disabled:opacity-40 cursor-pointer"
                                    >
                                      {isSubmittingComment[post.id] ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <span>Reply</span>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="py-20 text-center space-y-3 px-4">
                    <Compass className="w-10 h-10 text-zinc-400 mx-auto" />
                    <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-white">
                      {feedSubTab === 'bookmarks' ? 'No Saved Signals' : 'No Dispatches in View'}
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      {feedSubTab === 'bookmarks'
                        ? 'Bookmark valuable lessons, warm leads, and milestone signals to review them here.'
                        : 'Be the first to share an unvarnished lesson or request an intro from the fellowship!'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        </div>
      </div>

      {/* ========================================================
          RIGHT SIDEBAR: Community Spotlight & Strategic Puzzles
         ======================================================== */}
      <div className="hidden lg:flex flex-col w-[360px] xl:w-[400px] shrink-0 sticky top-4 self-start h-fit max-h-[calc(100vh-32px)] py-4 px-2 overflow-y-auto no-scrollbar order-3 space-y-4 z-30">
        
        {/* Spotlight Component */}
        <CommunitySpotlight 
          onOpenCharter={() => setIsCharterOpen(true)}
          onAnswerDailyPrompt={(answer) => {
            setQuickPostContent(`[Daily Provocation] ${answer}\n\n#DailyProvocation `);
            const el = document.getElementById('quick-post-textarea');
            el?.focus();
          }}
          onMessageFellow={(id) => onMessage && onMessage(id)}
          isPledged={isPledged}
        />

        {/* Venture Connections Interactive Puzzles */}
        <div className={`p-1 rounded-2xl ${currentTheme.bgSurfaceClass} shadow-xs transition-colors duration-300`}>
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span>Founder Mind Gym</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Daily Puzzles</span>
          </div>
          <VentureConnections />
        </div>

      </div>

      {/* ========================================================
          MODALS & OVERLAYS
         ======================================================== */}

      {/* Covenant Modal */}
      <CommunityCharterModal
        isOpen={isCharterOpen}
        onClose={() => setIsCharterOpen(false)}
        onPledgeSigned={() => setIsPledged(true)}
        isPledged={isPledged}
      />

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-[120] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setShowAddTopicModal(false)} />
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-zinc-200 dark:border-zinc-800 relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-zinc-950 dark:text-white">
                Add Discussion Topic
              </h3>
              <button
                onClick={() => setShowAddTopicModal(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Create a focused hashtag for founders and investors to organize dispatches around.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTopic(newTopicInput);
              }}
              className="space-y-4"
            >
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">#</span>
                <input
                  type="text"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  placeholder="e.g. Bootstrapping, CleanTech, EnterpriseAI"
                  className="w-full pl-8 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400 border border-zinc-200 dark:border-zinc-700"
                  autoFocus
                />
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTopicInput.trim()}
                  className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs uppercase tracking-wider text-zinc-950 disabled:opacity-50"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Post Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-[120] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => !isDeleting && setPostToDelete(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 text-center space-y-4 border border-zinc-200 dark:border-zinc-800 z-10">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-950 dark:text-white">Delete Dispatch?</h3>
              <p className="text-xs text-zinc-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPostToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Comment Modal */}
      {commentToDelete && (
        <div className="fixed inset-0 z-[120] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => !isDeleting && setCommentToDelete(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 text-center space-y-4 border border-zinc-200 dark:border-zinc-800 z-10">
            <h3 className="font-bold text-base text-zinc-950 dark:text-white">Delete Reply?</h3>
            <p className="text-xs text-zinc-400">Remove your reply from this discussion.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCommentToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteComment}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <AnimatePresence>
        {reportPost && (
          <div className="fixed inset-0 z-[120] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setReportPost(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 space-y-4 border border-zinc-200 dark:border-zinc-800 z-10"
            >
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Report Dispatch</h3>
              <p className="text-xs text-zinc-400">Help protect the integrity of the collective ecosystem.</p>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for reporting (e.g. spam, misconduct)..."
                className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setReportPost(null)}
                  className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!reportReason.trim()) return;
                    setIsSubmittingReport(true);
                    await StorageService.submitPostReport(reportPost, reportReason);
                    setIsSubmittingReport(false);
                    setReportPost(null);
                  }}
                  disabled={isSubmittingReport || !reportReason.trim()}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs disabled:opacity-50"
                >
                  {isSubmittingReport ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Submit'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* User Customizable Banner Modal */}
      <CustomizeBannerModal
        isOpen={isCustomizeBannerOpen}
        onClose={() => setIsCustomizeBannerOpen(false)}
        currentConfig={bannerConfig}
        onSave={handleSaveBanner}
        onReset={handleResetBanner}
      />

      {/* Community Color Theme Picker Modal */}
      <ThemePickerModal
        isOpen={isThemePickerOpen}
        onClose={() => setIsThemePickerOpen(false)}
        currentThemeId={currentTheme.id}
        onSelectTheme={handleSelectTheme}
      />

      {/* Wide Image Lightbox Modal */}
      <AnimatePresence>
        {viewingImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div 
              className="fixed inset-0 cursor-pointer" 
              onClick={() => setViewingImage(null)} 
              title="Click background to close"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-zinc-950/95 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header Bar */}
              <div className="px-5 py-3.5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md">
                <div className="flex items-center gap-2.5 min-w-0 pr-4">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${currentTheme.primaryHex}, ${currentTheme.secondaryHex})` }}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                      {viewingImage.caption || 'Image Attachment'}
                    </h3>
                    {viewingImage.author && (
                      <p className="text-[11px] font-mono text-zinc-400 truncate">
                        Shared by {viewingImage.author}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={viewingImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    title="Open original resolution image in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Open Full Res</span>
                  </a>

                  <button
                    onClick={() => setViewingImage(null)}
                    className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Close (Esc)"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Lightbox Image Viewport */}
              <div className="p-3 sm:p-6 flex-1 flex items-center justify-center overflow-auto bg-black/80 min-h-[300px]">
                <img
                  src={viewingImage.url}
                  alt={viewingImage.caption || 'Wide Image View'}
                  className="max-h-[75vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Lightbox Footer Bar */}
              <div className="px-5 py-2.5 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Click background or press ESC to close</span>
                <span className="hidden sm:inline">ConnectUp Pavilion Image Inspector</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default React.memo(CommunityFeed);

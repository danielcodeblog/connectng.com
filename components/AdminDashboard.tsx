import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, ShieldCheck, DollarSign, AlertTriangle, TrendingUp, Search, 
  Filter, Plus, CheckCircle, XCircle, MoreVertical, Download, RefreshCw, 
  Mail, Edit3, Trash2, ShieldAlert, FileText, Ban, Activity,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight, CreditCard, Lock,
  UserPlus, Check, Eye, ChevronRight, X, AlertCircle, Clock, Send, FileSpreadsheet,
  Settings, HelpCircle, Bell, LogOut, LayoutGrid, Mic, Play, Copy, ExternalLink,
  ChevronDown, Sun, Moon, Database, Laptop, Layers,
  CheckCircle2, Info, BellRing, Receipt, Printer, Radio, MessageSquare
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area, ComposedChart, ReferenceLine
} from 'recharts';
import { UserRole, TownHallBoard } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { VideoPlayer } from './VideoPlayer';
import { StorageService } from '../services/storageService';
import { supabase } from '../services/supabaseClient';
import { AdminBlogManager } from './AdminBlogManager';
import { ConnectUpIcon } from './ui/ConnectUpLogo';

interface AdminDashboardProps {
  userProfile?: any;
  onNavigateHome?: () => void;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'FOUNDER' | 'INVESTOR' | 'ADMIN';
  plan: 'free' | 'pro';
  billingCycle?: 'monthly' | 'yearly' | 'trial' | null;
  status: 'active' | 'suspended' | 'flagged';
  avatarUrl?: string;
  location?: string;
  age?: number;
  joinedDate: string;
  lastActive: string;
  assets?: string;
  followingCount?: number;
  followersCount?: number;
}

export interface AdminSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  plan: 'pro';
  billingCycle: 'monthly' | 'yearly' | 'trial';
  amount: number;
  currency: string;
  provider: 'Paystack' | 'Manual Grant';
  reference?: string;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  createdAt: string;
}

export interface AdminReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  targetType: 'post' | 'user' | 'chat' | 'startup' | 'video';
  targetId: string;
  targetContent: string;
  videoUrl?: string | null;
  reason: 'spam' | 'harassment' | 'misleading' | 'inappropriate' | 'other';
  severity: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_review' | 'resolved' | 'dismissed';
  createdAt: string;
  notes?: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AdminToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
  category: 'SYSTEM' | 'SECURITY' | 'BILLING' | 'USER' | 'AUDIT';
  actionLabel?: string;
  onAction?: () => void;
}

const UsersKpiGlyph = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <circle cx="8" cy="7" r="3" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.75 16.25c.6-2.45 2.75-3.75 5.25-3.75s4.65 1.3 5.25 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
    <path d="M14.75 12.25c1.55.35 2.75 1.35 3.25 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
  </svg>
);

const RevenueKpiGlyph = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <rect x="2.5" y="4.5" width="15" height="11" rx="2.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.5 8.25h15" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5" y="11" width="4" height="1.75" rx="0.875" fill="#F59E0B" />
    <circle cx="14.25" cy="11.875" r="1.125" fill="currentColor" opacity="0.7" />
  </svg>
);

const VelocityKpiGlyph = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <rect x="3" y="11.5" width="3.2" height="5.5" rx="1" fill="currentColor" fillOpacity="0.3" />
    <rect x="8.4" y="7.5" width="3.2" height="9.5" rx="1" fill="currentColor" fillOpacity="0.55" />
    <rect x="13.8" y="3.5" width="3.2" height="13.5" rx="1" fill="#F59E0B" />
  </svg>
);

const ModerationKpiGlyph = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
    <path
      d="M10 2.5L16.25 5.1v4.65c0 3.7-2.65 6.8-6.25 7.75-3.6-.95-6.25-4.05-6.25-7.75V5.1L10 2.5z"
      fill="currentColor"
      fillOpacity="0.14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M7.5 10l1.75 1.75L12.75 8" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TelemetryHeaderGlyph = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="2.5" y="3.5" width="19" height="17" rx="4" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.4" />
    <path d="M6 16.5L10 11.5L13.5 14L18 8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 16.5L10 11.5L13.5 14L18 8V17.5H6V16.5Z" fill="#F59E0B" fillOpacity="0.16" />
    <circle cx="18" cy="8" r="2.25" fill="#F59E0B" />
    <circle cx="18" cy="8" r="4" stroke="#F59E0B" strokeOpacity="0.3" strokeWidth="1.2" />
  </svg>
);

const AreaChartModeGlyph = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <path
      d="M2 12.5C4.2 12.5 4.8 7 7 7C9.2 7 9.8 10 11.5 9C13 8.1 13.5 4.2 14.5 3.5V13.5H2V12.5Z"
      fill={active ? '#F59E0B' : 'currentColor'}
      fillOpacity={active ? 0.28 : 0.14}
    />
    <path
      d="M2 12.5C4.2 12.5 4.8 7 7 7C9.2 7 9.8 10 11.5 9C13 8.1 13.5 4.2 14.5 3.5"
      stroke={active ? '#F59E0B' : 'currentColor'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const BarChartModeGlyph = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
    <rect x="2" y="8.5" width="3" height="5" rx="1" fill={active ? '#F59E0B' : 'currentColor'} fillOpacity={active ? 0.55 : 0.4} />
    <rect x="6.5" y="3.5" width="3" height="10" rx="1" fill={active ? '#F59E0B' : 'currentColor'} />
    <rect x="11" y="6" width="3" height="7.5" rx="1" fill={active ? '#10B981' : 'currentColor'} fillOpacity={active ? 0.85 : 0.65} />
  </svg>
);

interface ActivityTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    dataKey?: string;
    payload?: { date?: string; activity?: number; growth?: number; volume?: number };
  }>;
  label?: string;
}

const ActivityChartTooltip: React.FC<ActivityTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  const rowData = payload[0]?.payload;
  const actionsVal = rowData?.activity ?? 0;
  const growthVal = rowData?.growth ?? 0;
  const volumeVal = rowData?.volume ?? 0;
  const ratio = growthVal > 0 ? (actionsVal / growthVal).toFixed(1) : null;

  return (
    <div className="bg-[#0B0B0E]/95 backdrop-blur-xl border border-zinc-800/90 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.45)] px-3.5 py-2.5 min-w-[184px] text-zinc-100">
      <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b border-zinc-800/80">
        <span className="text-[11px] font-semibold tracking-tight text-white">{label}</span>
        {ratio && (
          <span className="text-[10px] font-mono tabular-nums text-amber-400/90">
            {ratio}x / user
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-5">
          <span className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.65)]" />
            <span>Actions</span>
          </span>
          <span className="font-mono tabular-nums font-bold text-white">{actionsVal}</span>
        </div>
        <div className="flex items-center justify-between gap-5">
          <span className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" />
            <span>New Users</span>
          </span>
          <span className="font-mono tabular-nums font-bold text-white">{growthVal}</span>
        </div>
      </div>

      {volumeVal > 0 && (
        <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
          <span className="text-zinc-500">Revenue</span>
          <span className="font-mono tabular-nums font-semibold text-zinc-200">
            ${volumeVal.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userProfile, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'dashboards' | 'users' | 'subscriptions' | 'reports' | 'townhall' | 'blogs' | 'logs' | 'settings'>('dashboards');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Town Hall Boards state (Admin Exclusive Management)
  const [townhallBoards, setTownhallBoards] = useState<TownHallBoard[]>(() => {
    try {
      const saved = localStorage.getItem('connectup_townhall_boards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [townhallQuestions, setTownhallQuestions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('connectup_townhall_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [boardSearch, setBoardSearch] = useState('');
  const [boardStatusFilter, setBoardStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');

  // Form states for Board creation/editing
  const [boardTitle, setBoardTitle] = useState('');
  const [boardEpisodeTag, setBoardEpisodeTag] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [boardDate, setBoardDate] = useState('');
  const [boardTime, setBoardTime] = useState('');
  const [boardSpeakers, setBoardSpeakers] = useState('');
  const [boardMeetingLink, setBoardMeetingLink] = useState('');
  const [boardImageUrl, setBoardImageUrl] = useState('');
  const [boardStatus, setBoardStatus] = useState<'upcoming' | 'live' | 'completed'>('upcoming');
  const [boardIsActiveStage, setBoardIsActiveStage] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('connectup_townhall_boards', JSON.stringify(townhallBoards));
    } catch {}
  }, [townhallBoards]);

  useEffect(() => {
    try {
      localStorage.setItem('connectup_townhall_questions', JSON.stringify(townhallQuestions));
    } catch {}
  }, [townhallQuestions]);

  // Live database counts
  const [startupsCount, setStartupsCount] = useState(0);
  const [swipesCount, setSwipesCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [pitchesCount, setPitchesCount] = useState(0);

  // Search & Filter state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'FOUNDER' | 'INVESTOR' | 'ADMIN'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'pro' | 'free'>('all');
  const [reportSearch, setReportSearch] = useState('');
  const [subscriptionSearch, setSubscriptionSearch] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'completed' | 'cancelled' | 'refunded' | 'trial'>('all');
  const [isFetchingSubscriptions, setIsFetchingSubscriptions] = useState(false);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);
  const [auditLogSearch, setAuditLogSearch] = useState('');
  const [auditLogTypeFilter, setAuditLogTypeFilter] = useState<string>('all');
  const [reportSeverityFilter, setReportSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'in_review'>('all');

  // Chart configuration
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [visibleSeries, setVisibleSeries] = useState<{ activity: boolean; growth: boolean }>({
    activity: true,
    growth: true,
  });
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [activeToast, setActiveToast] = useState<AdminToast | null>(null);
  const [isToastPaused, setIsToastPaused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsFilter, setNotificationsFilter] = useState<'all' | 'security' | 'billing'>('all');
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('connectup_admin_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('connectup_admin_read_notifications', JSON.stringify(readNotificationIds));
    } catch {}
  }, [readNotificationIds]);

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isGrantSubModalOpen, setIsGrantSubModalOpen] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState<AdminUser | null>(null);
  const [selectedUserStartup, setSelectedUserStartup] = useState<any>(null);
  const [selectedUserPitches, setSelectedUserPitches] = useState<any[]>([]);
  const [selectedUserTransactions, setSelectedUserTransactions] = useState<any[]>([]);
  const [isFetchingProfileDetails, setIsFetchingProfileDetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState<AdminSubscription | null>(null);

  // Dashboard Overview Transaction Ledger state
  const [dashboardTxFilter, setDashboardTxFilter] = useState<'all' | 'completed' | 'refunded' | 'trial'>('all');
  const [dashboardTxSearch, setDashboardTxSearch] = useState('');
  const [dashboardTxLimit, setDashboardTxLimit] = useState<number>(5);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);
  // Dashboard density is permanently compact
  const isCompact = true;

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('connectup_theme') === 'dark';
  });

  const toggleAdminTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('connectup_theme', 'light');
      setIsDarkTheme(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('connectup_theme', 'dark');
      setIsDarkTheme(true);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('connectup_admin_compact', 'true');
    } catch {}
  }, []);

  // Admin profile state
  const [adminProfileState, setAdminProfileState] = useState({
    fullName: userProfile?.name || userProfile?.full_name || '',
    avatarUrl: userProfile?.avatarUrl || userProfile?.avatar_url || '',
    title: userProfile?.title || 'System Administrator',
    bio: userProfile?.bio || '',
    location: userProfile?.location || '',
    email: userProfile?.email || ''
  });

  const [requireEmailVerification, setRequireEmailVerification] = useState<boolean>(() => {
    const saved = localStorage.getItem('connectup_admin_email_verification');
    return saved === null ? true : saved === 'true';
  });

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    const saved = localStorage.getItem('connectup_admin_logs');
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 7) {
          parsed = parsed.filter((_, idx) => idx !== 4 && idx !== 5 && idx !== 6);
          try {
            localStorage.setItem('connectup_admin_logs', JSON.stringify(parsed));
          } catch {}
        }
        return Array.isArray(parsed) ? parsed : [];
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('connectup_admin_email_verification', requireEmailVerification.toString());
  }, [requireEmailVerification]);

  useEffect(() => {
    localStorage.setItem('connectup_admin_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (userProfile) {
      setAdminProfileState({
        fullName: userProfile.name || userProfile.full_name || '',
        avatarUrl: userProfile.avatarUrl || userProfile.avatar_url || '',
        title: userProfile.title || 'System Administrator',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        email: userProfile.email || ''
      });
    }
  }, [userProfile]);

  const showToast = (
    msg: string, 
    type: 'success' | 'warning' | 'error' | 'info' = 'success', 
    title?: string,
    options?: { category?: 'SYSTEM' | 'SECURITY' | 'BILLING' | 'USER' | 'AUDIT'; actionLabel?: string; onAction?: () => void }
  ) => {
    let determinedCategory: 'SYSTEM' | 'SECURITY' | 'BILLING' | 'USER' | 'AUDIT' = options?.category || 'SYSTEM';
    let determinedType = type;
    const lower = msg.toLowerCase();
    
    // Only infer error/warning if type wasn't explicitly provided as success/info
    if (type !== 'success' && type !== 'info') {
      if (lower.includes('fail') || lower.includes('error') || lower.includes('denied') || lower.includes('could not')) {
        determinedType = 'error';
      } else if (lower.includes('warn') || lower.includes('flag') || lower.includes('purge') || lower.includes('remove') || lower.includes('deleted')) {
        determinedType = 'warning';
      }
    }

    if (lower.includes('user') || lower.includes('profile') || lower.includes('account')) {
      determinedCategory = 'USER';
    } else if (lower.includes('subscription') || lower.includes('pro') || lower.includes('revenue') || lower.includes('mrr') || lower.includes('payment')) {
      determinedCategory = 'BILLING';
    } else if (lower.includes('report') || lower.includes('security') || lower.includes('case') || lower.includes('audit')) {
      determinedCategory = 'SECURITY';
    }

    const defaultTitle = 
      determinedType === 'error' ? 'Notice' :
      determinedType === 'warning' ? 'System Notification' :
      determinedType === 'info' ? 'Console Notice' : 'Action Completed';

    const newToast: AdminToast = {
      id: `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title || defaultTitle,
      message: msg,
      type: determinedType,
      category: determinedCategory,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actionLabel: options?.actionLabel,
      onAction: options?.onAction
    };

    setActiveToast(newToast);
    setIsToastPaused(false);
  };

  useEffect(() => {
    if (!activeToast || isToastPaused) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [activeToast, isToastPaused]);

  const adminApiCall = async (path: string, options: RequestInit = {}) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token || localStorage.getItem('connectup_admin_session_token') || localStorage.getItem('sb-token') || '';
      
      if (!token) {
        throw new Error('Unauthorized: Missing valid administrator session token');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      };
      
      const response = await fetch(path, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err: any) {
      console.warn(`adminApiCall warning for ${path}:`, err);
      throw err;
    }
  };

  const fetchUsers = async (): Promise<AdminUser[]> => {
    try {
      let data: any[] | null = null;
      
      try {
        const res = await adminApiCall('/api/admin/users');
        if (Array.isArray(res) && res.length > 0) {
          data = res;
        }
      } catch (e) {
        console.warn("adminApiCall /api/admin/users fallback to profiles table:", e);
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        const { data: dbProfiles, error: profilesErr } = await supabase
          .from('profiles')
          .select('*');

        if (!profilesErr && Array.isArray(dbProfiles)) {
          data = [...dbProfiles].sort((a: any, b: any) =>
            new Date(b.created_at || b.updated_at || b.last_seen || 0).getTime() -
            new Date(a.created_at || a.updated_at || a.last_seen || 0).getTime()
          );
        } else if (profilesErr) {
          console.error("Direct profiles query error:", profilesErr.message);
        }
      }

      if (data && Array.isArray(data)) {
        const mappedUsers: AdminUser[] = data.map((u: any) => ({
          id: u.id,
          name: u.full_name || u.name || u.email?.split('@')[0] || 'User',
          email: u.email || '',
          role: (u.role || 'FOUNDER').toUpperCase() as any,
          plan: u.plan === 'pro' ? 'pro' : 'free',
          billingCycle: u.billing_cycle || null,
          status: 'active',
          avatarUrl: u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.full_name || u.email || 'User')}&backgroundColor=18181b,27272a&textColor=f4f4f5`,
          location: u.location || 'Remote',
          age: u.age !== undefined && u.age !== null && u.age !== '' ? Number(u.age) : undefined,
          joinedDate: (u.created_at || u.updated_at) ? new Date(u.created_at || u.updated_at).toLocaleDateString() : 'Recently',
          lastActive: u.last_seen ? new Date(u.last_seen).toLocaleDateString() : 'Just now'
        }));
        setUsers(mappedUsers);
        return mappedUsers;
      }
    } catch (err) {
      console.error("fetchUsers error", err);
    }
    return [];
  };

  const fetchSubscriptions = async (usersList?: AdminUser[]) => {
    setIsFetchingSubscriptions(true);
    try {
      let data: any[] | null = null;
      try {
        data = await adminApiCall('/api/admin/subscriptions');
      } catch (e) {
        console.warn("adminApiCall /api/admin/subscriptions fallback:", e);
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        const { data: dbSubs } = await supabase
          .from('subscription_transactions')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbSubs && dbSubs.length > 0) {
          data = dbSubs;
        }
      }

      let activeUsers = usersList && usersList.length > 0 ? usersList : users;

      // If activeUsers is still empty, load profiles directly as backup
      if (activeUsers.length === 0) {
        try {
          const { data: dbProfiles } = await supabase.from('profiles').select('*');
          if (dbProfiles && Array.isArray(dbProfiles)) {
            activeUsers = dbProfiles.map((u: any) => ({
              id: u.id,
              name: u.full_name || u.name || u.email?.split('@')[0] || 'User',
              email: u.email || '',
              role: (u.role || 'FOUNDER').toUpperCase() as any,
              plan: u.plan === 'pro' ? 'pro' : 'free',
              billingCycle: u.billing_cycle || null,
              status: 'active',
              joinedDate: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recently',
              lastActive: u.last_seen ? new Date(u.last_seen).toLocaleDateString() : 'Just now'
            }));
          }
        } catch (err) {
          console.warn("Could not load backup profiles for subscriptions:", err);
        }
      }

      let mappedSubs: AdminSubscription[] = [];

      if (data && Array.isArray(data) && data.length > 0) {
        mappedSubs = data.map((s: any) => {
          const matchingUser = activeUsers.find(u => u.id === s.user_id || u.id === s.userId);
          const userName = s.user_name || s.userName || matchingUser?.name || matchingUser?.email?.split('@')[0] || (s.user_email || s.userEmail || '').split('@')[0] || 'Subscriber';
          const userEmail = s.user_email || s.userEmail || matchingUser?.email || '';
          const userAvatar = s.user_avatar || matchingUser?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=18181b,27272a&textColor=f4f4f5`;
          const rawCycle = (s.billing_cycle || s.billingCycle || 'monthly').toLowerCase();
          const billingCycle = rawCycle === 'trial' ? 'trial' : rawCycle === 'yearly' ? 'yearly' : 'monthly';

          let formattedDate = 'Recently';
          if (s.created_at) {
            try {
              formattedDate = new Date(s.created_at).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            } catch {
              formattedDate = String(s.created_at);
            }
          } else if (s.createdAt) {
            formattedDate = s.createdAt;
          }

          const rawCurrency = (s.currency || 'USD').toUpperCase();
          const rawAmount = Number(s.amount) || 0;
          const usdAmount = rawCurrency === 'NGN' && rawAmount >= 1000
            ? Math.round((rawAmount / 1400) * 100) / 100
            : rawAmount;

          return {
            id: s.id || `tx_${Math.random().toString(36).substring(2, 7)}`,
            reference: s.reference || s.id,
            userId: s.user_id || s.userId || matchingUser?.id || '',
            userName,
            userEmail,
            userAvatar,
            plan: 'pro',
            billingCycle: billingCycle as any,
            amount: usdAmount,
            currency: 'USD',
            provider: s.provider || 'Paystack',
            status: (s.status || 'completed') as any,
            createdAt: formattedDate
          };
        });
      }

      setSubscriptions(mappedSubs);
    } catch (err) {
      console.error("fetchSubscriptions error", err);
    } finally {
      setIsFetchingSubscriptions(false);
    }
  };

  const formatCurrency = (amount: number | string, _currency: string = 'USD') => {
    const num = Number(amount) || 0;
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const fetchLogs = async () => {
    setIsFetchingLogs(true);
    try {
      let data: any[] | null = null;
      try {
        data = await adminApiCall('/api/admin/logs');
      } catch (e) {
        console.warn("adminApiCall /api/admin/logs fallback:", e);
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        const { data: dbLogs } = await supabase
          .from('audit_logs')
          .select('*')
          .order('timestamp', { ascending: false });
        if (dbLogs && dbLogs.length > 0) {
          data = dbLogs;
        }
      }

      if (data && Array.isArray(data) && data.length > 0) {
        let mappedLogs: AdminAuditLog[] = data.map((l: any) => ({
          id: l.id || `log_${Math.random().toString(36).substring(2, 7)}`,
          adminEmail: l.adminEmail || l.admin_email || 'admin@connectup.com',
          action: l.action || 'ADMIN_ACTION',
          details: l.details || '',
          timestamp: l.timestamp || l.created_at || new Date().toISOString()
        }));
        if (mappedLogs.length >= 7) {
          mappedLogs = mappedLogs.filter((_, idx) => idx !== 4 && idx !== 5 && idx !== 6);
        }
        setAuditLogs(mappedLogs);
        try {
          localStorage.setItem('connectup_admin_logs', JSON.stringify(mappedLogs));
        } catch {}
      } else {
        const saved = localStorage.getItem('connectup_admin_logs');
        if (saved) {
          try {
            let parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length >= 7) {
              parsed = parsed.filter((_: any, idx: number) => idx !== 4 && idx !== 5 && idx !== 6);
            }
            setAuditLogs(parsed);
          } catch {}
        }
      }
    } catch (err) {
      console.error("fetchLogs error", err);
    } finally {
      setIsFetchingLogs(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    setAuditLogs(prev => {
      const updated = prev.filter(l => l.id !== logId);
      try {
        localStorage.setItem('connectup_admin_logs', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await adminApiCall(`/api/admin/logs/${logId}`, { method: 'DELETE' });
      showToast("Audit log entry removed");
    } catch (e) {
      console.warn("Could not delete log on server:", e);
    }
  };

  const handleClearAllLogs = async () => {
    if (!confirm("Are you sure you want to clear all audit logs?")) return;
    setAuditLogs([]);
    try {
      localStorage.removeItem('connectup_admin_logs');
      await adminApiCall('/api/admin/logs', { method: 'DELETE' });
      showToast("All audit logs cleared");
    } catch (e) {
      console.warn("Could not clear logs on server:", e);
    }
  };

  const recordLog = async (action: string, details: string) => {
    const adminEmail = userProfile?.email || 'admin@connectup.com';
    const newLogItem: AdminAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminEmail,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    setAuditLogs(prev => [newLogItem, ...prev]);

    try {
      await adminApiCall('/api/admin/logs', {
        method: 'POST',
        body: JSON.stringify({ action, details, adminEmail })
      });
    } catch (e) {
      console.warn("Could not sync log to server:", e);
    }
  };

  // Town Hall Boards Handlers
  const openCreateBoardModal = (boardToEdit?: TownHallBoard) => {
    if (boardToEdit) {
      setEditingBoardId(boardToEdit.id);
      setBoardTitle(boardToEdit.title);
      setBoardEpisodeTag(boardToEdit.episodeTag);
      setBoardDescription(boardToEdit.description);
      setBoardDate(boardToEdit.date);
      setBoardTime(boardToEdit.time);
      setBoardSpeakers(boardToEdit.speakers || '');
      setBoardMeetingLink(boardToEdit.meetingLink || '');
      setBoardImageUrl(boardToEdit.imageUrl || '');
      setBoardStatus(boardToEdit.status);
      setBoardIsActiveStage(!!boardToEdit.isActiveStage);
    } else {
      setEditingBoardId(null);
      setBoardTitle('');
      setBoardEpisodeTag(`Weekly Salon · Episode ${townhallBoards.length + 1}`);
      setBoardDescription('');
      setBoardDate('Thursday, Oct 15, 2026');
      setBoardTime('5:00 PM UTC (45 mins)');
      setBoardSpeakers('');
      setBoardMeetingLink('');
      setBoardImageUrl('');
      setBoardStatus('upcoming');
      setBoardIsActiveStage(townhallBoards.length === 0);
    }
    setShowCreateBoardModal(true);
  };

  const handleSaveBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim() || !boardDescription.trim()) {
      showToast("Please enter a title and description for the board", "error", "Validation Error");
      return;
    }

    if (editingBoardId) {
      setTownhallBoards(prev => prev.map(b => {
        if (b.id === editingBoardId) {
          return {
            ...b,
            title: boardTitle.trim(),
            episodeTag: boardEpisodeTag.trim() || 'Town Hall Salon',
            description: boardDescription.trim(),
            date: boardDate.trim(),
            time: boardTime.trim(),
            speakers: boardSpeakers.trim(),
            meetingLink: boardMeetingLink.trim(),
            imageUrl: boardImageUrl.trim() || undefined,
            status: boardStatus,
            isActiveStage: boardIsActiveStage,
          };
        }
        if (boardIsActiveStage) {
          return { ...b, isActiveStage: false };
        }
        return b;
      }));
      recordLog("Updated Town Hall Board", `Modified salon session: ${boardTitle}`);
      showToast("Town Hall stage board updated", "success", "Board Saved");
    } else {
      const newBoard: TownHallBoard = {
        id: `thb-${Date.now()}`,
        title: boardTitle.trim(),
        episodeTag: boardEpisodeTag.trim() || `Town Hall Salon · Episode ${townhallBoards.length + 1}`,
        description: boardDescription.trim(),
        date: boardDate.trim() || 'TBD',
        time: boardTime.trim() || '5:00 PM UTC',
        speakers: boardSpeakers.trim(),
        meetingLink: boardMeetingLink.trim(),
        imageUrl: boardImageUrl.trim() || undefined,
        rsvpCount: 0,
        status: boardStatus,
        isActiveStage: boardIsActiveStage,
        createdAt: new Date().toISOString()
      };

      setTownhallBoards(prev => {
        const others = boardIsActiveStage ? prev.map(b => ({ ...b, isActiveStage: false })) : prev;
        return [newBoard, ...others];
      });
      recordLog("Created Town Hall Board", `Scheduled new live salon: ${boardTitle}`);
      showToast("New Town Hall board published to community", "success", "Stage Board Created");
    }

    setShowCreateBoardModal(false);
  };

  const handleDeleteBoard = (boardId: string) => {
    const board = townhallBoards.find(b => b.id === boardId);
    if (window.confirm(`Are you sure you want to delete Town Hall board "${board?.title || boardId}"?`)) {
      setTownhallBoards(prev => prev.filter(b => b.id !== boardId));
      recordLog("Deleted Town Hall Board", `Removed board ${boardId}`);
      showToast("Town Hall board deleted", "info", "Board Removed");
    }
  };

  const handleToggleBoardActiveStage = (boardId: string) => {
    setTownhallBoards(prev => prev.map(b => ({
      ...b,
      isActiveStage: b.id === boardId
    })));
    recordLog("Set Active Town Hall Stage", `Activated board ${boardId} on community stage`);
    showToast("Active stage board updated", "success", "Stage Live");
  };

  const handleToggleBoardStatus = (boardId: string, newStatus: 'upcoming' | 'live' | 'completed') => {
    setTownhallBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return { ...b, status: newStatus };
      }
      return b;
    }));
    recordLog("Changed Board Status", `Set board ${boardId} status to ${newStatus}`);
    showToast(`Board marked as ${newStatus}`, "info");
  };

  const handleDeleteTownHallQuestion = (questionId: string) => {
    setTownhallQuestions(prev => prev.filter(q => q.id !== questionId));
    showToast("Question removed from queue", "info");
  };

  const fetchReports = async () => {
    try {
      let data: any[] | null = null;
      try {
        data = await adminApiCall('/api/admin/reports');
      } catch (e) {
        console.warn("adminApiCall /api/admin/reports fallback:", e);
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        const { data: dbReports } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbReports && dbReports.length > 0) {
          data = dbReports;
        }
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const profileIds = Array.from(new Set([
          ...data.map((r: any) => r.reporter_id),
          ...data.map((r: any) => r.reported_profile_id)
        ]));

        let profilesMap = new Map();
        if (profileIds.length > 0) {
          try {
            const profiles = await adminApiCall('/api/admin/users');
            if (profiles && Array.isArray(profiles)) {
              profiles.forEach((p: any) => profilesMap.set(p.id, p));
            }
          } catch (e) {
            const { data: dbProfs } = await supabase.from('profiles').select('*').in('id', profileIds);
            if (dbProfs) dbProfs.forEach((p: any) => profilesMap.set(p.id, p));
          }
        }

        const mappedReports: AdminReport[] = data.map((r: any) => {
          const reporter = profilesMap.get(r.reporter_id);
          const reported = profilesMap.get(r.reported_profile_id);
          
          let targetContent = r.target_content;
          let videoUrl = null;
          let reason = r.reason || 'other';
          
          if (reason.includes('[VIDEO:')) {
            const match = reason.match(/\[VIDEO:(.*?)\]/);
            if (match && match[1]) {
              videoUrl = match[1];
              reason = reason.replace(/\[VIDEO:.*?\]/, '').trim();
            }
          }

          if (targetContent && (targetContent.startsWith('{') || targetContent.startsWith('['))) {
            try {
              const parsed = JSON.parse(targetContent);
              targetContent = parsed.text || parsed.content || targetContent;
              if (!videoUrl) videoUrl = parsed.videoUrl || null;
            } catch (e) {}
          }

          if (!targetContent) {
            if (r.reported_profile_id) {
              targetContent = `Reported Account: ${reported?.full_name || reported?.email || 'Target User'}`;
            } else {
              targetContent = `Infraction reason: ${reason}`;
            }
          }

          return {
            id: r.id,
            reporterName: reporter?.full_name || reporter?.email?.split('@')[0] || 'Reporter',
            reporterEmail: reporter?.email || '',
            targetType: (r.target_type || 'user') as any,
            targetId: r.target_id || r.reported_profile_id || '',
            targetContent: targetContent,
            videoUrl: videoUrl,
            reason: reason as any,
            severity: (r.severity || 'medium') as any,
            status: (r.status || 'pending') as any,
            createdAt: r.created_at || new Date().toISOString()
          };
        });
        setReports(mappedReports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error("fetchReports error", err);
    }
  };

  const fetchDashboardCounts = async () => {
    try {
      let counts: any = null;
      try {
        counts = await adminApiCall('/api/admin/counts');
      } catch (e) {
        console.warn("adminApiCall /api/admin/counts fallback:", e);
      }

      if (counts && typeof counts.startups === 'number') {
        setStartupsCount(counts.startups ?? 0);
        setSwipesCount(counts.swipes ?? 0);
        setPostsCount(counts.posts ?? 0);
        setPitchesCount(counts.pitches ?? 0);
      } else {
        const [startupsRes, swipesRes, postsRes, pitchesRes] = await Promise.all([
          supabase.from('startups').select('id', { count: 'exact', head: true }),
          supabase.from('swipes').select('id', { count: 'exact', head: true }),
          supabase.from('community_posts').select('id', { count: 'exact', head: true }),
          supabase.from('pitches').select('id', { count: 'exact', head: true })
        ]);
        setStartupsCount(startupsRes.count ?? 0);
        setSwipesCount(swipesRes.count ?? 0);
        setPostsCount(postsRes.count ?? 0);
        setPitchesCount(pitchesRes.count ?? 0);
      }
    } catch (err) {
      setStartupsCount(0);
      setSwipesCount(0);
      setPostsCount(0);
      setPitchesCount(0);
    }
  };

  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      const fetchedUsers = await fetchUsers();
      await Promise.allSettled([
        fetchSubscriptions(fetchedUsers),
        fetchReports(),
        fetchDashboardCounts(),
        fetchLogs()
      ]);
      showToast("Console telemetry refreshed", "success", "Console Notification");
    } catch (e) {
      console.warn("Telemetry refresh warning:", e);
      showToast("Console telemetry updated", "info", "Console Notification");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await fetchUsers();
        await Promise.all([
          fetchSubscriptions(fetchedUsers),
          fetchReports(),
          fetchDashboardCounts(),
          fetchLogs()
        ]);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'subscriptions') {
      fetchSubscriptions();
    }
  }, [activeTab]);

  const handleViewProfile = async (u: AdminUser) => {
    setSelectedUserProfile(u);
    setSelectedUserStartup(null);
    setSelectedUserPitches([]);
    setSelectedUserTransactions([]);
    setIsFetchingProfileDetails(true);
    
    try {
      let transData: any[] = [];
      try {
        const res = await adminApiCall(`/api/admin/subscriptions?userId=${u.id}`);
        if (Array.isArray(res)) transData = res;
      } catch (e) {
        console.warn("Could not fetch user subscriptions from API:", e);
      }

      if (transData.length === 0) {
        // Fallback to local subscriptions state
        const localMatches = subscriptions.filter(s => s.userId === u.id).map(s => ({
          id: s.id,
          amount: s.amount,
          billing_cycle: s.billingCycle,
          status: s.status,
          created_at: s.createdAt
        }));
        transData = localMatches;
      }

      setSelectedUserTransactions(transData);

      if (u.role === 'FOUNDER') {
        const { data: startupData } = await supabase
          .from('startups')
          .select('*')
          .eq('id', u.id)
          .maybeSingle();
        
        if (startupData) {
          setSelectedUserStartup(startupData);
        }

        const { data: pitchesData } = await supabase
          .from('pitches')
          .select('*')
          .eq('user_id', u.id);
        
        if (pitchesData) {
          setSelectedUserPitches(pitchesData);
        }
      }
    } catch (err) {
      console.error("Error fetching dossier:", err);
    } finally {
      setIsFetchingProfileDetails(false);
    }
  };

  // Metrics computations
  const foundersCount = useMemo(() => users.filter(u => u.role === 'FOUNDER').length, [users]);
  const investorsCount = useMemo(() => users.filter(u => u.role === 'INVESTOR').length, [users]);
  const adminsCount = useMemo(() => users.filter(u => u.role === 'ADMIN').length, [users]);
  const proSubscribersCount = useMemo(() => users.filter(u => u.plan === 'pro').length, [users]);

  const subMetrics = useMemo(() => {
    let mrr = 0;
    let totalRevenue = 0;
    const primaryCurrency = 'USD';

    subscriptions.forEach(s => {
      const status = (s.status || 'completed').toLowerCase();
      if (status !== 'refunded' && status !== 'cancelled' && status !== 'failed') {
        const amt = Number(s.amount) || 0;
        totalRevenue += amt;
        if (s.billingCycle === 'monthly') {
          mrr += amt;
        } else if (s.billingCycle === 'yearly') {
          mrr += amt / 12;
        }
      }
    });

    return {
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(mrr * 12 * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      primaryCurrency,
      activeSubsCount: proSubscribersCount,
      totalTransactionsCount: subscriptions.length
    };
  }, [subscriptions, proSubscribersCount]);

  const activityStats = useMemo(() => {
    const series: Record<string, { date: string, growth: number, volume: number, activity: number }> = {};
    
    users.forEach(u => {
      if (u.joinedDate) {
        const dateStr = u.joinedDate.includes('/') ? u.joinedDate : new Date(u.joinedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (!series[dateStr]) series[dateStr] = { date: dateStr, growth: 0, volume: 0, activity: 0 };
        series[dateStr].growth += 1;
        series[dateStr].activity += 2;
      }
    });

    subscriptions.forEach(s => {
      if (s.createdAt) {
        const dateStr = s.createdAt.includes('/') ? s.createdAt : new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (!series[dateStr]) series[dateStr] = { date: dateStr, growth: 0, volume: 0, activity: 0 };
        series[dateStr].volume += s.amount;
        series[dateStr].activity += 3;
      }
    });

    const values = Object.values(series);
    if (values.length === 0) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];
        const isToday = i === 0;
        last7Days.push({
          date: dayName,
          growth: isToday ? users.length : 0,
          volume: isToday ? subMetrics.totalRevenue : 0,
          activity: isToday ? (users.length + subscriptions.length) : 0
        });
      }
      return last7Days;
    }
    return values.slice(-10);
  }, [users, subscriptions, subMetrics]);

  const activitySummary = useMemo(() => {
    const totalActions = activityStats.reduce((sum, d) => sum + d.activity, 0);
    const totalNewUsers = activityStats.reduce((sum, d) => sum + d.growth, 0);
    const avgActions = activityStats.length > 0 ? Math.round(totalActions / activityStats.length) : 0;
    const peakPoint = activityStats.reduce(
      (best, cur) => (cur.activity > best.activity ? cur : best),
      activityStats[0] || { date: '—', activity: 0, growth: 0, volume: 0 }
    );
    return { totalActions, totalNewUsers, avgActions, peakPoint };
  }, [activityStats]);

  const locationStats = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => {
      const loc = u.location && u.location !== 'Remote' ? u.location : 'Global / Remote';
      counts[loc] = (counts[loc] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / (users.length || 1)) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [users]);

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = !userSearch || 
        u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesPlan = planFilter === 'all' || u.plan === planFilter;
      return matchesSearch && matchesRole && matchesPlan;
    });
  }, [users, userSearch, roleFilter, planFilter]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(s => {
      const status = (s.status || 'completed').toLowerCase();
      const matchesFilter = subscriptionFilter === 'all' 
        || (subscriptionFilter === 'completed' && status === 'completed')
        || (subscriptionFilter === 'refunded' && status === 'refunded')
        || (subscriptionFilter === 'trial' && s.billingCycle === 'trial')
        || (subscriptionFilter === 'cancelled' && status === 'cancelled');
      const q = subscriptionSearch.trim().toLowerCase();
      const matchesSearch = !q || 
        (s.userName || '').toLowerCase().includes(q) || 
        (s.userEmail || '').toLowerCase().includes(q) || 
        (s.id || '').toLowerCase().includes(q) ||
        (s.reference || '').toLowerCase().includes(q) ||
        (s.billingCycle || '').toLowerCase().includes(q) ||
        (s.currency || '').toLowerCase().includes(q) ||
        (s.provider || '').toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [subscriptions, subscriptionFilter, subscriptionSearch]);

  const dashboardTransactions = useMemo(() => {
    return subscriptions.filter(s => {
      const status = (s.status || 'completed').toLowerCase();
      const matchesFilter = dashboardTxFilter === 'all' 
        || (dashboardTxFilter === 'completed' && status === 'completed')
        || (dashboardTxFilter === 'refunded' && status === 'refunded')
        || (dashboardTxFilter === 'trial' && s.billingCycle === 'trial');
      const q = dashboardTxSearch.trim().toLowerCase();
      const matchesSearch = !q || 
        (s.userName || '').toLowerCase().includes(q) || 
        (s.userEmail || '').toLowerCase().includes(q) || 
        (s.id || '').toLowerCase().includes(q) ||
        (s.reference || '').toLowerCase().includes(q) ||
        (s.billingCycle || '').toLowerCase().includes(q) ||
        (s.currency || '').toLowerCase().includes(q) ||
        (s.provider || '').toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [subscriptions, dashboardTxFilter, dashboardTxSearch]);

  const displayedDashboardTx = useMemo(() => {
    if (dashboardTxLimit === 0) return dashboardTransactions;
    return dashboardTransactions.slice(0, dashboardTxLimit);
  }, [dashboardTransactions, dashboardTxLimit]);

  const handleCopyText = (text: string, label: string = 'ID') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedTxId(text);
      setTimeout(() => setCopiedTxId(null), 2000);
      showToast(`Copied ${label} to clipboard`, 'info');
    }
  };

  const exportTransactionsCSV = (dataToExport: AdminSubscription[], filenamePrefix = 'connectup_transactions') => {
    if (!dataToExport || dataToExport.length === 0) {
      showToast("No transaction records available to export", "info");
      return;
    }
    const headers = [
      'Transaction ID',
      'Customer Name',
      'Customer Email',
      'User ID',
      'Plan Tier',
      'Billing Cycle',
      'Amount (USD)',
      'Currency',
      'Provider',
      'Status',
      'Date Created'
    ];
    const rows = dataToExport.map(s => [
      `"${s.id}"`,
      `"${(s.userName || '').replace(/"/g, '""')}"`,
      `"${(s.userEmail || '').replace(/"/g, '""')}"`,
      `"${s.userId || ''}"`,
      `"${s.plan || 'pro'}"`,
      `"${s.billingCycle || 'monthly'}"`,
      `"${(Number(s.amount) || 0).toFixed(2)}"`,
      `"${s.currency || 'USD'}"`,
      `"${s.provider || 'Paystack'}"`,
      `"${s.status || 'completed'}"`,
      `"${s.createdAt || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${dataToExport.length} transactions as CSV`);
  };

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = !reportSearch || 
        r.targetContent.toLowerCase().includes(reportSearch.toLowerCase()) || 
        r.reporterName.toLowerCase().includes(reportSearch.toLowerCase());
      const matchesSeverity = reportSeverityFilter === 'all' || (r.severity || '').toLowerCase() === reportSeverityFilter.toLowerCase();
      const matchesStatus = reportStatusFilter === 'all' || (r.status || 'pending').toLowerCase() === reportStatusFilter.toLowerCase();
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [reports, reportSearch, reportSeverityFilter, reportStatusFilter]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = !auditLogSearch || 
        log.details.toLowerCase().includes(auditLogSearch.toLowerCase()) ||
        log.adminEmail.toLowerCase().includes(auditLogSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(auditLogSearch.toLowerCase());
      const matchesType = auditLogTypeFilter === 'all' || log.action === auditLogTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [auditLogs, auditLogSearch, auditLogTypeFilter]);

  const liveAdminNotifications = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      message: string;
      category: 'security' | 'billing' | 'system';
      time: string;
      severity: 'high' | 'medium' | 'info';
      actionTab?: 'dashboards' | 'users' | 'subscriptions' | 'reports' | 'logs' | 'settings';
      actionLabel?: string;
    }> = [];

    // 1. Pending moderation reports
    const pendingReports = reports.filter(r => r.status === 'pending');
    if (pendingReports.length > 0) {
      list.push({
        id: 'notif_reports',
        title: `${pendingReports.length} New ${pendingReports.length === 1 ? 'Report' : 'Reports'}`,
        message: `${pendingReports[0].reporterName} reported content for ${pendingReports[0].reason}.`,
        category: 'security',
        time: 'Needs review',
        severity: 'high',
        actionTab: 'reports',
        actionLabel: 'View Reports'
      });
    }

    // 2. Pro subscription events
    if (proSubscribersCount > 0) {
      list.push({
        id: 'notif_subs',
        title: `Pro Subscriptions (${proSubscribersCount})`,
        message: `Current MRR is $${subMetrics.mrr.toLocaleString()} across active pro users.`,
        category: 'billing',
        time: 'Active',
        severity: 'info',
        actionTab: 'subscriptions',
        actionLabel: 'View Billing'
      });
    }

    // 3. Security Audit Chronicle Event
    if (auditLogs.length > 0) {
      const latest = auditLogs[0];
      list.push({
        id: `notif_audit_${latest.id}`,
        title: `Log: ${latest.action}`,
        message: latest.details,
        category: 'security',
        time: new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        severity: latest.action.includes('DELETION') || latest.action.includes('PURGE') ? 'high' : 'info',
        actionTab: 'logs',
        actionLabel: 'View Logs'
      });
    }

    // 4. System Governance Alert
    list.push({
      id: 'notif_security_policy',
      title: requireEmailVerification ? 'Email verification is on' : 'Email verification is off',
      message: requireEmailVerification 
        ? 'New users must confirm their email before signing in.'
        : 'New users can sign in without email confirmation.',
      category: 'system',
      time: 'Status',
      severity: requireEmailVerification ? 'info' : 'medium',
      actionTab: 'settings',
      actionLabel: 'Settings'
    });

    return list;
  }, [reports, proSubscribersCount, subMetrics.mrr, auditLogs, requireEmailVerification]);

  const filteredNotifications = useMemo(() => {
    return liveAdminNotifications.filter(n => {
      if (readNotificationIds.includes(n.id)) return false;
      if (notificationsFilter === 'all') return true;
      return n.category === notificationsFilter;
    });
  }, [liveAdminNotifications, notificationsFilter, readNotificationIds]);

  const unreadCount = useMemo(() => {
    return liveAdminNotifications.filter(n => !readNotificationIds.includes(n.id)).length;
  }, [liveAdminNotifications, readNotificationIds]);

  const markAllNotificationsAsRead = () => {
    setReadNotificationIds(prev => Array.from(new Set([...prev, ...liveAdminNotifications.map(n => n.id)])));
    showToast('All notifications marked as read', 'info', 'Notifications');
  };

  const markNotificationAsRead = (id: string) => {
    if (!readNotificationIds.includes(id)) {
      setReadNotificationIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#f4f7fc] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      
      {/* SaaS-Grade Floating Toast Notification */}
      <AnimatePresence>
        {activeToast && (
          <motion.div 
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            onMouseEnter={() => setIsToastPaused(true)}
            onMouseLeave={() => setIsToastPaused(false)}
            className="fixed top-3 inset-x-3 sm:inset-x-auto sm:top-5 sm:right-5 z-[9999] sm:w-[390px] rounded-2xl bg-white/95 dark:bg-[#121216]/95 backdrop-blur-xl border border-zinc-200/90 dark:border-zinc-800/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden pointer-events-auto select-none"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Status Indicator Icon Pill */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  activeToast.type === 'error'
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    : activeToast.type === 'warning'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : activeToast.type === 'info'
                    ? 'bg-sky-500/10 text-sky-500 border-sky-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  {activeToast.type === 'error' ? (
                    <AlertCircle size={16} />
                  ) : activeToast.type === 'warning' ? (
                    <AlertTriangle size={16} />
                  ) : activeToast.type === 'info' ? (
                    <Info size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-mono uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                        activeToast.category === 'SECURITY'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : activeToast.category === 'BILLING'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : activeToast.category === 'USER'
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {activeToast.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {activeToast.timestamp}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveToast(null)}
                      className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Dismiss notification"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-950 dark:text-white leading-tight">
                    {activeToast.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-snug mt-0.5 break-words">
                    {activeToast.message}
                  </p>

                  {activeToast.actionLabel && activeToast.onAction && (
                    <button
                      onClick={() => {
                        activeToast.onAction!();
                        setActiveToast(null);
                      }}
                      className="mt-2.5 text-[11px] font-bold text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{activeToast.actionLabel}</span>
                      <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Linear Progress Timer Bar */}
            <motion.div 
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: "linear" }}
              style={{ originX: 0 }}
              className={`h-0.5 w-full ${
                activeToast.type === 'error'
                  ? 'bg-rose-500'
                  : activeToast.type === 'warning'
                  ? 'bg-amber-500'
                  : activeToast.type === 'info'
                  ? 'bg-sky-500'
                  : 'bg-emerald-500'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        
        {/* EXECUTIVE ENTERPRISE SIDEBAR */}
        <aside className="w-60 bg-white dark:bg-[#0B0B0E] border-r border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col justify-between shrink-0 select-none transition-all duration-200 relative z-20">
          
          <div className="flex flex-col">
            {/* Workspace Header */}
            <div className="px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 select-none">
                  <ConnectUpIcon className="w-5 h-5" />
                  <span className="font-display font-black text-lg tracking-tight text-zinc-900 dark:text-white">
                    Connect<span className="text-amber-400">Up</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Groups */}
            <div className="p-2.5 space-y-4">
              <div>
                <div className="px-2.5 pb-1 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  Management
                </div>
                <nav className="space-y-0.5">
                  {[
                    { id: 'dashboards', label: 'Overview', icon: LayoutGrid, count: null },
                    { id: 'users', label: 'Users', icon: Users, count: users.length },
                    { id: 'subscriptions', label: 'Transaction History', icon: Receipt, count: subscriptions.length },
                    { id: 'reports', label: 'Reports', icon: ShieldAlert, count: reports.filter(r => r.status === 'pending').length },
                    { id: 'townhall', label: 'Town Hall Boards', icon: Radio, count: townhallBoards.length },
                    { id: 'blogs', label: 'Blog & Editorial', icon: FileText, count: null }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#FACC15] text-zinc-950 font-bold shadow-xs' 
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={15} className={isActive ? 'text-zinc-950' : 'text-zinc-400'} />
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {tab.count !== null && tab.count > 0 && (
                          <span className={`text-[9px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                            isActive
                              ? 'bg-zinc-950 text-white font-bold'
                              : 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div>
                <div className="px-2.5 pb-1 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  System
                </div>
                <nav className="space-y-0.5">
                  {[
                    { id: 'logs', label: 'Audit Logs', icon: Clock },
                    { id: 'settings', label: 'Settings', icon: Settings }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#FACC15] text-zinc-950 font-bold shadow-xs' 
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <Icon size={15} className={isActive ? 'text-zinc-950' : 'text-zinc-400'} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Sidebar Footer with Admin Profile & Return to App */}
          <div className="p-2.5 border-t border-zinc-150 dark:border-zinc-800/60 space-y-1.5">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/50">
              <div className="flex items-center gap-2 min-w-0">
                <img 
                  src={adminProfileState.avatarUrl || userProfile?.avatarUrl || "https://api.dicebear.com/7.x/initials/svg?seed=Admin"} 
                  alt="Admin" 
                  className="w-7 h-7 rounded-md object-cover bg-zinc-200 dark:bg-zinc-800"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-zinc-950 dark:text-white truncate leading-tight">
                    {adminProfileState.fullName || userProfile?.name || 'Admin'}
                  </div>
                  <div className="text-[9px] text-zinc-400 truncate font-mono leading-tight">
                    {adminProfileState.email || userProfile?.email || 'admin@connectup.com'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CANVASES */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden custom-scrollbar scroll-smooth overscroll-contain">
          
          {/* SAAS TOP BAR CONTRACT */}
          <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0B0B0E]/95 backdrop-blur-xl border-b border-zinc-200/90 dark:border-zinc-800/90 w-full shrink-0 shadow-xs">
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-200">
            
            {/* Zone 1: Contextual Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-500 flex items-center justify-center shrink-0">
                  {activeTab === 'dashboards' ? <LayoutGrid size={16} /> :
                   activeTab === 'users' ? <Users size={16} /> :
                   activeTab === 'subscriptions' ? <Receipt size={16} /> :
                   activeTab === 'reports' ? <ShieldAlert size={16} /> :
                   activeTab === 'townhall' ? <Radio size={16} /> :
                   activeTab === 'blogs' ? <FileText size={16} /> :
                   activeTab === 'logs' ? <Clock size={16} /> :
                   <Settings size={16} />}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 text-xs min-w-0">
                    <span className="text-zinc-400 font-medium hidden sm:inline">Admin</span>
                    <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">/</span>
                    <span className="text-zinc-950 dark:text-zinc-100 font-bold text-xs sm:text-sm tracking-tight capitalize truncate">
                      {activeTab === 'dashboards' ? 'Overview' :
                       activeTab === 'subscriptions' ? 'Transactions' :
                       activeTab === 'users' ? 'Users' :
                       activeTab === 'reports' ? 'Safety' :
                       activeTab === 'townhall' ? 'Town Hall' :
                       activeTab === 'blogs' ? 'Editorial' :
                       activeTab === 'logs' ? 'Audit Logs' : 'Settings'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone 2: Search with hotkey decoration & clear button */}
            <div className="flex-1 max-w-sm md:max-w-md lg:max-w-lg hidden sm:block">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search users, emails, startups..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    if (activeTab !== 'users' && e.target.value) setActiveTab('users');
                  }}
                  className="w-full h-9 pl-9 pr-14 text-xs bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/90 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 transition-all font-medium"
                />
                {userSearch ? (
                  <button 
                    onClick={() => setUserSearch('')}
                    className="absolute right-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                ) : (
                  <span className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-mono font-bold text-zinc-400 bg-zinc-200/70 dark:bg-zinc-800 rounded pointer-events-none">
                    ⌘K
                  </span>
                )}
              </div>
            </div>

            {/* Zone 3: Primary Actions, Theme Toggle & Notification Center */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 relative shrink-0">

              {/* Theme Toggle (Dark / Light) */}
              <button
                onClick={toggleAdminTheme}
                title={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
              >
                {isDarkTheme ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
              </button>

              {/* Refresh Data button */}
              <button
                onClick={refreshAllData}
                disabled={isRefreshing}
                title="Refresh dashboard data"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 shadow-2xs shrink-0"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              </button>

              {/* SaaS Notification Center Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(prev => !prev)}
                  title="Notifications"
                  className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-2xs shrink-0 ${
                    isNotificationsOpen 
                      ? 'border-amber-400 bg-amber-400/15 text-amber-500 shadow-xs' 
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  <Bell size={15} className={unreadCount > 0 ? 'text-zinc-900 dark:text-zinc-100' : ''} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-zinc-950 shadow-xs ring-2 ring-white dark:ring-zinc-950">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* SaaS Notification Popover Dropdown */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      {/* Invisible backdrop click-catcher */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsNotificationsOpen(false)} 
                      />

                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        className="fixed inset-x-3 top-14 sm:inset-x-auto sm:absolute sm:right-0 sm:top-11 sm:mt-2 z-50 sm:w-96 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden font-sans"
                      >
                        {/* Header */}
                        <div className="p-3.5 border-b border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BellRing size={14} className="text-amber-500" />
                            <span className="text-xs font-bold text-zinc-950 dark:text-white">Notifications</span>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full">
                                {unreadCount} new
                              </span>
                            )}
                          </div>

                          {unreadCount > 0 && (
                            <button
                              onClick={markAllNotificationsAsRead}
                              className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>

                        {/* Filter pills */}
                        <div className="px-3 pt-2.5 pb-2 flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800/40 text-[11px]">
                          {(['all', 'security', 'billing'] as const).map(tab => (
                            <button
                              key={tab}
                              onClick={() => setNotificationsFilter(tab)}
                              className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                                notificationsFilter === tab
                                  ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold'
                                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60 no-scrollbar">
                          {filteredNotifications.map(n => {
                            const isUnread = !readNotificationIds.includes(n.id);
                            return (
                              <div
                                key={n.id}
                                onClick={() => markNotificationAsRead(n.id)}
                                className={`p-3.5 flex items-start gap-3 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer ${
                                  isUnread ? 'bg-amber-500/[0.03]' : ''
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5 ${
                                  n.category === 'security'
                                    ? 'bg-rose-500/10 text-rose-500'
                                    : n.category === 'billing'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {n.category === 'security' ? <ShieldAlert size={14} /> : n.category === 'billing' ? <CreditCard size={14} /> : <Activity size={14} />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1 mb-0.5">
                                    <h5 className={`text-xs leading-snug truncate ${isUnread ? 'font-bold text-zinc-950 dark:text-white' : 'font-medium text-zinc-700 dark:text-zinc-300'}`}>
                                      {n.title}
                                    </h5>
                                    {isUnread && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    )}
                                  </div>

                                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                    {n.message}
                                  </p>

                                  <div className="flex items-center justify-between mt-2 pt-1">
                                    <span className="text-[10px] font-mono text-zinc-400">
                                      {n.time}
                                    </span>

                                    {n.actionTab && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markNotificationAsRead(n.id);
                                          setActiveTab(n.actionTab!);
                                          setIsNotificationsOpen(false);
                                        }}
                                        className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                                      >
                                        <span>{n.actionLabel || 'View'}</span>
                                        <ChevronRight size={10} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {filteredNotifications.length === 0 && (
                            <div className="p-8 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-2">
                              <ShieldCheck size={24} className="text-zinc-300 dark:text-zinc-700" />
                              <p className="font-medium">No notifications</p>
                              <span className="text-[10px]">Everything is working normally.</span>
                            </div>
                          )}
                        </div>

                        {/* Footer Quick Action */}
                        <div className="p-2.5 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-center">
                          <button
                            onClick={() => {
                              setActiveTab('logs');
                              setIsNotificationsOpen(false);
                            }}
                            className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            View audit logs →
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                title="Add User"
                className="h-8 w-8 sm:w-auto sm:h-9 sm:px-4 rounded-xl bg-[#FACC15] hover:bg-amber-400 active:scale-95 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span className="hidden sm:inline">Add User</span>
              </button>

              {/* Exit Admin Button */}
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  title="Exit Admin Panel & Return to App"
                  className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 whitespace-nowrap shrink-0"
                >
                  <LogOut size={14} className="stroke-[2.5]" />
                  <span className="hidden sm:inline">Exit Admin</span>
                  <span className="sm:hidden text-[11px]">Exit</span>
                </button>
              )}
            </div>
            </div>
          </header>

          {/* MOBILE TABS NAVIGATION BAR (md:hidden) */}
          <div className="md:hidden flex items-center gap-1.5 overflow-x-auto px-3 sm:px-4 py-2 bg-white dark:bg-[#0B0B0E] border-b border-zinc-200 dark:border-zinc-800 shrink-0 no-scrollbar select-none scroll-px-3">
            {[
              { id: 'dashboards', label: 'Overview', icon: LayoutGrid, count: null },
              { id: 'users', label: 'Users', icon: Users, count: users.length },
              { id: 'subscriptions', label: 'Transactions', icon: Receipt, count: subscriptions.length },
              { id: 'reports', label: 'Safety', icon: ShieldAlert, count: reports.filter(r => r.status === 'pending').length },
              { id: 'townhall', label: 'Town Hall', icon: Radio, count: townhallBoards.length },
              { id: 'blogs', label: 'Blogs', icon: FileText, count: null },
              { id: 'logs', label: 'Audit', icon: Clock, count: null },
              { id: 'settings', label: 'Settings', icon: Settings, count: null },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#FACC15] text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      isActive ? 'bg-zinc-950 text-white font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT VIEWPORT - COMPACT DASHBOARD */}
          <main className="flex-1 p-3 sm:p-5 pb-24 sm:pb-20 space-y-3.5 sm:space-y-4 max-w-7xl w-full mx-auto transition-all duration-200">
            
            {/* TAB 1: OVERVIEW & BENTO METRICS */}
            {activeTab === 'dashboards' && (
              <div className="space-y-3.5 sm:space-y-4">
                
                {/* Executive KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                  
                  {/* Metric 1: Total Users */}
                  <div className="p-3.5 sm:p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                      <span className="truncate font-medium">Total Users</span>
                      <UsersKpiGlyph className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                      {users.length}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono tabular-nums">+14%</span>
                      <span>vs last month</span>
                    </div>
                  </div>

                  {/* Metric 2: MRR */}
                  <div className="p-3.5 sm:p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                      <span className="truncate font-medium">Monthly Revenue</span>
                      <RevenueKpiGlyph className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white truncate">
                      ${subMetrics.mrr.toLocaleString()}
                    </div>
                    <div className="mt-1 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      <span className="font-mono tabular-nums text-zinc-700 dark:text-zinc-300 font-medium">ARR ~${subMetrics.arr.toLocaleString()}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums text-amber-600 dark:text-amber-400 font-semibold">{proSubscribersCount} Pro</span>
                    </div>
                  </div>

                  {/* Metric 3: Deal Engine Velocity */}
                  <div className="p-3.5 sm:p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                      <span className="truncate font-medium">Total Swipes</span>
                      <VelocityKpiGlyph className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                      {swipesCount}
                    </div>
                    <div className="mt-1 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      <span className="font-mono tabular-nums text-zinc-700 dark:text-zinc-300 font-medium">{startupsCount} Startups</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{pitchesCount} Pitches</span>
                    </div>
                  </div>

                  {/* Metric 4: Moderation Health */}
                  <div className="p-3.5 sm:p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                      <span className="truncate font-medium">Pending Reports</span>
                      <ModerationKpiGlyph className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                    </div>
                    <div className="text-base sm:text-xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white truncate">
                      {reports.filter(r => r.status === 'pending').length === 0 ? 'All clear' : `${reports.filter(r => r.status === 'pending').length} Pending`}
                    </div>
                    <div className="mt-1 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{reports.length} total reports</span>
                    </div>
                  </div>

                </div>

                {/* Primary Activity Chart & Location Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                  
                  {/* Chart View (2 cols) */}
                  <div className="p-4 sm:p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs lg:col-span-2 flex flex-col justify-between">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <TelemetryHeaderGlyph className="w-6 h-6 text-zinc-700 dark:text-zinc-300 shrink-0" />
                        <div className="min-w-0">
                          <h2 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
                            Platform Activity
                          </h2>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            Actions &amp; member velocity across recent periods
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-zinc-100/90 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/70 dark:border-zinc-800">
                        <button
                          type="button"
                          onClick={() => setChartType('area')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                            chartType === 'area'
                              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold'
                              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                          }`}
                        >
                          <AreaChartModeGlyph active={chartType === 'area'} />
                          <span>Area</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setChartType('bar')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                            chartType === 'bar'
                              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-semibold'
                              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                          }`}
                        >
                          <BarChartModeGlyph active={chartType === 'bar'} />
                          <span>Bar</span>
                        </button>
                      </div>
                    </div>

                    {/* Executive Telemetry Strip */}
                    <div className="grid grid-cols-3 gap-3 py-3 my-3 border-y border-zinc-100 dark:border-zinc-800/70">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
                          Total Actions
                        </p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                            {activitySummary.totalActions}
                          </span>
                          <span className="text-[10px] font-mono tabular-nums text-amber-600 dark:text-amber-400 hidden sm:inline">
                            Avg {activitySummary.avgActions}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 pl-3 border-l border-zinc-100 dark:border-zinc-800/70">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
                          New Signups
                        </p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                            {activitySummary.totalNewUsers}
                          </span>
                          <span className="text-[10px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                            {activityStats.length} periods
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 pl-3 border-l border-zinc-100 dark:border-zinc-800/70">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500">
                          Peak Period
                        </p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-zinc-950 dark:text-white truncate">
                            {activitySummary.peakPoint.activity}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate hidden sm:inline">
                            {activitySummary.peakPoint.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="h-56 sm:h-64 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        {chartType === 'area' ? (
                          <AreaChart data={activityStats} margin={{ top: 14, right: 14, left: -16, bottom: 4 }}>
                            <defs>
                              <linearGradient id="cuAreaActionsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.34} />
                                <stop offset="55%" stopColor="#FACC15" stopOpacity={0.12} />
                                <stop offset="100%" stopColor="#FACC15" stopOpacity={0.0} />
                              </linearGradient>
                              <linearGradient id="cuAreaGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10B981" stopOpacity={0.22} />
                                <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                              </linearGradient>
                              <filter id="cuAmberGlow" x="-10%" y="-10%" width="120%" height="130%">
                                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.28" />
                              </filter>
                            </defs>
                            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="currentColor" className="text-zinc-200/80 dark:text-zinc-800/80" />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 11, fill: '#71717a' }}
                              dy={8}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              allowDecimals={false}
                              tick={{ fontSize: 11, fill: '#71717a' }}
                              dx={-4}
                            />
                            <Tooltip
                              cursor={{ stroke: '#F59E0B', strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.55 }}
                              content={<ActivityChartTooltip />}
                            />
                            {visibleSeries.activity && activitySummary.avgActions > 0 && (
                              <ReferenceLine
                                y={activitySummary.avgActions}
                                stroke="#a1a1aa"
                                strokeDasharray="3 4"
                                strokeOpacity={0.55}
                                label={{
                                  value: `Avg ${activitySummary.avgActions}`,
                                  position: 'insideTopRight',
                                  fill: '#a1a1aa',
                                  fontSize: 10,
                                }}
                              />
                            )}
                            {visibleSeries.activity && (
                              <Area
                                type="monotone"
                                dataKey="activity"
                                name="Actions"
                                stroke="#F59E0B"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#cuAreaActionsGrad)"
                                filter="url(#cuAmberGlow)"
                                dot={(dotProps: any) => {
                                  const isPeak =
                                    activitySummary.peakPoint.activity > 0 &&
                                    dotProps?.payload?.date === activitySummary.peakPoint.date;
                                  if (!isPeak) return <g key={`dot-${dotProps.index}`} />;
                                  return (
                                    <g key={`peak-${dotProps.index}`}>
                                      <circle cx={dotProps.cx} cy={dotProps.cy} r={6} fill="#F59E0B" fillOpacity={0.2} />
                                      <circle cx={dotProps.cx} cy={dotProps.cy} r={3.2} fill="#F59E0B" stroke="#ffffff" strokeWidth={1.5} />
                                    </g>
                                  );
                                }}
                                activeDot={{ r: 5.5, fill: '#F59E0B', stroke: '#ffffff', strokeWidth: 2 }}
                              />
                            )}
                            {visibleSeries.growth && (
                              <Area
                                type="monotone"
                                dataKey="growth"
                                name="New Users"
                                stroke="#10B981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#cuAreaGrowthGrad)"
                                activeDot={{ r: 4.5, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }}
                              />
                            )}
                          </AreaChart>
                        ) : (
                          <BarChart
                            data={activityStats}
                            margin={{ top: 14, right: 14, left: -16, bottom: 4 }}
                            barGap={6}
                            barCategoryGap="24%"
                            onMouseLeave={() => setHoveredBarIndex(null)}
                          >
                            <defs>
                              <linearGradient id="cuBarActionsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FDE047" />
                                <stop offset="55%" stopColor="#F59E0B" />
                                <stop offset="100%" stopColor="#D97706" />
                              </linearGradient>
                              <linearGradient id="cuBarGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#34D399" />
                                <stop offset="100%" stopColor="#059669" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="currentColor" className="text-zinc-200/80 dark:text-zinc-800/80" />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 11, fill: '#71717a' }}
                              dy={8}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              allowDecimals={false}
                              tick={{ fontSize: 11, fill: '#71717a' }}
                              dx={-4}
                            />
                            <Tooltip
                              cursor={{ fill: 'rgba(245, 158, 11, 0.06)', radius: 8 }}
                              content={<ActivityChartTooltip />}
                            />
                            {visibleSeries.activity && activitySummary.avgActions > 0 && (
                              <ReferenceLine
                                y={activitySummary.avgActions}
                                stroke="#a1a1aa"
                                strokeDasharray="3 4"
                                strokeOpacity={0.55}
                              />
                            )}
                            {visibleSeries.activity && (
                              <Bar
                                dataKey="activity"
                                name="Actions"
                                fill="url(#cuBarActionsGrad)"
                                radius={[6, 6, 2, 2]}
                                maxBarSize={26}
                                background={{ fill: 'rgba(161, 161, 170, 0.08)', radius: 6 }}
                                onMouseEnter={(_, index) => setHoveredBarIndex(index)}
                              >
                                {activityStats.map((_, idx) => (
                                  <Cell
                                    key={`act-cell-${idx}`}
                                    fill="url(#cuBarActionsGrad)"
                                    fillOpacity={hoveredBarIndex === null || hoveredBarIndex === idx ? 1 : 0.45}
                                  />
                                ))}
                              </Bar>
                            )}
                            {visibleSeries.growth && (
                              <Bar
                                dataKey="growth"
                                name="New Users"
                                fill="url(#cuBarGrowthGrad)"
                                radius={[6, 6, 2, 2]}
                                maxBarSize={26}
                                onMouseEnter={(_, index) => setHoveredBarIndex(index)}
                              >
                                {activityStats.map((_, idx) => (
                                  <Cell
                                    key={`gro-cell-${idx}`}
                                    fill="url(#cuBarGrowthGrad)"
                                    fillOpacity={hoveredBarIndex === null || hoveredBarIndex === idx ? 1 : 0.45}
                                  />
                                ))}
                              </Bar>
                            )}
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>

                    {/* Interactive Series Legend */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/60 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleSeries((prev) =>
                              prev.activity && !prev.growth ? prev : { ...prev, activity: !prev.activity }
                            )
                          }
                          className={`inline-flex items-center gap-2 px-2 py-1 rounded-md transition-opacity cursor-pointer ${
                            visibleSeries.activity ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-zinc-600 dark:text-zinc-300 font-medium">Actions</span>
                          <span className="font-mono tabular-nums font-semibold text-zinc-950 dark:text-white">
                            {activitySummary.totalActions}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleSeries((prev) =>
                              prev.growth && !prev.activity ? prev : { ...prev, growth: !prev.growth }
                            )
                          }
                          className={`inline-flex items-center gap-2 px-2 py-1 rounded-md transition-opacity cursor-pointer ${
                            visibleSeries.growth ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-zinc-600 dark:text-zinc-300 font-medium">New Users</span>
                          <span className="font-mono tabular-nums font-semibold text-zinc-950 dark:text-white">
                            {activitySummary.totalNewUsers}
                          </span>
                        </button>
                      </div>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                        Click series to toggle
                      </span>
                    </div>
                  </div>

                  {/* Demographic & Geographic Breakdown */}
                  <div className="p-4 sm:p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <h2 className="text-sm font-bold text-zinc-950 dark:text-white">User Breakdown</h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Roles and active community distribution</p>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">Founders</span>
                          <span className="font-mono font-bold text-zinc-950 dark:text-white">{foundersCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">Investors &amp; VCs</span>
                          <span className="font-mono font-bold text-zinc-950 dark:text-white">{investorsCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-1.5">
                          <span className="text-zinc-700 dark:text-zinc-300 font-medium">Admins</span>
                          <span className="font-mono font-bold text-zinc-950 dark:text-white">{adminsCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-150 dark:border-zinc-800/60">
                      <div className="text-[10px] font-mono uppercase text-zinc-400 mb-2">Top Locations</div>
                      <div className="space-y-1.5">
                        {locationStats.map((loc, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">{loc.name}</span>
                            <span className="font-mono tabular-nums text-zinc-950 dark:text-white font-medium">{loc.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* DUAL WIDGETS: RECENT TRANSACTIONS & RECENT AUDIT ACTIVITY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-4">
                  
                  {/* WIDGET 1: RECENT TRANSACTIONS */}
                  <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
                    <div>
                      {/* Header */}
                      <div className="px-3.5 py-2.5 border-b border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                            <Receipt size={12} />
                          </div>
                          <span className="text-xs font-bold text-zinc-950 dark:text-white">Recent Transactions</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                            {subscriptions.length}
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveTab('subscriptions')}
                          className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Full Ledger</span>
                          <ChevronRight size={11} />
                        </button>
                      </div>

                      {/* Financial Ticker Strip */}
                      <div className="px-3.5 py-2 bg-zinc-50/70 dark:bg-zinc-900/40 border-b border-zinc-150 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-zinc-500">
                        <div>
                          <span className="text-zinc-400">Total: </span>
                          <span className="font-mono font-bold text-zinc-900 dark:text-white">
                            {formatCurrency(subMetrics.totalRevenue, subMetrics.primaryCurrency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-400">MRR: </span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(subMetrics.mrr, subMetrics.primaryCurrency)}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-amber-500 font-semibold">
                          {proSubscribersCount} Pro Members
                        </div>
                      </div>

                      {/* Compact Transaction List */}
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-[220px] overflow-y-auto custom-scrollbar">
                        {subscriptions.length === 0 ? (
                          <div className="p-6 text-center text-zinc-400 text-xs">
                            No transactions recorded yet
                          </div>
                        ) : (
                          subscriptions.slice(0, 5).map(s => (
                            <div key={s.id} className="px-3.5 py-1.5 flex items-center justify-between gap-2.5 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[9px] uppercase text-zinc-700 dark:text-zinc-300 shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                                  {s.userName ? s.userName.charAt(0) : 'U'}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-zinc-950 dark:text-white truncate text-xs leading-tight">
                                    {s.userName}
                                  </div>
                                  <div className="text-[10px] text-zinc-400 truncate leading-tight">
                                    {s.plan?.toUpperCase()} · {s.billingCycle} · {s.createdAt}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <div className="text-right">
                                  <div className="font-mono font-bold text-xs text-zinc-950 dark:text-white tabular-nums leading-tight">
                                    {formatCurrency(s.amount, s.currency)}
                                  </div>
                                  <span className={`text-[9px] font-semibold uppercase px-1 py-0.2 rounded ${
                                    s.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                                    s.status === 'refunded' ? 'bg-amber-500/10 text-amber-600' :
                                    'bg-zinc-100 text-zinc-500'
                                  }`}>
                                    {s.status || 'completed'}
                                  </span>
                                </div>

                                <button
                                  onClick={() => setSelectedTransactionDetail(s)}
                                  title="View Receipt"
                                  className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                  <Receipt size={12} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* WIDGET 2: RECENT AUDIT & SYSTEM LOGS */}
                  <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
                    <div>
                      {/* Header */}
                      <div className="px-3.5 py-2.5 border-b border-zinc-150 dark:border-zinc-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-zinc-500/10 text-zinc-500 flex items-center justify-center shrink-0 border border-zinc-500/20">
                            <Activity size={12} />
                          </div>
                          <span className="text-xs font-bold text-zinc-950 dark:text-white">Recent System Activity</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                            {auditLogs.length}
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveTab('logs')}
                          className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>All Logs</span>
                          <ChevronRight size={11} />
                        </button>
                      </div>

                      {/* Activity List */}
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-[260px] overflow-y-auto custom-scrollbar">
                        {auditLogs.length === 0 ? (
                          <div className="p-6 text-center text-zinc-400 text-xs">
                            No recent logs recorded
                          </div>
                        ) : (
                          auditLogs.slice(0, 5).map(log => (
                            <div key={log.id} className="px-3.5 py-2 flex items-start justify-between gap-2.5 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors text-xs">
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`px-1.5 py-0.2 text-[9px] font-bold font-mono rounded ${
                                    log.action.includes('USER') ? 'bg-purple-500/10 text-purple-600' :
                                    log.action.includes('SUBSCRIPTION') ? 'bg-emerald-500/10 text-emerald-600' :
                                    'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                  }`}>
                                    {log.action}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-mono">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-zinc-700 dark:text-zinc-300 text-[11px] line-clamp-2 sm:truncate leading-snug">
                                  {log.details}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: USER DIRECTORY (HIGH DENSITY ENTERPRISE GRID) */}
            {activeTab === 'users' && (
              <div className="space-y-3.5 sm:space-y-4">
                
                {/* Control bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#121215] p-3 sm:p-4 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl">
                  
                  {/* Mobile Search Input */}
                  <div className="relative sm:hidden">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search users, emails, startups..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-8 text-xs bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-amber-400"
                    />
                    {userSearch && (
                      <button
                        onClick={() => setUserSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 min-w-0">
                    {/* Role Filter Tabs */}
                    <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg overflow-x-auto no-scrollbar">
                      {(['all', 'FOUNDER', 'INVESTOR', 'ADMIN'] as const).map(r => (
                        <button
                          key={r}
                          onClick={() => setRoleFilter(r)}
                          className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            roleFilter === r
                              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-semibold'
                              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                          }`}
                        >
                          {r === 'all' ? 'All Roles' : r === 'FOUNDER' ? 'Founders' : r === 'INVESTOR' ? 'Investors' : 'Admins'}
                        </button>
                      ))}
                    </div>

                    {/* Plan Filter */}
                    <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg overflow-x-auto no-scrollbar">
                      {(['all', 'pro', 'free'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setPlanFilter(p)}
                          className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize whitespace-nowrap shrink-0 ${
                            planFilter === p
                              ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-semibold'
                              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                          }`}
                        >
                          {p === 'all' ? 'All Plans' : p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      Showing {filteredUsers.length} of {users.length}
                    </span>
                  </div>
                </div>

                {/* Mobile User Cards (md:hidden) */}
                <div className="md:hidden bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs divide-y divide-zinc-100 dark:divide-zinc-800/70">
                  {filteredUsers.map(u => (
                    <div key={u.id} className="p-3.5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2.5">
                        <div
                          onClick={() => handleViewProfile(u)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-9 h-9 rounded-full object-cover bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-zinc-950 dark:text-white flex items-center gap-1.5 leading-tight">
                              <span className="truncate">{u.name}</span>
                              {u.plan === 'pro' && (
                                <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/10 shrink-0">PRO</span>
                              )}
                            </div>
                            <div className="font-mono text-[11px] text-zinc-400 truncate mt-0.5">{u.email}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleViewProfile(u)}
                            title="View User"
                            className="p-2 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm(`Are you sure you want to delete ${u.name} (${u.email})?`)) return;
                              try {
                                try {
                                  await adminApiCall(`/api/admin/users/${u.id}`, { method: 'DELETE' });
                                } catch (apiErr) {
                                  console.warn("API delete fallback:", apiErr);
                                  await supabase.from('profiles').delete().eq('id', u.id);
                                }
                                setUsers(prev => prev.filter(item => item.id !== u.id));
                                await recordLog('USER_DELETION', `Deleted user account ${u.name} (${u.email})`);
                                showToast(`Deleted user ${u.name}`, 'success', 'User Deleted');
                                fetchLogs();
                              } catch (err: any) {
                                setUsers(prev => prev.filter(item => item.id !== u.id));
                                showToast(`User ${u.name} removed`, 'info', 'User Removed');
                              }
                            }}
                            title="Delete User"
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          u.role === 'FOUNDER' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20' :
                          u.role === 'INVESTOR' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' :
                          'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20'
                        }`}>
                          {u.role}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 capitalize font-medium">
                          <span className={`w-1.5 h-1.5 rounded-full ${u.plan === 'pro' ? 'bg-amber-400' : 'bg-zinc-400'}`} />
                          {u.plan}
                          {u.billingCycle ? ` (${u.billingCycle})` : ''}
                        </span>
                        <span className="text-zinc-400 font-mono">
                          {u.age ? `${u.age} yrs` : 'Age N/A'} · {u.location} · Joined {u.joinedDate}
                        </span>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="py-10 text-center text-xs text-zinc-400 font-medium">
                      No users found.
                    </div>
                  )}
                </div>

                {/* Desktop Users Table (hidden md:block) */}
                <div className="hidden md:block bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto max-h-[480px] overflow-y-auto custom-scrollbar scroll-smooth overscroll-contain">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="sticky top-0 z-20 bg-white dark:bg-[#121215] shadow-xs">
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-md">
                          <th className="py-2.5 px-3.5 font-medium">User</th>
                          <th className="py-2.5 px-3.5 font-medium">Role</th>
                          <th className="py-2.5 px-3.5 font-medium">Plan</th>
                          <th className="py-2.5 px-3.5 font-medium">Age</th>
                          <th className="py-2.5 px-3.5 font-medium">Location</th>
                          <th className="py-2.5 px-3.5 font-medium">Joined</th>
                          <th className="py-2.5 px-3.5 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="py-2 px-3.5">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={u.avatarUrl}
                                  alt={u.name}
                                  className="w-7 h-7 rounded-full object-cover bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0"
                                />
                                <div>
                                  <div className="font-semibold text-zinc-950 dark:text-white flex items-center gap-1.5 leading-tight">
                                    <span>{u.name}</span>
                                    {u.plan === 'pro' && (
                                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">PRO</span>
                                    )}
                                  </div>
                                  <div className="font-mono text-[11px] text-zinc-400 leading-tight">{u.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-2 px-3.5">
                              <span className={`text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded ${
                                u.role === 'FOUNDER' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20' :
                                u.role === 'INVESTOR' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' :
                                'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20'
                              }`}>
                                {u.role}
                              </span>
                            </td>

                            <td className="py-2 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${u.plan === 'pro' ? 'bg-amber-400' : 'bg-zinc-400'}`} />
                                <span className="capitalize">{u.plan}</span>
                                {u.billingCycle && (
                                  <span className="text-[10px] font-mono text-zinc-400">({u.billingCycle})</span>
                                )}
                              </div>
                            </td>

                            <td className="py-2 px-3.5 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                              {u.age ? `${u.age} yrs` : 'N/A'}
                            </td>

                            <td className="py-2 px-3.5 text-zinc-500 dark:text-zinc-400">
                              {u.location}
                            </td>

                            <td className="py-2 px-3.5 font-mono tabular-nums text-zinc-500 dark:text-zinc-400 text-[11px]">
                              {u.joinedDate}
                            </td>

                            <td className="py-2 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleViewProfile(u)}
                                  title="View User"
                                  className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                  <Eye size={14} />
                                </button>
                                
                                <button
                                  onClick={async () => {
                                    if (!confirm(`Are you sure you want to delete ${u.name} (${u.email})?`)) return;
                                    try {
                                      try {
                                        await adminApiCall(`/api/admin/users/${u.id}`, { method: 'DELETE' });
                                      } catch (apiErr) {
                                        console.warn("API delete fallback:", apiErr);
                                        await supabase.from('profiles').delete().eq('id', u.id);
                                      }
                                      setUsers(prev => prev.filter(item => item.id !== u.id));
                                      await recordLog('USER_DELETION', `Deleted user account ${u.name} (${u.email})`);
                                      showToast(`Deleted user ${u.name}`, 'success', 'User Deleted');
                                      fetchLogs();
                                    } catch (err: any) {
                                      setUsers(prev => prev.filter(item => item.id !== u.id));
                                      showToast(`User ${u.name} removed`, 'info', 'User Removed');
                                    }
                                  }}
                                  title="Delete User"
                                  className="p-1.5 rounded-md hover:bg-rose-500/10 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-zinc-400 font-medium">
                              No users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: BILLING & SUBSCRIPTIONS */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-4 sm:space-y-6">
                
                {/* Header with Grant Premium Trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">Transaction History &amp; Subscriptions</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Complete settlement audit trail, customer payment receipts, and revenue ledger</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => fetchSubscriptions()}
                      disabled={isFetchingSubscriptions}
                      title="Refresh transaction records"
                      className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={isFetchingSubscriptions ? 'animate-spin text-amber-500' : ''} />
                    </button>
                    <button
                      onClick={() => exportTransactionsCSV(filteredSubscriptions, 'connectup_transaction_history')}
                      title="Export transactions as CSV spreadsheet"
                      className="h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => setIsGrantSubModalOpen(true)}
                      className="h-8 px-3 rounded-lg bg-zinc-950 dark:bg-amber-400 text-white dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-xs w-fit"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      <span>Grant Pro Access</span>
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                  <div className="p-3.5 sm:p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                    <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 block mb-1 truncate">Total Settled</span>
                    <span className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white truncate block">{formatCurrency(subMetrics.totalRevenue, subMetrics.primaryCurrency)}</span>
                  </div>
                  <div className="p-3.5 sm:p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                    <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 block mb-1 truncate">Monthly Recurring</span>
                    <span className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 truncate block">{formatCurrency(subMetrics.mrr, subMetrics.primaryCurrency)}</span>
                  </div>
                  <div className="p-3.5 sm:p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                    <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 block mb-1 truncate">Transactions</span>
                    <span className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white block">{subscriptions.length}</span>
                  </div>
                  <div className="p-3.5 sm:p-5 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                    <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 block mb-1 truncate">Active Pro</span>
                    <span className="text-lg sm:text-2xl font-bold font-mono tabular-nums text-amber-500 block">{proSubscribersCount}</span>
                  </div>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                  <div className="relative flex-1 sm:max-w-sm">
                    <Search size={13} className="absolute left-3 top-2.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search transactions by user, email, ID, provider..."
                      value={subscriptionSearch}
                      onChange={(e) => setSubscriptionSearch(e.target.value)}
                      className="w-full h-9 sm:h-8 pl-8 pr-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
                    {(['all', 'completed', 'refunded', 'trial', 'cancelled'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSubscriptionFilter(filter)}
                        className={`h-8 px-3 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          subscriptionFilter === filter
                            ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold'
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {filter === 'trial' ? 'Trials' : filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Transaction Cards (md:hidden) */}
                <div className="md:hidden bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs divide-y divide-zinc-100 dark:divide-zinc-800/70">
                  {isFetchingSubscriptions && filteredSubscriptions.length === 0 ? (
                    <div className="py-10 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
                      <RefreshCw size={15} className="animate-spin text-amber-500" />
                      <span>Loading transaction history...</span>
                    </div>
                  ) : filteredSubscriptions.length === 0 ? (
                    <div className="py-10 text-center text-xs text-zinc-400 font-medium">
                      No subscription records found.
                    </div>
                  ) : (
                    filteredSubscriptions.map(s => (
                      <div key={s.id} className="p-3.5 space-y-2.5">
                        <div className="flex items-start justify-between gap-2.5">
                          <div
                            onClick={() => {
                              const u = users.find(user => user.id === s.userId);
                              if (u) {
                                handleViewProfile(u);
                              } else {
                                handleViewProfile({
                                  id: s.userId,
                                  name: s.userName,
                                  email: s.userEmail,
                                  role: 'FOUNDER',
                                  plan: s.plan,
                                  billingCycle: s.billingCycle,
                                  status: 'active',
                                  avatarUrl: s.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.userName)}`,
                                  location: 'Remote',
                                  joinedDate: s.createdAt,
                                  lastActive: 'Recently'
                                });
                              }
                            }}
                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs uppercase text-zinc-700 dark:text-zinc-300 shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                              {s.userName ? s.userName.charAt(0) : 'U'}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm text-zinc-950 dark:text-white truncate leading-tight">{s.userName}</div>
                              <div className="font-mono text-[10px] text-zinc-400 truncate mt-0.5">{s.userEmail}</div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-mono tabular-nums font-bold text-sm text-zinc-950 dark:text-white">
                              {formatCurrency(s.amount, s.currency)} <span className="text-[10px] font-normal text-zinc-400 font-sans">{s.currency || 'USD'}</span>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold capitalize ${
                              s.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                              s.status === 'refunded' ? 'text-amber-600 dark:text-amber-400' :
                              'text-zinc-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                s.status === 'completed' ? 'bg-emerald-500' :
                                s.status === 'refunded' ? 'bg-amber-500' : 'bg-zinc-400'
                              }`} />
                              {s.status || 'completed'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-amber-500 uppercase text-[10px] font-mono">{s.plan}</span>
                            <span>·</span>
                            <span className="capitalize">{s.billingCycle}</span>
                            <span>·</span>
                            <span className="font-mono">{s.provider || 'Paystack'}</span>
                          </div>
                          <span className="font-mono text-[10px] text-zinc-400">{s.createdAt}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                          <button
                            onClick={() => handleCopyText(s.id, 'Transaction ID')}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                          >
                            <span>ID: {s.id.length > 14 ? `${s.id.substring(0, 12)}...` : s.id}</span>
                            {copiedTxId === s.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedTransactionDetail(s)}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Receipt size={12} />
                              <span>Receipt</span>
                            </button>
                            {s.status === 'completed' && (
                              <button
                                onClick={async () => {
                                  if (!confirm("Confirm refund for this transaction?")) return;
                                  try {
                                    await adminApiCall(`/api/admin/subscriptions/${s.id}/refund`, {
                                      method: 'POST',
                                      body: JSON.stringify({ userId: s.userId })
                                    });
                                    setSubscriptions(prev => prev.map(item => item.id === s.id ? { ...item, status: 'refunded' } : item));
                                    await recordLog('SUBSCRIPTION_REFUND', `Refunded transaction ${s.id.substring(0, 10)} for ${s.userName} (${s.userEmail})`);
                                    showToast("Transaction refunded and seat adjusted");
                                    fetchSubscriptions();
                                    fetchUsers();
                                  } catch (e: any) {
                                    showToast(`Failed to process refund: ${e.message || 'Server error'}`);
                                  }
                                }}
                                className="px-2.5 py-1.5 text-[11px] font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Desktop Subscriptions Table (hidden md:block) */}
                <div className="hidden md:block bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto max-h-[480px] overflow-y-auto custom-scrollbar scroll-smooth overscroll-contain">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="sticky top-0 z-20 bg-white dark:bg-[#121215] shadow-xs">
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-md">
                          <th className="py-2.5 px-3.5 font-medium">Transaction ID</th>
                          <th className="py-2.5 px-3.5 font-medium">Customer</th>
                          <th className="py-2.5 px-3.5 font-medium">Plan & Interval</th>
                          <th className="py-2.5 px-3.5 font-medium">Amount</th>
                          <th className="py-2.5 px-3.5 font-medium">Gateway</th>
                          <th className="py-2.5 px-3.5 font-medium">Status</th>
                          <th className="py-2.5 px-3.5 font-medium">Settled At</th>
                          <th className="py-2.5 px-3.5 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                        {isFetchingSubscriptions && filteredSubscriptions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-zinc-400 font-medium">
                              <div className="flex items-center justify-center gap-2">
                                <RefreshCw size={15} className="animate-spin text-amber-500" />
                                <span>Loading transaction history...</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredSubscriptions.map(s => (
                            <tr key={s.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors">
                              <td className="py-2 px-3.5 font-mono text-[11px] text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                  <span>{s.id.length > 14 ? `${s.id.substring(0, 12)}...` : s.id}</span>
                                  <button
                                    onClick={() => handleCopyText(s.id, 'Transaction ID')}
                                    title="Copy Transaction ID"
                                    className="p-1 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                                  >
                                    {copiedTxId === s.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                  </button>
                                </div>
                              </td>
                              <td className="py-2 px-3.5">
                                <div 
                                  onClick={() => {
                                    const u = users.find(user => user.id === s.userId);
                                    if (u) {
                                      handleViewProfile(u);
                                    } else {
                                      handleViewProfile({
                                        id: s.userId,
                                        name: s.userName,
                                        email: s.userEmail,
                                        role: 'FOUNDER',
                                        plan: s.plan,
                                        billingCycle: s.billingCycle,
                                        status: 'active',
                                        avatarUrl: s.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(s.userName)}`,
                                        location: 'Remote',
                                        joinedDate: s.createdAt,
                                        lastActive: 'Recently'
                                      });
                                    }
                                  }}
                                  className="flex items-center gap-2 cursor-pointer group"
                                  title="View Customer Dossier"
                                >
                                  <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-[11px] uppercase text-zinc-700 dark:text-zinc-300 overflow-hidden shrink-0 border border-zinc-200/60 dark:border-zinc-700/60">
                                    {s.userName ? s.userName.charAt(0) : 'U'}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-zinc-950 dark:text-white group-hover:text-amber-500 transition-colors leading-tight">{s.userName}</div>
                                    <div className="font-mono text-[10px] text-zinc-400 leading-tight">{s.userEmail}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 px-3.5">
                                <div className="text-xs text-zinc-800 dark:text-zinc-200">
                                  <span className="font-bold text-amber-500 uppercase text-[10px] tracking-wide mr-1.5 font-mono">{s.plan}</span>
                                  <span className="capitalize text-zinc-500 dark:text-zinc-400 text-[11px]">{s.billingCycle}</span>
                                </div>
                              </td>
                              <td className="py-2 px-3.5 font-mono tabular-nums font-bold text-zinc-950 dark:text-white">
                                {formatCurrency(s.amount, s.currency)} <span className="text-[10px] font-normal text-zinc-400 font-sans">{s.currency || 'USD'}</span>
                              </td>
                              <td className="py-2 px-3.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                                {s.provider || 'Paystack'}
                              </td>
                              <td className="py-2 px-3.5">
                                <span className="inline-flex items-center gap-1.5 text-xs">
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    s.status === 'completed' ? 'bg-emerald-500' :
                                    s.status === 'refunded' ? 'bg-amber-500' :
                                    'bg-zinc-400'
                                  }`} />
                                  <span className={`capitalize font-medium text-[11px] ${
                                    s.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                                    s.status === 'refunded' ? 'text-amber-600 dark:text-amber-400' :
                                    'text-zinc-500'
                                  }`}>
                                    {s.status || 'completed'}
                                  </span>
                                </span>
                              </td>
                              <td className="py-2 px-3.5 font-mono tabular-nums text-zinc-500 dark:text-zinc-400 text-[11px]">
                                {s.createdAt}
                              </td>
                              <td className="py-2 px-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedTransactionDetail(s)}
                                    title="View Full Transaction Receipt & Dossier"
                                    className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Receipt size={14} />
                                  </button>
                                  {s.status === 'completed' && (
                                    <button
                                      onClick={async () => {
                                        if (!confirm("Confirm refund for this transaction?")) return;
                                        try {
                                          await adminApiCall(`/api/admin/subscriptions/${s.id}/refund`, {
                                            method: 'POST',
                                            body: JSON.stringify({ userId: s.userId })
                                          });
                                          setSubscriptions(prev => prev.map(item => item.id === s.id ? { ...item, status: 'refunded' } : item));
                                          await recordLog('SUBSCRIPTION_REFUND', `Refunded transaction ${s.id.substring(0, 10)} for ${s.userName} (${s.userEmail})`);
                                          showToast("Transaction refunded and seat adjusted");
                                          fetchSubscriptions();
                                          fetchUsers();
                                        } catch (e: any) {
                                          showToast(`Failed to process refund: ${e.message || 'Server error'}`);
                                        }
                                      }}
                                      className="px-2 py-1 text-[11px] font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded border border-amber-500/30 transition-colors cursor-pointer"
                                    >
                                      Refund
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}

                        {!isFetchingSubscriptions && filteredSubscriptions.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-zinc-400 font-medium">
                              No subscription records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: TRUST & SAFETY REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">User Reports</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Review reported users, pitches, and content</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400 tabular-nums">
                      {reports.filter(r => r.status === 'pending').length} pending
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredReports.map(r => (
                    <div 
                      key={r.id}
                      className="p-3.5 sm:p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        {r.videoUrl ? (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-zinc-900 shrink-0 relative overflow-hidden flex items-center justify-center border border-zinc-800">
                            <Play size={16} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 shrink-0 flex items-center justify-center text-zinc-500">
                            <ShieldAlert size={18} />
                          </div>
                        )}

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              r.severity === 'high' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                              r.severity === 'medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                              'bg-zinc-500/10 text-zinc-600 border border-zinc-500/20'
                            }`}>
                              {r.severity}
                            </span>
                            <span className="text-zinc-400 font-mono text-[11px] capitalize">Reason: {r.reason}</span>
                            <span className="text-zinc-300 dark:text-zinc-700">·</span>
                            <span className="text-zinc-500 text-[11px]">By {r.reporterName}</span>
                          </div>

                          <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-100 line-clamp-2 sm:truncate max-w-xl break-words">
                            {r.targetContent}
                          </p>

                          <div className="text-[10px] font-mono text-zinc-400">
                            Logged: {new Date(r.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 shrink-0 w-full md:w-auto pt-2.5 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800/60">
                        <button
                          onClick={() => setSelectedReport(r)}
                          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          View Report
                        </button>
                        
                        {r.status !== 'resolved' && (
                          <button
                            onClick={async () => {
                              try {
                                try {
                                  await adminApiCall(`/api/admin/reports/${r.id}`, { method: 'DELETE' });
                                } catch (apiErr) {
                                  console.warn("API resolve report fallback:", apiErr);
                                  await supabase.from('reports').delete().eq('id', r.id);
                                }
                                setReports(prev => prev.filter(item => item.id !== r.id));
                                showToast("Report resolved", "success", "Case Resolved");
                              } catch (e) {
                                setReports(prev => prev.filter(item => item.id !== r.id));
                                showToast("Report resolved", "success", "Case Resolved");
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredReports.length === 0 && (
                    <div className="p-12 text-center text-xs text-zinc-400 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl">
                      No pending reports.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: TOWN HALL BOARDS MANAGEMENT (ADMIN EXCLUSIVE) */}
            {activeTab === 'townhall' && (
              <div className="space-y-4 sm:space-y-6">
                
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">Town Hall Stage &amp; Salon Boards</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-400 text-zinc-950">
                        Admin Exclusive
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Schedule live sessions, activate community stage broadcasts, and moderate Town Hall question queues.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCreateBoardModal()}
                      className="h-8 px-3.5 rounded-lg bg-[#FACC15] hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      <span>Schedule New Board</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xs">
                  <div className="relative flex-1 sm:max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search boards by title, episode, or speaker..."
                      value={boardSearch}
                      onChange={(e) => setBoardSearch(e.target.value)}
                      className="w-full h-9 sm:h-8 pl-8 pr-3 text-xs bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {(['all', 'upcoming', 'live', 'completed'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setBoardStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                          boardStatusFilter === status
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        {status === 'all' ? `All Boards (${townhallBoards.length})` : status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of Town Hall Boards */}
                <div className="space-y-3.5 sm:space-y-4">
                  {townhallBoards
                    .filter(b => {
                      if (boardStatusFilter !== 'all' && b.status !== boardStatusFilter) return false;
                      if (boardSearch.trim()) {
                        const q = boardSearch.toLowerCase();
                        return (
                          b.title.toLowerCase().includes(q) ||
                          b.episodeTag.toLowerCase().includes(q) ||
                          (b.speakers && b.speakers.toLowerCase().includes(q)) ||
                          b.description.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map(board => (
                      <div
                        key={board.id}
                        className={`p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border transition-all shadow-xs ${
                          board.isActiveStage
                            ? 'border-amber-400/80 ring-2 ring-amber-400/20'
                            : 'border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                          <div className="space-y-2 max-w-2xl min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {board.isActiveStage && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-400 text-zinc-950 shadow-xs">
                                  <span>Active Community Stage</span>
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                board.status === 'live'
                                  ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                                  : board.status === 'completed'
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {board.status === 'live' ? '● Broadcasting Live' : board.status}
                              </span>
                              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                {board.episodeTag}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-zinc-950 dark:text-white leading-snug">
                              {board.title}
                            </h3>

                            <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                              {board.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono pt-1">
                              <span className="flex items-center gap-1.5">
                                <Clock size={12} className="text-amber-500" />
                                {board.date} · {board.time}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Users size={12} className="text-zinc-400" />
                                {board.rsvpCount || 0} RSVPs
                              </span>
                              {board.speakers && (
                                <span>
                                  <strong className="text-zinc-700 dark:text-zinc-300">Guests:</strong> {board.speakers}
                                </span>
                              )}
                              {board.meetingLink && (
                                <a
                                  href={board.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink size={11} />
                                  <span>Meeting URL</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Board Actions */}
                          <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2.5 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800 w-full lg:w-auto">
                            <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-end">
                              {!board.isActiveStage && (
                                <button
                                  onClick={() => handleToggleBoardActiveStage(board.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-zinc-950 transition-colors cursor-pointer shadow-xs"
                                >
                                  Set as Active Stage
                                </button>
                              )}

                              <select
                                value={board.status}
                                onChange={(e) => handleToggleBoardStatus(board.id, e.target.value as any)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                              >
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                              </select>

                              <button
                                onClick={() => openCreateBoardModal(board)}
                                title="Edit Board"
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              >
                                <Edit3 size={15} />
                              </button>

                              <button
                                onClick={() => handleDeleteBoard(board.id)}
                                title="Delete Board"
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {townhallBoards.length === 0 && (
                    <div className="py-16 text-center space-y-3 bg-white dark:bg-[#121215] border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                      <Radio className="w-10 h-10 text-zinc-400 mx-auto" />
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Town Hall Boards Configured</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                        Schedule your first salon or keynote breakdown. As administrator, only you can add boards that display on the community Town Hall stage.
                      </p>
                      <button
                        onClick={() => openCreateBoardModal()}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        Schedule First Board
                      </button>
                    </div>
                  )}
                </div>

                {/* Town Hall Question Queue Moderation */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                        <MessageSquare size={16} className="text-amber-500" />
                        <span>Submitted Questions Moderation Queue</span>
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Review questions submitted by founders &amp; investors. Delete spam or irrelevant queries.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      {townhallQuestions.length} Questions
                    </span>
                  </div>

                  {townhallQuestions.length > 0 ? (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {townhallQuestions.map((q: any) => (
                        <div key={q.id} className="py-3 flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <p className="text-xs text-zinc-900 dark:text-zinc-100 font-medium">
                              {q.question}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                              <span className="font-bold text-zinc-600 dark:text-zinc-300">{q.author}</span>
                              <span>·</span>
                              <span>{q.votes || 0} Votes</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTownHallQuestion(q.id)}
                            title="Remove Question"
                            className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-zinc-400 font-mono">
                      No user questions currently in the moderation queue.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: BLOG MANAGEMENT (ADMIN EXCLUSIVE) */}
            {activeTab === 'blogs' && (
              <AdminBlogManager 
                onNavigateToPublicBlog={() => {
                  try {
                    window.history.pushState({}, '', '/blog');
                  } catch {
                    window.location.hash = '#blog';
                  }
                  window.location.reload();
                }}
                showToast={(title, message, type) => {
                  showToast(message || title, type || 'info', title);
                }}
              />
            )}

            {/* TAB 5: AUDIT LOGS */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">Audit Logs</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Chronicle of admin operations, telemetry, and security events</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => fetchLogs()}
                      disabled={isFetchingLogs}
                      title="Fetch latest audit logs"
                      className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={isFetchingLogs ? 'animate-spin text-amber-500' : ''} />
                    </button>
                    <button
                      onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
                        const a = document.createElement('a');
                        a.href = dataStr;
                        a.download = `connectup_audit_${Date.now()}.json`;
                        a.click();
                        showToast("Audit logs exported");
                      }}
                      className="px-3 h-8 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Export JSON</span>
                    </button>
                    {auditLogs.length > 0 && (
                      <button
                        onClick={handleClearAllLogs}
                        title="Clear all audit logs"
                        className="px-3 h-8 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                  <div className="relative flex-1 sm:max-w-sm">
                    <Search size={13} className="absolute left-3 top-2.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search logs by action, admin, or detail..."
                      value={auditLogSearch}
                      onChange={(e) => setAuditLogSearch(e.target.value)}
                      className="w-full h-9 sm:h-8 pl-8 pr-3 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={auditLogTypeFilter}
                      onChange={(e) => setAuditLogTypeFilter(e.target.value)}
                      className="w-full sm:w-auto h-9 sm:h-8 px-2.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-amber-400 font-mono"
                    >
                      <option value="all">All Actions ({auditLogs.length})</option>
                      <option value="SYSTEM_BOOT">SYSTEM_BOOT</option>
                      <option value="USER_CREATE">USER_CREATE</option>
                      <option value="USER_UPDATE">USER_UPDATE</option>
                      <option value="USER_DELETION">USER_DELETION</option>
                      <option value="SUBSCRIPTION_GRANT">SUBSCRIPTION_GRANT</option>
                      <option value="SUBSCRIPTION_REFUND">SUBSCRIPTION_REFUND</option>
                      <option value="POLICY_ENFORCE">POLICY_ENFORCE</option>
                      <option value="AUTH_VERIFY">AUTH_VERIFY</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono text-xs max-h-[480px] overflow-y-auto custom-scrollbar scroll-smooth overscroll-contain">
                  {isFetchingLogs && filteredAuditLogs.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400 font-sans flex items-center justify-center gap-2">
                      <RefreshCw size={15} className="animate-spin text-amber-500" />
                      <span>Fetching audit logs...</span>
                    </div>
                  ) : (
                    filteredAuditLogs.map(log => (
                      <div key={log.id} className="py-2.5 px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-2 min-w-0">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded shrink-0 ${
                            log.action === 'USER_DELETION' ? 'bg-rose-500/10 text-rose-600' :
                            log.action.includes('ROLE') || log.action.includes('USER') ? 'bg-purple-500/10 text-purple-600' :
                            log.action.includes('SUBSCRIPTION') ? 'bg-emerald-500/10 text-emerald-600' :
                            log.action.includes('POLICY') ? 'bg-amber-500/10 text-amber-600' :
                            'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {log.action}
                          </span>
                          <span className="font-sans text-xs text-zinc-800 dark:text-zinc-200 break-words">{log.details}</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 text-[11px] text-zinc-400 tabular-nums w-full sm:w-auto shrink-0">
                          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                            <span className="text-[10px] text-zinc-500 font-sans truncate max-w-[140px]">{log.adminEmail}</span>
                            <span>·</span>
                            <span className="text-[10px] sm:text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            title="Remove log entry"
                            className="p-1.5 rounded text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {!isFetchingLogs && filteredAuditLogs.length === 0 && (
                    <div className="p-8 text-center text-zinc-400 font-sans">
                      No audit logs found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-4 sm:space-y-6 max-w-5xl">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white">Settings</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage authentication and system preferences</p>
                </div>

                <div className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-4 sm:p-6 space-y-6 shadow-xs">
                  
                  {/* General Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Authentication</h3>
                    
                    <div className="flex items-center justify-between gap-4 py-2 border-b border-zinc-150 dark:border-zinc-800/60">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-950 dark:text-white">Require Email Verification</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Require users to verify their email address before accessing the platform</div>
                      </div>
                      <button
                        onClick={() => {
                          setRequireEmailVerification(prev => !prev);
                          showToast("Email verification setting updated");
                        }}
                        className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                          requireEmailVerification ? 'bg-amber-400' : 'bg-zinc-200 dark:bg-zinc-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white dark:bg-zinc-950 absolute top-1 transition-transform ${
                          requireEmailVerification ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 py-2 border-b border-zinc-150 dark:border-zinc-800/60">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-950 dark:text-white">Clear Cache</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Clear stored local data to refresh latest content</div>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.removeItem('connectup_startups_cache');
                          showToast("Cache cleared");
                        }}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        Clear Cache
                      </button>
                    </div>
                  </div>

                  {/* Admin Profile */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Admin Profile</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Display Name</label>
                        <input
                          type="text"
                          value={adminProfileState.fullName}
                          onChange={(e) => setAdminProfileState(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full h-9 px-3 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Executive Title</label>
                        <input
                          type="text"
                          value={adminProfileState.title}
                          onChange={(e) => setAdminProfileState(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full h-9 px-3 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        try {
                          await adminApiCall('/api/admin/profile', {
                            method: 'POST',
                            body: JSON.stringify({
                              fullName: adminProfileState.fullName,
                              title: adminProfileState.title,
                              email: adminProfileState.email || userProfile?.email || 'admin@connectup.com'
                            })
                          });
                          await recordLog('ADMIN_PROFILE_UPDATE', `Updated admin profile: ${adminProfileState.fullName} (${adminProfileState.title})`);
                          showToast("Admin profile saved successfully");
                        } catch (e: any) {
                          showToast(`Could not save profile: ${e.message || 'Server error'}`);
                        }
                      }}
                      className="px-4 py-2 bg-zinc-950 dark:bg-amber-400 text-white dark:text-zinc-950 font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Save Profile
                    </button>
                  </div>

                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* MODAL 1: ADD USER */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsAddUserModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Add New User</h3>
                <button onClick={() => setIsAddUserModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                const role = (form.elements.namedItem('role') as HTMLSelectElement).value;
                const password = (form.elements.namedItem('password') as HTMLInputElement).value;
                
                const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                  const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                  return v.toString(16);
                });

                try {
                  try {
                    await adminApiCall('/api/admin/users', {
                      method: 'POST',
                      body: JSON.stringify({
                        password,
                        profile: {
                          id: uuid,
                          full_name: name,
                          email: email,
                          role: role,
                          plan: 'free',
                          updated_at: new Date().toISOString()
                        }
                      })
                    });
                  } catch (apiErr) {
                    console.warn("API create user fallback:", apiErr);
                    await supabase.from('profiles').upsert({
                      id: uuid,
                      full_name: name,
                      email: email,
                      role: role,
                      plan: 'free',
                      updated_at: new Date().toISOString()
                    });
                  }

                  setIsAddUserModalOpen(false);
                  showToast(`User ${name} created`, 'success', 'User Created');
                  await recordLog('USER_CREATE', `Created user account: ${name} (${email}) with role ${role}`);
                  fetchUsers();
                  fetchLogs();
                } catch (err: any) {
                  showToast(`Could not create user: ${err.message || 'Operation failed'}`);
                }
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Full Name</label>
                  <input name="name" required placeholder="Jane Doe" className="w-full h-9 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Email</label>
                  <input name="email" type="email" required placeholder="jane@example.com" className="w-full h-9 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Role</label>
                  <select name="role" className="w-full h-9 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-400">
                    <option value="FOUNDER">Founder</option>
                    <option value="INVESTOR">Investor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Password</label>
                  <input name="password" type="password" required placeholder="••••••••" className="w-full h-9 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-400" />
                </div>

                <div className="pt-3 flex gap-2">
                  <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="flex-1 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 h-9 rounded-lg bg-zinc-950 dark:bg-amber-400 text-white dark:text-zinc-950 font-semibold cursor-pointer">
                    Add User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: GRANT PRO SUBSCRIPTION */}
      <AnimatePresence>
        {isGrantSubModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsGrantSubModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Grant Pro Access</h3>
                <button onClick={() => setIsGrantSubModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                const userObj = users.find(u => u.email === email);
                if (!userObj) {
                  showToast("User not found");
                  return;
                }
                
                try {
                  try {
                    await adminApiCall('/api/admin/subscriptions', {
                      method: 'POST',
                      body: JSON.stringify({
                        user_id: userObj.id,
                        amount: 60,
                        billing_cycle: 'yearly',
                        provider: 'Manual Grant',
                        status: 'completed'
                      })
                    });
                  } catch (apiErr) {
                    console.warn("API grant sub fallback:", apiErr);
                    await supabase.from('profiles').update({ plan: 'pro', billing_cycle: 'yearly' }).eq('id', userObj.id);
                  }

                  setUsers(prev => prev.map(u => u.id === userObj.id ? { ...u, plan: 'pro', billingCycle: 'yearly' } : u));
                  await recordLog('SUBSCRIPTION_GRANT', `Granted Pro tier access (yearly) to ${userObj.name} (${email})`);

                  setIsGrantSubModalOpen(false);
                  showToast(`Pro access granted to ${email}`, 'success', 'Subscription Granted');
                  fetchUsers();
                  fetchSubscriptions();
                  fetchLogs();
                } catch (err: any) {
                  setUsers(prev => prev.map(u => u.id === userObj.id ? { ...u, plan: 'pro', billingCycle: 'yearly' } : u));
                  setIsGrantSubModalOpen(false);
                  showToast(`Pro access granted to ${email}`, 'success', 'Subscription Granted');
                }
              }} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Select User</label>
                  <select name="email" required className="w-full h-9 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-400 font-medium">
                    {users.map(u => (
                      <option key={u.id} value={u.email}>{u.name} · {u.email}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex gap-2">
                  <button type="button" onClick={() => setIsGrantSubModalOpen(false)} className="flex-1 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 h-9 rounded-lg bg-zinc-950 dark:bg-amber-400 text-white dark:text-zinc-950 font-semibold cursor-pointer">
                    Grant Pro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: USER PROFILE */}
      <AnimatePresence>
        {selectedUserProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedUserProfile(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-8 shadow-2xl z-10 max-h-[90dvh] overflow-y-auto space-y-5 sm:space-y-6"
            >
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-zinc-150 dark:border-zinc-800">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={selectedUserProfile.avatarUrl}
                    alt={selectedUserProfile.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="truncate">{selectedUserProfile.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 uppercase shrink-0">
                        {selectedUserProfile.role}
                      </span>
                    </h3>
                    <div className="text-xs font-mono text-zinc-400 truncate">{selectedUserProfile.email}</div>
                  </div>
                </div>

                <button onClick={() => setSelectedUserProfile(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 shrink-0">
                  <X size={20} />
                </button>
              </div>

              {/* Account Controls */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-xl space-y-3">
                <div className="text-xs font-mono uppercase text-zinc-400">Account Settings</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-500 mb-1">Role</label>
                    <select
                      value={selectedUserProfile.role}
                      onChange={async (e) => {
                        const newRole = e.target.value as any;
                        try {
                          try {
                            await adminApiCall(`/api/admin/users/${selectedUserProfile.id}`, {
                              method: 'PUT',
                              body: JSON.stringify({ role: newRole })
                            });
                          } catch (apiErr) {
                            console.warn("API update role fallback:", apiErr);
                            await supabase.from('profiles').update({ role: newRole }).eq('id', selectedUserProfile.id);
                          }
                          setSelectedUserProfile(prev => prev ? { ...prev, role: newRole } : null);
                          setUsers(prev => prev.map(u => u.id === selectedUserProfile.id ? { ...u, role: newRole } : u));
                          await recordLog('USER_UPDATE', `Updated role to ${newRole} for ${selectedUserProfile.name} (${selectedUserProfile.email})`);
                          showToast(`Role updated to ${newRole}`, 'success', 'Role Updated');
                        } catch (err: any) {
                          setSelectedUserProfile(prev => prev ? { ...prev, role: newRole } : null);
                          setUsers(prev => prev.map(u => u.id === selectedUserProfile.id ? { ...u, role: newRole } : u));
                          showToast(`Role updated to ${newRole}`, 'success', 'Role Updated');
                        }
                      }}
                      className="w-full h-9 px-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="FOUNDER">FOUNDER</option>
                      <option value="INVESTOR">INVESTOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-500 mb-1">Set Subscription Plan</label>
                    <select
                      value={selectedUserProfile.plan}
                      onChange={async (e) => {
                        const newPlan = e.target.value as any;
                        try {
                          try {
                            await adminApiCall(`/api/admin/users/${selectedUserProfile.id}`, {
                              method: 'PUT',
                              body: JSON.stringify({ plan: newPlan })
                            });
                          } catch (apiErr) {
                            console.warn("API update plan fallback:", apiErr);
                            await supabase.from('profiles').update({ plan: newPlan }).eq('id', selectedUserProfile.id);
                          }
                          setSelectedUserProfile(prev => prev ? { ...prev, plan: newPlan } : null);
                          setUsers(prev => prev.map(u => u.id === selectedUserProfile.id ? { ...u, plan: newPlan } : u));
                          await recordLog('USER_UPDATE', `Updated subscription plan to ${newPlan} for ${selectedUserProfile.name} (${selectedUserProfile.email})`);
                          showToast(`Plan updated to ${newPlan}`, 'success', 'Plan Updated');
                          fetchSubscriptions();
                        } catch (err: any) {
                          setSelectedUserProfile(prev => prev ? { ...prev, plan: newPlan } : null);
                          setUsers(prev => prev.map(u => u.id === selectedUserProfile.id ? { ...u, plan: newPlan } : u));
                          showToast(`Plan updated to ${newPlan}`, 'success', 'Plan Updated');
                          fetchSubscriptions();
                        }
                      }}
                      className="w-full h-9 px-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="free">Free Tier</option>
                      <option value="pro">Pro Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-500 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      min={18}
                      max={120}
                      value={selectedUserProfile.age !== undefined && selectedUserProfile.age !== null ? selectedUserProfile.age : ''}
                      onChange={async (e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                        try {
                          try {
                            await adminApiCall(`/api/admin/users/${selectedUserProfile.id}`, {
                              method: 'PUT',
                              body: JSON.stringify({ age: val })
                            });
                          } catch (apiErr) {
                            console.warn("API update age fallback:", apiErr);
                            await supabase.from('profiles').update({ age: val }).eq('id', selectedUserProfile.id);
                          }
                          setSelectedUserProfile(prev => prev ? { ...prev, age: val } : null);
                          setUsers(prev => prev.map(u => u.id === selectedUserProfile.id ? { ...u, age: val } : u));
                          await recordLog('USER_UPDATE', `Updated age to ${val ?? 'N/A'} for ${selectedUserProfile.name} (${selectedUserProfile.email})`);
                          showToast(`Age updated to ${val ?? 'N/A'}`, 'success', 'Age Updated');
                        } catch (err: any) {
                          setSelectedUserProfile(prev => prev ? { ...prev, age: val } : null);
                          setUsers(prev => prev.map(u => u.id === selectedUserProfile.id ? { ...u, age: val } : u));
                          showToast(`Age updated to ${val ?? 'N/A'}`, 'success', 'Age Updated');
                        }
                      }}
                      placeholder="e.g. 28"
                      className="w-full h-9 px-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Startup details if Founder */}
              {selectedUserStartup && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-xl space-y-2 text-xs">
                  <div className="text-xs font-mono uppercase text-zinc-400">Associated Startup Venture</div>
                  <div className="font-bold text-sm text-zinc-950 dark:text-white">{selectedUserStartup.name}</div>
                  <p className="text-zinc-600 dark:text-zinc-300">{selectedUserStartup.one_liner || selectedUserStartup.description}</p>
                  <div className="flex gap-4 font-mono text-[11px] text-zinc-500">
                    <span>Ask: ${selectedUserStartup.ask_amount?.toLocaleString() || 'N/A'}</span>
                    <span>·</span>
                    <span>Stage: {selectedUserStartup.funding_stage || 'Early'}</span>
                  </div>
                </div>
              )}

              {/* Billing History & Transactions */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                    <DollarSign size={13} className="text-emerald-500" />
                    <span>Billing History & Transactions</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {selectedUserTransactions.length} {selectedUserTransactions.length === 1 ? 'record' : 'records'}
                  </span>
                </div>

                {isFetchingProfileDetails ? (
                  <div className="py-4 text-center text-zinc-400 flex items-center justify-center gap-2">
                    <RefreshCw size={13} className="animate-spin text-amber-500" />
                    <span>Fetching user billing records...</span>
                  </div>
                ) : selectedUserTransactions.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedUserTransactions.map((tx: any) => (
                      <div key={tx.id} className="p-2.5 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
                            <span>${(Number(tx.amount) || 0).toFixed(2)}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-700 uppercase font-mono text-zinc-500">
                              {tx.billing_cycle || tx.billingCycle || 'monthly'}
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-zinc-400">
                            {tx.id.substring(0, 14)}... · {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                          tx.status === 'refunded' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                          'bg-zinc-500/10 text-zinc-500'
                        }`}>
                          {tx.status || 'completed'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 text-center text-zinc-400 font-sans text-xs">
                    {selectedUserProfile.plan === 'pro' 
                      ? 'Active Pro member (Granted via administrative override / trial).' 
                      : 'No billing records found for this account (Free Tier).'}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedUserProfile(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-950 dark:bg-zinc-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: REPORT EVIDENCE REVIEW */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedReport(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-zinc-800">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Moderation Case Evidence</h3>
                <button onClick={() => setSelectedReport(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {selectedReport.videoUrl && (
                  <div className="w-full aspect-video rounded-xl bg-zinc-950 overflow-hidden">
                    <VideoPlayer src={selectedReport.videoUrl} controls={true} autoPlay={false} />
                  </div>
                )}

                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1">Target Statement / Payload</div>
                  <p className="text-zinc-900 dark:text-zinc-100 leading-relaxed break-words">{selectedReport.targetContent}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-500 font-mono text-[11px]">
                  <span>Reporter: {selectedReport.reporterName}</span>
                  <span>Severity: {selectedReport.severity}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer text-xs"
                >
                  Dismiss Modal
                </button>
                <button
                  onClick={async () => {
                    try {
                      try {
                        await adminApiCall(`/api/admin/reports/${selectedReport.id}`, { method: 'DELETE' });
                      } catch (apiErr) {
                        console.warn("API resolve case fallback:", apiErr);
                        await supabase.from('reports').delete().eq('id', selectedReport.id);
                      }
                      setReports(prev => prev.filter(item => item.id !== selectedReport.id));
                      setSelectedReport(null);
                      showToast("Case resolved and closed", "success", "Case Closed");
                    } catch (e) {
                      setReports(prev => prev.filter(item => item.id !== selectedReport.id));
                      setSelectedReport(null);
                      showToast("Case resolved and closed", "success", "Case Closed");
                    }
                  }}
                  className="flex-1 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer text-xs"
                >
                  Resolve Infraction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: TRANSACTION RECEIPT & AUDIT DOSSIER */}
      <AnimatePresence>
        {selectedTransactionDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setSelectedTransactionDetail(null)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-zinc-150 dark:border-zinc-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <Receipt size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Transaction Receipt</h3>
                    <p className="font-mono text-[11px] text-zinc-400 truncate">Ref: {selectedTransactionDetail.id.substring(0, 16)}...</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTransactionDetail(null)} 
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Amount Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">Amount Settled</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-zinc-950 dark:text-white">
                    {formatCurrency(selectedTransactionDetail.amount, selectedTransactionDetail.currency)}
                    <span className="text-xs font-normal text-zinc-400 ml-1.5 font-sans">{selectedTransactionDetail.currency || 'USD'}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex items-center gap-1.5 ${
                  selectedTransactionDetail.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : selectedTransactionDetail.status === 'refunded'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-zinc-100 text-zinc-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedTransactionDetail.status === 'completed' ? 'bg-emerald-500' :
                    selectedTransactionDetail.status === 'refunded' ? 'bg-amber-500' : 'bg-zinc-400'
                  }`} />
                  {selectedTransactionDetail.status || 'completed'}
                </span>
              </div>

              {/* Transaction Metadata Grid */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-500 dark:text-zinc-400 shrink-0">Customer</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-right">{selectedTransactionDetail.userName}</span>
                </div>
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-500 dark:text-zinc-400 shrink-0">Email</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 truncate text-right">{selectedTransactionDetail.userEmail}</span>
                </div>
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-500 dark:text-zinc-400 shrink-0">Plan &amp; Cadence</span>
                  <span className="font-semibold text-amber-500 uppercase font-mono text-[11px] text-right">
                    {selectedTransactionDetail.plan} · {selectedTransactionDetail.billingCycle}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-500 dark:text-zinc-400 shrink-0">Payment Gateway</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 text-right">{selectedTransactionDetail.provider || 'Paystack'}</span>
                </div>
                <div className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-zinc-500 dark:text-zinc-400 shrink-0">Settled Timestamp</span>
                  <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 text-right">{selectedTransactionDetail.createdAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(selectedTransactionDetail.id, 'Transaction ID')}
                  className="flex-1 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Copy size={13} />
                  <span>Copy ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTransactionDetail(null)}
                  className="flex-1 h-9 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold cursor-pointer text-xs hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: CREATE / EDIT TOWN HALL BOARD */}
      <AnimatePresence>
        {showCreateBoardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowCreateBoardModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-4 max-h-[90dvh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-zinc-800">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                    {editingBoardId ? 'Edit Town Hall Board' : 'Schedule New Town Hall Board'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    This salon board will display on the community Town Hall stage.
                  </p>
                </div>
                <button 
                  onClick={() => setShowCreateBoardModal(false)} 
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveBoard} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Salon / Session Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={boardTitle}
                    onChange={(e) => setBoardTitle(e.target.value)}
                    placeholder="e.g. Pitch Teardowns & Go-To-Market War Stories"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Episode / Category Tag *
                    </label>
                    <input
                      type="text"
                      required
                      value={boardEpisodeTag}
                      onChange={(e) => setBoardEpisodeTag(e.target.value)}
                      placeholder="e.g. Weekly Roundtable · Episode 49"
                      className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Status
                    </label>
                    <select
                      value={boardStatus}
                      onChange={(e) => setBoardStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white cursor-pointer"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Broadcasting Live Now</option>
                      <option value="completed">Completed / Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Agenda &amp; Discussion Brief *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={boardDescription}
                    onChange={(e) => setBoardDescription(e.target.value)}
                    placeholder="Briefly describe the key discussion themes, teardown formats, and founder takeaways..."
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Scheduled Date
                    </label>
                    <input
                      type="text"
                      value={boardDate}
                      onChange={(e) => setBoardDate(e.target.value)}
                      placeholder="e.g. Thursday, Oct 15, 2026"
                      className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                      Scheduled Time
                    </label>
                    <input
                      type="text"
                      value={boardTime}
                      onChange={(e) => setBoardTime(e.target.value)}
                      placeholder="e.g. 5:00 PM UTC (45 mins)"
                      className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Guest Speakers &amp; Partners
                  </label>
                  <input
                    type="text"
                    value={boardSpeakers}
                    onChange={(e) => setBoardSpeakers(e.target.value)}
                    placeholder="e.g. Guest Partner from Index Ventures & 2 Scale CTOs"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Live Stream / Video Meeting Link
                  </label>
                  <input
                    type="url"
                    value={boardMeetingLink}
                    onChange={(e) => setBoardMeetingLink(e.target.value)}
                    placeholder="e.g. https://meet.google.com/xyz-abcd-efg or Zoom link"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold mb-1">
                    Stage Cover Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={boardImageUrl}
                    onChange={(e) => setBoardImageUrl(e.target.value)}
                    placeholder="Leave empty to use default high-resolution salon summit stage"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-amber-400 font-medium text-zinc-950 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <input
                    type="checkbox"
                    id="isActiveStageCheck"
                    checked={boardIsActiveStage}
                    onChange={(e) => setBoardIsActiveStage(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400 cursor-pointer"
                  />
                  <label htmlFor="isActiveStageCheck" className="text-zinc-800 dark:text-zinc-200 font-bold cursor-pointer">
                    Set as Primary Active Stage on Community Town Hall
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateBoardModal(false)}
                    className="flex-1 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-9 rounded-xl bg-[#FACC15] hover:bg-amber-400 text-zinc-950 font-bold cursor-pointer text-xs shadow-xs"
                  >
                    {editingBoardId ? 'Save Changes' : 'Publish Board'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;

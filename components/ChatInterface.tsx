import { motion } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { 
  SendHorizontal, Paperclip, ChevronLeft, 
  Search, Video, MessageCircle,
  User, Check, CheckCheck, Clock, FileText, Download,
  ImagePlus, FileImage, FileSpreadsheet,
  FileVideo, FileAudio, FileArchive, File
} from 'lucide-react';
import { UserRole, Message, ChatSession } from '../types';
import { StorageService } from '../services/storageService';
import { supabase } from '../services/supabaseClient';
import { EncryptionService } from '../services/encryptionService';
import { StatusIndicator } from './StatusIndicator';

const FALLBACK_GIFS = [
  {
    id: 'fb1',
    url: 'https://media.giphy.com/media/lMooIrB6v8N7A1A7An/giphy.gif', // nodding yes / agreement
    previewUrl: 'https://media.giphy.com/media/lMooIrB6v8N7A1A7An/200.gif',
    tag: ['agree', 'yes', 'nod', 'ok', 'colleague', 'founder']
  },
  {
    id: 'fb2',
    url: 'https://media.giphy.com/media/l3q2XhfQ8oCkm1K76/giphy.gif', // clap / celebration
    previewUrl: 'https://media.giphy.com/media/l3q2XhfQ8oCkm1K76/200.gif',
    tag: ['celebrate', 'clap', 'win', 'startup', 'happy', 'invest']
  },
  {
    id: 'fb3',
    url: 'https://media.giphy.com/media/d31w24psGYeekCZy/giphy.gif', // mind blown / idea
    previewUrl: 'https://media.giphy.com/media/d31w24psGYeekCZy/200.gif',
    tag: ['idea', 'wow', 'mind', 'blown', 'shock', 'creative', 'design']
  },
  {
    id: 'fb4',
    url: 'https://media.giphy.com/media/BPR6Nw79mgwi7HsGdO/giphy.gif', // cheers / celebration leo
    previewUrl: 'https://media.giphy.com/media/BPR6Nw79mgwi7HsGdO/200.gif',
    tag: ['celebrate', 'cheers', 'champagne', 'drink', 'win', 'investor']
  },
  {
    id: 'fb5',
    url: 'https://media.giphy.com/media/t3cL1ChAcf7qM/giphy.gif', // thumbs up office
    previewUrl: 'https://media.giphy.com/media/t3cL1ChAcf7qM/200.gif',
    tag: ['agree', 'yes', 'thumbs', 'up', 'office', 'cool', 'ok']
  },
  {
    id: 'fb6',
    url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', // coding / building keyboard
    previewUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/200.gif',
    tag: ['startup', 'coding', 'tech', 'build', 'work', 'keyboard']
  },
  {
    id: 'fb7',
    url: 'https://media.giphy.com/media/X9ndB7gXvSGO4/giphy.gif', // excitement win
    previewUrl: 'https://media.giphy.com/media/X9ndB7gXvSGO4/200.gif',
    tag: ['celebrate', 'laugh', 'happy', 'excited', 'yes', 'yeah']
  },
  {
    id: 'fb8',
    url: 'https://media.giphy.com/media/xT0xezQGu5xCDDSgeI/giphy.gif', // charts up stonk index
    previewUrl: 'https://media.giphy.com/media/xT0xezQGu5xCDDSgeI/200.gif',
    tag: ['stats', 'growth', 'charts', 'up', 'scale', 'money', 'revenue']
  }
];

const GifIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="transition-all"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
    <text 
      x="50%" 
      y="52%" 
      dominantBaseline="central" 
      textAnchor="middle" 
      fontSize="9" 
      fontWeight="900" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      fill="currentColor"
      stroke="none"
    >
      GIF
    </text>
  </svg>
);

interface ChatInterfaceProps {
  role: UserRole;
  activeStartupId: string | null;
  soundEnabled?: boolean;
  readReceiptsEnabled?: boolean;
  onChatStateChange?: (isOpen: boolean) => void;
  onViewProfile?: (userId: string) => void;
  onClose?: () => void;
}

const getFileDetails = (url: string | null | undefined, customName?: string) => {
  let name = customName || '';
  if (!name && url) {
    try {
      const decodedUrl = decodeURIComponent(url);
      const parts = decodedUrl.split('/');
      name = parts[parts.length - 1]?.split('?')[0] || '';
    } catch (e) {
      name = '';
    }
  }
  if (!name) name = 'Document';

  const ext = name.split('.').pop()?.toLowerCase() || '';

  let typeLabel = 'DOCUMENT';
  let iconName = 'text';

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
    typeLabel = 'IMAGE';
    iconName = 'image';
  } else if (['pdf'].includes(ext)) {
    typeLabel = 'PDF';
    iconName = 'pdf';
  } else if (['doc', 'docx'].includes(ext)) {
    typeLabel = 'WORD';
    iconName = 'word';
  } else if (['xls', 'xlsx', 'csv'].includes(ext)) {
    typeLabel = 'SPREADSHEET';
    iconName = 'spreadsheet';
  } else if (['ppt', 'pptx'].includes(ext)) {
    typeLabel = 'PRESENTATION';
    iconName = 'presentation';
  } else if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    typeLabel = 'ARCHIVE';
    iconName = 'archive';
  } else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
    typeLabel = 'VIDEO';
    iconName = 'video';
  } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) {
    typeLabel = 'AUDIO';
    iconName = 'audio';
  }

  return { name, ext, typeLabel, iconName };
};

const ChatInterface: React.FC<ChatInterfaceProps> = React.memo(({ 
  role, 
  activeStartupId,
  soundEnabled = true,
  readReceiptsEnabled = true,
  onChatStateChange,
  onViewProfile,
  onClose
}) => {
  // --- State ---
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Notification Toast State
  const [notification, setNotification] = useState<{ id: string, name: string, message: string } | null>(null);
  const notificationTimerRef = useRef<any>(null);

  // Realtime Presence & Typing State
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [isPeerOnline, setIsPeerOnline] = useState(false);
  const typingTimeoutRef = useRef<any>(null);
  const peerTypingTimeoutRef = useRef<any>(null);
  const subscriptionHandleRef = useRef<{
    unsubscribe: () => void;
    sendTyping: (isTyping: boolean) => void;
    broadcastReadReceipt: (messageIds: string[], readAt: string) => void;
    broadcastDeliveredReceipt: (messageId: string, deliveredAt: string) => void;
  } | null>(null);

  // Loading States
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // GIF States & Refs
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchQuery, setGifSearchQuery] = useState('');
  const [gifsList, setGifsList] = useState<any[]>([]);
  const [isGifLoading, setIsGifLoading] = useState(false);
  const gifSearchTimerRef = useRef<any>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const soundRef = useRef<boolean>(soundEnabled);
  const readReceiptsRef = useRef<boolean>(readReceiptsEnabled);
  const scrollTimeoutRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chatsRef = useRef<ChatSession[]>(chats);

  // Keep refs in sync
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    readReceiptsRef.current = readReceiptsEnabled;
  }, [readReceiptsEnabled]);

  // --- Initialization ---

  // --- Initialization ---

  // Cleanup & Resize Handler
  useEffect(() => {
    // Preserve original backgrounds
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;

    // Apply chat surface background to prevent rubber-band gap matching active theme
    const isDarkActive = document.documentElement.classList.contains('dark');
    document.body.style.backgroundColor = isDarkActive ? '#09090b' : '#F9FAFB';
    document.documentElement.style.backgroundColor = isDarkActive ? '#09090b' : '#F9FAFB';

    // Prevent outer browser window scrolling when keyboard is open or elements shift
    const preventWindowScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('scroll', preventWindowScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (window.visualViewport) {
          const vh = window.visualViewport.height;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
          
          // Force scroll adjustment immediately on resize to keep pace with keyboard
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
      }
    };
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
      handleResize();
    }

    return () => {
        // Restore background styles
        document.body.style.backgroundColor = originalBodyBg;
        document.documentElement.style.backgroundColor = originalHtmlBg;

        window.removeEventListener('scroll', preventWindowScroll);

        // Restore body scroll when chat interface is unmounted
        if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
        if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
        if (gifSearchTimerRef.current) clearTimeout(gifSearchTimerRef.current);
        
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', handleResize);
            window.visualViewport.removeEventListener('scroll', handleResize);
        }
    };
  }, []);

  // Keep ref in sync for callbacks
  useEffect(() => {
      soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const playNotificationSound = () => {
      if (!soundRef.current) return;
      try {
          // Subtle pop sound - Reuse AudioContext to avoid leaks
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
              audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          
          const audioCtx = audioCtxRef.current;
          
          // Resume if suspended (common in browsers until user interaction)
          if (audioCtx.state === 'suspended') {
              audioCtx.resume();
          }

          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
          
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
          
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
          // Ignore audio context errors
      }
  };

  useEffect(() => {
    const init = async () => {
      // Use StorageService for safe mock handling
      const userId = await StorageService.getCurrentUserId();
      if (userId) {
        setCurrentUserId(userId);
        await loadChats();
      }
    };
    init();
  }, []);

  // Notify parent of state (for mobile nav hiding)
  useEffect(() => {
    onChatStateChange?.(!!selectedChatId);
  }, [selectedChatId, onChatStateChange]);

  // Handle Prop-based Match/Navigation
  useEffect(() => {
    const connectToStartup = async () => {
      if (activeStartupId) {
        const userId = await StorageService.getCurrentUserId();
        if (activeStartupId === userId) return;
        
        // If we are already selected this chat, do nothing
        const existing = chats.find(c => c.startupId === activeStartupId);
        if (existing && selectedChatId === existing.id) return;
        
        if (existing) {
          setSelectedChatId(existing.id);
        } else {
          // Create new connection if none exists
          const newId = await StorageService.ensureConnection(activeStartupId);
          if (newId) {
            await loadChats(); // Reload chats to include the new one
            setSelectedChatId(newId);
          }
        }
      }
    };

    if (activeStartupId) {
        connectToStartup();
    }
  }, [activeStartupId, chats]); // Re-run if chats change or prop changes

  // --- Data Loading ---

  const loadChats = async (silent = false) => {
    if (!silent) setIsLoadingChats(true);
    const data = await StorageService.getChats();
    setChats(data);
    if (!silent) setIsLoadingChats(false);
  };

  const loadMessages = async (chatId: string, showSpinner = false) => {
    if (showSpinner) setIsLoadingMessages(true);
    try {
      const activeChatData = chatsRef.current.find(c => c.id === chatId);
      const msgs = await StorageService.getMessages(chatId, activeChatData?.peerPublicKey);
      setMessages(msgs);
      scrollToBottom();
    } finally {
      if (showSpinner) setIsLoadingMessages(false);
    }
  };

  // --- Realtime Global Subscription for Chat List ---
  useEffect(() => {
    if (!currentUserId) return;

    const sub = StorageService.subscribeToGlobalMessages(async (msg) => {
        if (msg._table === 'chats') {
            await loadChats(true);
            return;
        }

        // Handle message status/read-receipt updates in real time on the sidebar
        if (msg._eventType === 'UPDATE') {
            setChats(prev => prev.map(c => {
                if (c.id !== msg.chat_id) return c;
                const updated: ChatSession = { ...c };
                if (msg.sender_id === currentUserId) {
                    updated.lastMessageStatus = msg.status || updated.lastMessageStatus;
                    updated.lastMessageReadAt = msg.read_at || updated.lastMessageReadAt;
                }
                if (msg.status === 'read' && msg.sender_id !== currentUserId) {
                    updated.unread = 0;
                }
                return updated;
            }));
            await loadChats(true);
            return;
        }

        const isMe = msg.sender_id === currentUserId;
        const chatInList = chatsRef.current.find(c => c.id === msg.chat_id);

        if (!isMe && msg.id && msg.chat_id !== selectedChatId) {
            StorageService.markMessageAsDelivered(msg.id).catch(() => {});
        }

        if (!chatInList) {
            if (!isMe) {
                await loadChats(true);
                const newChats = await StorageService.getChats();
                const newChat = newChats.find(c => c.id === msg.chat_id);
                if (newChat) {
                    const senderName = newChat.startupName;
                    setNotification({
                        id: Date.now().toString(),
                        name: senderName,
                        message: newChat.lastMessage || (
                            msg.type === 'image' ? 'Sent an image' : 
                            msg.type === 'audio' ? 'Audio Message' : 
                            msg.type === 'document' ? 'Attachment' : 'New message'
                        )
                    });
                    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
                    notificationTimerRef.current = setTimeout(() => {
                        setNotification(null);
                    }, 3000);
                }
                if (soundEnabled) playNotificationSound();
            }
        } else {
            // Only play notification sound if the incoming message is NOT for the active selected chat
            if (!isMe && msg.chat_id !== selectedChatId) {
                if (soundEnabled) playNotificationSound();
            }
            await loadChats(true);
        }
    });

    return () => {
        sub.unsubscribe();
    };
  }, [currentUserId, selectedChatId, soundEnabled]);

  // --- Realtime Subscription for Selected Chat ---
  useEffect(() => {
    if (!selectedChatId || !currentUserId) {
      setIsPeerTyping(false);
      setIsPeerOnline(false);
      return;
    }

    setIsPeerTyping(false);
    setIsPeerOnline(false);

    const markActiveChatRead = async () => {
      // Clear local unread badge immediately when viewing the chat
      setChats(prev => prev.map(c => c.id === selectedChatId ? { ...c, unread: 0 } : c));
      if (!readReceiptsRef.current || document.visibilityState !== 'visible') return;
      const result = await StorageService.markAllMessagesAsRead(selectedChatId);
      if (result && result.messageIds.length > 0) {
        subscriptionHandleRef.current?.broadcastReadReceipt(result.messageIds, result.readAt);
      }
    };

    loadMessages(selectedChatId, true).then(() => {
      markActiveChatRead();
    });

    const subscription = StorageService.subscribeToMessages(selectedChatId, async (payload) => {
      if (payload.type === 'INSERT') {
        const raw = payload.message;
        
        // Defensive check: Ensure this message actually belongs to the active selected chat
        if (raw.chat_id !== selectedChatId) return;
        
        let plainText = raw.content;
        if (raw.type === 'text' && plainText && plainText.startsWith('E2EE::')) {
            const activeChatData = chatsRef.current.find(c => c.id === selectedChatId);
            let peerKey = activeChatData?.peerPublicKey || null;
            if (!peerKey) {
                peerKey = await StorageService.getPeerPublicKeyForChat(selectedChatId);
            }
            plainText = await EncryptionService.decryptMessage(plainText, peerKey);
        }

        if (raw.sender_id !== currentUserId) {
            setIsPeerTyping(false);
            playNotificationSound();
            if (readReceiptsRef.current && document.visibilityState === 'visible') {
                const readAt = await StorageService.markMessageAsRead(raw.id, selectedChatId);
                if (readAt) {
                    subscription.broadcastReadReceipt([raw.id], readAt);
                }
            } else {
                const delivered = await StorageService.markMessageAsDelivered(raw.id);
                if (delivered) {
                    subscription.broadcastDeliveredReceipt(raw.id, new Date().toISOString());
                }
            }
        }

        setMessages(prev => {
          const existingIdx = prev.findIndex(m => m.id === raw.id);
          if (existingIdx !== -1) {
            return prev.map(m => m.id === raw.id ? {
              ...m,
              status: raw.status || m.status,
              deliveredAt: raw.delivered_at || m.deliveredAt,
              readAt: raw.read_at || m.readAt
            } : m);
          }
          const withoutTemp = prev.filter(m => !(m.id.startsWith('temp-') && m.text === plainText));
          
          return [...withoutTemp, {
            id: raw.id,
            senderId: raw.sender_id,
            text: plainText,
            type: raw.type,
            timestamp: raw.created_at,
            isMe: raw.sender_id === currentUserId,
            fileName: raw.file_name,
            fileSize: raw.file_size,
            duration: raw.duration,
            reactions: raw.reactions || [],
            status: raw.status || 'sent',
            deliveredAt: raw.delivered_at || null,
            readAt: raw.read_at || null
          }];
        });
        scrollToBottom();
      } else if (payload.type === 'UPDATE') {
        const raw = payload.message;
        if (raw.chat_id !== selectedChatId) return;
        setMessages(prev => prev.map(m => m.id === raw.id ? {
          ...m,
          status: raw.status || m.status,
          deliveredAt: raw.delivered_at || m.deliveredAt,
          readAt: raw.read_at || m.readAt,
          reactions: raw.reactions || m.reactions || []
        } : m));
      } else if (payload.type === 'READ_RECEIPT') {
        const ids = new Set(payload.messageIds || []);
        const readAt = payload.readAt || new Date().toISOString();
        setMessages(prev => prev.map(m => {
          if (m.isMe && (ids.has(m.id) || (payload.readerId && m.status !== 'read'))) {
            return { ...m, status: 'read', deliveredAt: m.deliveredAt || readAt, readAt: m.readAt || readAt };
          }
          return m;
        }));
      } else if (payload.type === 'DELIVERED_RECEIPT') {
        const deliveredAt = payload.deliveredAt || new Date().toISOString();
        setMessages(prev => prev.map(m => {
          if (m.id === payload.messageId && m.status === 'sent') {
            return { ...m, status: 'delivered', deliveredAt };
          }
          return m;
        }));
      } else if (payload.type === 'TYPING') {
        setIsPeerTyping(!!payload.isTyping);
        if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
        if (payload.isTyping) {
          peerTypingTimeoutRef.current = setTimeout(() => setIsPeerTyping(false), 3500);
          scrollToBottom();
        }
      } else if (payload.type === 'PRESENCE') {
        const activeChatData = chatsRef.current.find(c => c.id === selectedChatId);
        const partnerId = activeChatData?.startupId;
        const onlineIds: string[] = payload.onlineUserIds || [];
        setIsPeerOnline(partnerId ? onlineIds.includes(partnerId) : onlineIds.some(id => id !== currentUserId));
      }
    }, currentUserId);

    subscriptionHandleRef.current = subscription;

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        markActiveChatRead();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    // Fallback sync every 25s in case websocket momentarily drops
    const pollInterval = setInterval(() => {
      loadMessages(selectedChatId);
    }, 25000);

    return () => {
      subscription.sendTyping(false);
      subscription.unsubscribe();
      subscriptionHandleRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      clearInterval(pollInterval);
    };
  }, [selectedChatId, currentUserId, readReceiptsEnabled]);

  const scrollToBottom = () => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    // Immediate scroll to bottom within the custom container element, completely ignoring screen-level shifts
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  // --- Actions ---

  const generateClientUuid = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (!selectedChatId) return;
    if (value.trim().length > 0) {
      subscriptionHandleRef.current?.sendTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        subscriptionHandleRef.current?.sendTyping(false);
      }, 2000);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      subscriptionHandleRef.current?.sendTyping(false);
    }
  };

  const handleSendMessage = async (overrideContent?: string, overrideType: 'text' | 'image' | 'audio' = 'text', additionalData?: any) => {
    if ((!input.trim() && !overrideContent) || !selectedChatId || !currentUserId) return;

    const clientUuid = generateClientUuid();
    const content = overrideContent || input.trim();
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    subscriptionHandleRef.current?.sendTyping(false);

    const optimisticMsg: Message = {
      id: clientUuid,
      senderId: currentUserId,
      text: content,
      type: overrideType as any,
      timestamp: new Date().toISOString(),
      isMe: true,
      status: 'sent',
      ...additionalData
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setInput('');
    scrollToBottom();
    setIsSending(true);

    try {
      const activeChatData = chats.find(c => c.id === selectedChatId);
      const saved = await StorageService.addMessage(optimisticMsg, selectedChatId, activeChatData?.peerPublicKey);
      if (saved) {
        setMessages(prev => prev.map(m => m.id === clientUuid ? { ...saved, isMe: true, status: saved.status || m.status } : m));
        loadChats(true);
      } else {
        console.error("Failed to save message to DB");
        setMessages(prev => prev.map(m => m.id === clientUuid ? { ...m, text: "Failed to send: " + m.text } : m));
      }
    } catch (e) {
      console.error("Send failed", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChatId || !currentUserId) return;

    // Actual file upload to storage bucket
    const fileUrl = await StorageService.uploadFile(file, 'images');
    
    const clientUuid = generateClientUuid();
    const optimisticMsg: Message = {
      id: clientUuid,
      senderId: currentUserId,
      text: fileUrl || file.name,
      type: 'document',
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      timestamp: new Date().toISOString(),
      isMe: true,
      status: 'sent'
    };

    setMessages(prev => [...prev, optimisticMsg]);
    scrollToBottom();

    // Save message with the uploaded file URL
    const saved = await StorageService.addMessage({
        ...optimisticMsg,
        text: fileUrl || file.name // Use URL if upload succeeded
    }, selectedChatId);
    if (saved) {
       setMessages(prev => prev.map(m => m.id === clientUuid ? { ...saved, isMe: true, status: saved.status || m.status } : m));
       loadChats(true);
    }
  };

  const handleVideoCall = () => {
      // Open Google Meet in a new tab
      window.open('https://meet.google.com/new', '_blank');
  };

  // --- GIF Picker Methods ---

  const fetchGifs = async (query: string = '') => {
    setIsGifLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      let url = `/api/gifs`;
      if (query.trim()) {
        url += `?q=${encodeURIComponent(query)}`;
      }

      if (!token) {
        console.error('[Client] No auth token available');
        setIsGifLoading(false);
        return;
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch from proxy GIF API');
      const json = await res.json();
      
      if (json.data && Array.isArray(json.data)) {
        const mapped = json.data.map((item: any) => ({
          id: item.id,
          url: item.images.original.url,
          previewUrl: item.images.fixed_height?.url || item.images.original?.url
        }));
        setGifsList(mapped);
      } else {
        throw new Error('Invalid Giphy response structure');
      }
    } catch (err) {
      console.warn('Giphy API error, using fallback GIFs:', err);
      if (query.trim()) {
        const lowerQ = query.toLowerCase();
        const filtered = FALLBACK_GIFS.filter(g => 
          g.tag.some(t => t.includes(lowerQ)) || 
          g.id.includes(lowerQ)
        );
        setGifsList(filtered.length > 0 ? filtered : FALLBACK_GIFS);
      } else {
        setGifsList(FALLBACK_GIFS);
      }
    } finally {
      setIsGifLoading(false);
    }
  };

  const debouncedSearchGifs = (query: string) => {
    if (gifSearchTimerRef.current) clearTimeout(gifSearchTimerRef.current);
    gifSearchTimerRef.current = setTimeout(() => {
      fetchGifs(query);
    }, 400);
  };

  useEffect(() => {
    if (showGifPicker) {
      fetchGifs(gifSearchQuery);
    }
  }, [showGifPicker]);

  const handleCategoryClick = (category: string) => {
    setGifSearchQuery(category);
    fetchGifs(category);
  };

  const handleSendGif = (gifUrl: string) => {
    handleSendMessage(gifUrl, 'text');
    setShowGifPicker(false);
    setGifSearchQuery('');
  };

  // --- Voice Recording Logic Removed ---

  // --- Render Components ---

  const filteredChats = chats.filter(c => 
    c.startupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChat = chats.find(c => c.id === selectedChatId);
  
  // Robust derivation of name/avatar for the header
  let headerName = 'Loading...';
  let headerAvatar = undefined;
  let headerSubtitle = 'Active now';
  let headerLastSeen = null;

  if (activeChat) {
    // Priority: Person Name (investorName) > Display Name (startupName)
    headerName = activeChat.investorName || activeChat.startupName || 'User';
    headerAvatar = activeChat.avatarUrl || activeChat.founderAvatarUrl;
    headerSubtitle = activeChat.subtitle || 'Active now';
    headerLastSeen = activeChat.lastSeen || null;

    // If the main name is the same as the subtitle (startup name), adjust subtitle
    if (headerName === activeChat.subtitle) {
      headerSubtitle = 'Active now';
    }
  }

  // Time formatter
  const formatTime = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className="flex font-sans text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-950 fixed md:relative inset-0 md:inset-auto h-[var(--vh,100dvh)] md:h-screen w-full overflow-hidden select-none select-text-for-messages touch-pan-y transition-colors"
      style={{ overscrollBehaviorY: 'none' }}
    >
      
      {/* --- LEFT SIDEBAR (CHAT LIST) --- */}
      <div className={`
        absolute inset-0 md:relative md:inset-auto md:w-[400px] lg:w-[420px] bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-20 transition-all duration-300 md:h-[100dvh] overscroll-contain
        ${selectedChatId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>
        {/* Header */}
        <div 
          className="px-4 py-3 border-b border-transparent dark:border-zinc-800/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md sticky top-0 z-30 shrink-0 transition-colors"
          style={{ paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h1 className="text-lg font-display font-bold tracking-tight text-zinc-900 dark:text-white" id="chat-messages-header">Messages</h1>
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:bg-white dark:focus:bg-zinc-900 transition-all font-sans"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 transition-colors">
          {isLoadingChats ? (
            <div className="p-8 flex justify-center">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Loading chats...</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 text-xs">No messages yet.</div>
          ) : (
            <div className="divide-y divide-transparent pb-20 sm:pb-2">
              {filteredChats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/70 transition-colors text-left group active:bg-zinc-100 dark:active:bg-zinc-900 ${selectedChatId === chat.id ? 'bg-zinc-100 dark:bg-zinc-900' : ''}`}
                >
                  <div className="relative shrink-0">
                    {chat.avatarUrl ? <img 
                      src={chat.avatarUrl} 
                      alt={chat.startupName} 
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-sm transition-transform duration-200 group-hover:scale-102"
                    /> : (
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center text-zinc-400 dark:text-zinc-500 transition-transform duration-200 group-hover:scale-102">
                        <User size={20} />
                      </div>
                    )}
                    {/* Online Indicator */}
                    <div className="absolute bottom-0 right-0 z-10 border border-white dark:border-zinc-950 rounded-full bg-white dark:bg-zinc-950 scale-110">
                       <StatusIndicator lastSeen={chat.lastSeen || ''} size="sm" variant="dot" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-sm sm:text-[15px] text-zinc-900 dark:text-zinc-100 truncate pr-2 tracking-tight transition-colors group-hover:text-brand-primary">{chat.startupName}</h3>
                      <span className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-semibold whitespace-nowrap">
                        {new Date(chat.timestamp).toLocaleDateString() === new Date().toLocaleDateString() 
                           ? formatTime(chat.timestamp)
                           : new Date(chat.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 min-w-0">
                      {chat.lastMessageSenderId === currentUserId && readReceiptsEnabled && (
                        <span className="shrink-0 flex items-center" title={chat.lastMessageStatus === 'read' ? 'Read' : chat.lastMessageStatus === 'delivered' ? 'Delivered' : 'Sent'}>
                          {chat.lastMessageStatus === 'read' ? (
                            <CheckCheck size={13} className="text-sky-500" />
                          ) : chat.lastMessageStatus === 'delivered' ? (
                            <CheckCheck size={13} className="text-zinc-400 dark:text-zinc-500" />
                          ) : (
                            <Check size={13} className="text-zinc-400 dark:text-zinc-500" />
                          )}
                        </span>
                      )}
                      <p className={`text-xs sm:text-[13px] leading-relaxed truncate ${chat.unread > 0 ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        {(() => {
                           if (!chat.lastMessage) return '';
                           if (chat.lastMessage.startsWith('http') && (chat.lastMessage.includes('giphy') || chat.lastMessage.includes('gif'))) {
                             return '🖼️ GIF';
                           }
                           if (chat.lastMessage.startsWith('http://') || chat.lastMessage.startsWith('https://') || chat.lastMessage.startsWith('blob:') || chat.lastMessage.startsWith('data:')) {
                             const details = getFileDetails(chat.lastMessage);
                             const iconStr = details.iconName === 'image' ? '🖼️' : details.iconName === 'video' ? '🎥' : details.iconName === 'audio' ? '🎵' : details.iconName === 'spreadsheet' ? '📊' : details.iconName === 'archive' ? '📦' : '📄';
                             return `${iconStr} File`;
                           }
                           return chat.lastMessage;
                         })()}
                      </p>
                    </div>
                  </div>
                  
                  {chat.unread > 0 && (
                    <div className="shrink-0 w-5 h-5 bg-[#EAB308] text-white dark:text-zinc-950 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                      {chat.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT SIDE (CONVERSATION) --- */}
      <div className={`
        absolute inset-0 md:relative md:inset-auto flex flex-col bg-white dark:bg-zinc-950 z-30 transition-all duration-300 md:h-[100dvh] md:flex-1 overflow-hidden
        ${selectedChatId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {selectedChatId ? (
          <>
            {/* Chat Header */}
            <div 
              className="bg-white/80 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800 px-3.5 py-2.5 sm:px-6 sm:py-4 flex items-center justify-between shrink-0 z-40 transition-colors"
              style={{ paddingTop: 'calc(10px + env(safe-area-inset-top, 0px))' }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={() => setSelectedChatId(null)}
                  className="p-1.5 -ml-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 active:scale-95 transition-all w-9 h-9 flex items-center justify-center"
                  aria-label="Back to chat list"
                >
                  <ChevronLeft size={22} className="text-zinc-600 dark:text-zinc-300" />
                </button>
                
                <div 
                  className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
                  onClick={() => activeChat?.startupId && onViewProfile?.(activeChat.startupId)}
                  title="View Profile"
                >
                  <div className="relative">
                    {headerAvatar ? (
                      <img src={headerAvatar} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-sm transition-transform group-hover:scale-105" alt={headerName} />
                    ) : (
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 shadow-sm transition-transform group-hover:scale-105">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 z-10 border border-white dark:border-zinc-950 rounded-full bg-white dark:bg-zinc-950 scale-105">
                      <StatusIndicator lastSeen={headerLastSeen || ''} size="sm" variant="dot" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    {activeChat ? (
                      <>
                        <h2 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white tracking-tight leading-snug group-hover:text-brand-primary transition-colors">{headerName}</h2>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 select-none">
                          <span className={`w-1.5 h-1.5 rounded-full ${isPeerTyping || isPeerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600 dark:bg-emerald-400'}`} />
                          {isPeerTyping ? 'Typing...' : isPeerOnline ? 'Online now' : headerSubtitle}
                        </span>
                      </>
                    ) : (
                      <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-zinc-400">
                <button 
                    onClick={handleVideoCall}
                    className="p-2.5 sm:p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-300 hover:text-brand-primary dark:hover:text-amber-400 transition-all w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center active:scale-90 shadow-sm border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md cursor-pointer shrink-0"
                    title="Start Google Meet"
                >
                    <Video size={22} className="sm:size-[24px]" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 min-h-0 overflow-y-auto px-4 py-3 sm:px-6 space-y-1.5 scroll-smooth bg-zinc-50/40 dark:bg-zinc-950 overscroll-contain transition-colors"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
               {isLoadingMessages ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center select-none">
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">Loading messages...</p>
                  </div>
               ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400 p-8 text-center select-none">
                      <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">No messages yet</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Start the conversation with an investor or colleague!</p>
                  </div>
               ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.isMe;
                    const isConsecutive = idx > 0 && messages[idx - 1].senderId === msg.senderId;
                    
                    // Parse date headers
                    const currentMsgDate = new Date(msg.timestamp).toLocaleDateString();
                    const prevMsgDate = idx > 0 ? new Date(messages[idx - 1].timestamp).toLocaleDateString() : null;
                    const isNewDay = currentMsgDate !== prevMsgDate;
                    
                    const isConsecutiveSameDay = isConsecutive && !isNewDay;
                    const showAvatar = !isMe && (!isConsecutiveSameDay);

                    const bubbleCorners = isMe 
                      ? (isConsecutiveSameDay ? 'rounded-2xl rounded-tr-md' : 'rounded-2xl rounded-tr-none') 
                      : (isConsecutiveSameDay ? 'rounded-2xl rounded-tl-md' : 'rounded-2xl rounded-tl-none');

                    return (
                      <React.Fragment key={msg.id}>
                        {isNewDay && (
                          <div className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-bold tracking-wider uppercase py-3 select-none">
                            {new Date(msg.timestamp).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}
                          </div>
                        )}

                        <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${isConsecutiveSameDay ? 'mt-0.5' : 'mt-3'}`}>
                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                            
                            {showAvatar && !isMe && (
                              <span className="text-[9px] font-bold tracking-wide text-zinc-400 dark:text-zinc-500 mb-0.5 ml-9 select-none">
                                  {headerName}
                              </span>
                            )}

                            <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                              {/* Left Avatar for Them */}
                              {!isMe && (
                                <div className="w-7 h-7 shrink-0 mb-0.5">
                                  {showAvatar && (
                                    headerAvatar ? (
                                      <img src={headerAvatar} className="w-7 h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 shadow-xs" alt="" />
                                    ) : (
                                      <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 shadow-xs">
                                        <User className="w-3.5 h-3.5" />
                                      </div>
                                    )
                                  )}
                                </div>
                              )}

                              {/* Bubble */}
                              <div className={`relative px-3.5 py-2 ${bubbleCorners} shadow-sm text-[14px] sm:text-[15px] leading-relaxed break-words group transition-all select-text ${isMe ? 'bg-[#EAB308] text-white shadow-[#EAB308]/10' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800'}`}>
                                {/* Text Content */}
                                {msg.type === 'text' && (
                                   msg.text?.startsWith('http') && (msg.text.includes('giphy') || msg.text.includes('gif')) ? (
                                       <div className="relative">
                                           <div className="absolute top-1 left-1 bg-black/30 text-white text-[10px] px-1 rounded flex items-center gap-0.5">
                                               <GifIcon size={12} /> GIF
                                           </div>
                                           <img src={msg.text} alt="GIF" className="rounded-lg max-w-full h-auto" />
                                       </div>
                                   ) : (
                                       <p className="whitespace-pre-wrap">{msg.text}</p>
                                   )
                                )}

                              {/* Audio Content */}
                              {msg.type === 'audio' && (
                                  <div className="flex items-center gap-3 min-w-[150px]">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMe ? 'bg-black/10 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}`}>
                                          <MessageCircle size={20} />
                                      </div>
                                      <div className="flex flex-col">
                                          <span className="text-xs font-bold">Audio</span>
                                          <span className={`text-[11px] ${isMe ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400'}`}>{msg.duration ? `${msg.duration}s` : '0s'}</span>
                                      </div>
                                  </div>
                              )}

                              {/* Document Content */}
                              {msg.type === 'document' && (() => {
                                const details = getFileDetails(msg.text, msg.fileName);
                                
                                // Select icon dynamically
                                let FileIcon = FileText;
                                if (details.iconName === 'image') FileIcon = FileImage;
                                else if (details.iconName === 'spreadsheet') FileIcon = FileSpreadsheet;
                                else if (details.iconName === 'video') FileIcon = FileVideo;
                                else if (details.iconName === 'audio') FileIcon = FileAudio;
                                else if (details.iconName === 'archive') FileIcon = FileArchive;
                                else if (details.iconName === 'generic') FileIcon = File;

                                const iconContainerBg = isMe 
                                  ? 'bg-black/10 text-white' 
                                  : (details.iconName === 'image' ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400' :
                                     details.iconName === 'spreadsheet' ? 'bg-teal-600/10 text-teal-600 dark:text-teal-400' :
                                     details.iconName === 'video' ? 'bg-amber-600/10 text-amber-600 dark:text-amber-400' :
                                     details.iconName === 'audio' ? 'bg-amber-600/10 text-amber-600 dark:text-amber-400' :
                                     details.iconName === 'pdf' ? 'bg-red-600/10 text-red-600 dark:text-red-400' :
                                     details.iconName === 'archive' ? 'bg-amber-600/10 text-amber-600 dark:text-amber-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300');

                                return (
                                  <a 
                                    href={msg.text} 
                                    download={details.name} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 pr-2 cursor-pointer no-underline focus:outline-none rounded-xl p-1.5 -m-1.5 transition-all ${isMe ? 'hover:bg-black/5' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/70'}`}
                                    onClick={(e) => {
                                      if (!msg.text || (!msg.text.startsWith('http') && !msg.text.startsWith('blob:') && !msg.text.startsWith('data:'))) {
                                        e.preventDefault();
                                        alert("The document URL is still generating or invalid.");
                                      }
                                    }}
                                  >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconContainerBg}`}>
                                      <FileIcon size={20} />
                                    </div>
                                    <div className="flex flex-col overflow-hidden flex-1 text-left min-w-0 pr-1">
                                      <span className={`font-bold text-sm truncate max-w-[200px] block transition-colors ${isMe ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>{details.name}</span>
                                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                                        <span className={`font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md text-[9px] border shrink-0 ${
                                          isMe 
                                            ? 'bg-black/5 border-black/10 text-white/80' 
                                            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-300'
                                        }`}>
                                          {details.typeLabel}
                                        </span>
                                        <span className={`truncate text-[11.5px] ${isMe ? 'text-white/70' : 'text-zinc-500 dark:text-zinc-400'}`}>{msg.fileSize || 'Unknown size'}</span>
                                      </div>
                                    </div>
                                    <div className={`p-2 rounded-full ml-1 shrink-0 ${isMe ? 'hover:bg-black/10 text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400'}`}>
                                      <Download size={16} />
                                    </div>
                                  </a>
                                );
                              })()}
                              
                                <div className={`flex items-center justify-end gap-1 mt-0.5 select-none ${isMe ? 'text-white/80' : 'text-zinc-400 dark:text-zinc-500'}`}>
                                  <span className="text-[9px] font-normal leading-none">{formatTime(msg.timestamp)}</span>
                                  {isMe && readReceiptsEnabled && (
                                    <div
                                      className="flex items-center leading-none"
                                      title={
                                        msg.status === 'read'
                                          ? `Read${msg.readAt ? ` at ${formatTime(msg.readAt)}` : ''}`
                                          : msg.status === 'delivered'
                                            ? `Delivered${msg.deliveredAt ? ` at ${formatTime(msg.deliveredAt)}` : ''}`
                                            : 'Sent'
                                      }
                                    >
                                      {msg.id.startsWith('temp-') ? (
                                        <Clock size={11} className="text-white/60" />
                                      ) : msg.status === 'read' ? (
                                        <CheckCheck size={14} className="text-sky-100 drop-shadow-xs" />
                                      ) : msg.status === 'delivered' ? (
                                        <CheckCheck size={13} className="text-white/70" />
                                      ) : (
                                        <Check size={13} className="text-white/65" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {isMe && readReceiptsEnabled && idx === messages.length - 1 && !msg.id.startsWith('temp-') && (
                              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-1 mr-1 select-none flex items-center gap-1">
                                {msg.status === 'read' ? (
                                  <>
                                    <CheckCheck size={12} className="text-sky-500" />
                                    <span className="text-zinc-500 dark:text-zinc-300 font-semibold">
                                      Read{msg.readAt ? ` · ${formatTime(msg.readAt)}` : ''}
                                    </span>
                                  </>
                                ) : msg.status === 'delivered' ? (
                                  <>
                                    <CheckCheck size={12} className="text-zinc-400 dark:text-zinc-500" />
                                    <span>Delivered</span>
                                  </>
                                ) : (
                                  <>
                                    <Check size={12} className="text-zinc-400 dark:text-zinc-500" />
                                    <span>Sent</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
               )}
               {isPeerTyping && (
                 <div className="flex justify-start mt-2">
                   <div className="ml-9 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-xs">
                     <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                     <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                     <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                 </div>
               )}
               <div className="h-32 sm:h-16 w-full shrink-0" />
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div 
              className="px-3 pt-3 pb-4 sm:px-5 sm:py-4 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 shrink-0 w-full z-40 animate-slide-up relative transition-colors"
              style={{ paddingBottom: 'calc(18px + env(safe-area-inset-bottom, 0px))' }}
            >
              {/* GIF Picker Overlay */}
              {showGifPicker && (
                <div 
                  className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 absolute bottom-full left-3 right-3 sm:left-auto sm:right-6 sm:w-[350px] max-h-[360px] mb-2 flex flex-col z-50 animate-in slide-in-from-bottom-2 duration-150 overflow-hidden"
                >
                  <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 shrink-0">
                    <span className="font-bold text-xs text-zinc-500 dark:text-zinc-400 tracking-tight">Search GIFs</span>
                    <button 
                      onClick={() => setShowGifPicker(false)}
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-bold text-[11px] px-2 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                  
                  {/* Search input inside GIF Picker */}
                  <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
                      <input 
                        type="text" 
                        placeholder="Search GIPHY..."
                        value={gifSearchQuery}
                        onChange={(e) => {
                          setGifSearchQuery(e.target.value);
                          debouncedSearchGifs(e.target.value);
                        }}
                        className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500/20 focus:bg-white dark:focus:bg-zinc-900"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Popular / Quick Categories scroll */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto border-b border-zinc-100 dark:border-zinc-800 shrink-0 no-scrollbar select-none">
                    {['👍 agree', '🎉 celebrate', '😂 laugh', '💡 idea', '😮 wow', '🤔 think', '📊 stats', '💼 startup'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat.split(' ')[1])}
                        className="px-2.5 py-1 text-[11px] font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg whitespace-nowrap active:scale-95 transition-all focus:outline-none select-none"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Grid of GIFs */}
                  <div className="flex-1 overflow-y-auto p-2 min-h-[180px] bg-white dark:bg-zinc-900">
                    {isGifLoading ? (
                      <div className="h-40 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-primary border-t-zinc-200 dark:border-t-zinc-700" />
                      </div>
                    ) : gifsList.length === 0 ? (
                      <div className="h-40 flex flex-col items-center justify-center text-zinc-400 text-xs text-center p-4">
                        <span>No GIFs found.</span>
                        <span className="opacity-60 mt-0.5">Try searching for something else like "launch".</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        {gifsList.map((gif) => (
                          <button
                            key={gif.id}
                            type="button"
                            onClick={() => handleSendGif(gif.url)}
                            className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-800 hover:opacity-90 active:scale-[0.98] transition-all group border border-zinc-200 dark:border-zinc-700"
                          >
                            <img 
                              src={gif.previewUrl} 
                              alt="gif" 
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="max-w-4xl mx-auto flex items-center gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-xs"
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

                <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3.5 py-1.5 md:py-2 flex items-center gap-2 focus-within:ring-1 focus-within:ring-brand-primary/30 dark:focus-within:ring-amber-400/30 focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-zinc-300 dark:focus-within:border-amber-400/60 transition-all shadow-inner dark:shadow-none">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    onFocus={() => {
                      window.scrollTo(0, 0);
                      scrollToBottom();
                      // Staggered triggers to scroll exactly as the virtual keyboard transitions on iOS/Android
                      setTimeout(() => { scrollToBottom(); }, 50);
                      setTimeout(() => { scrollToBottom(); }, 150);
                      setTimeout(() => { scrollToBottom(); }, 300);
                      setTimeout(() => { scrollToBottom(); }, 600);
                    }}
                    onClick={() => {
                      scrollToBottom();
                      setTimeout(() => { scrollToBottom(); }, 150);
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-[15px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none py-1"
                  />
                  {isSending && (
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-400 dark:border-t-amber-400 shrink-0" />
                  )}
                </div>

                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 shadow-xs active:scale-95
                    ${input.trim() 
                      ? 'bg-[#EAB308] text-white hover:scale-105 hover:shadow-xs' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-500 cursor-not-allowed'}`}
                >
                  <SendHorizontal size={18} strokeWidth={2.5} className={input.trim() ? "translate-x-[1px]" : ""} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State (Desktop) */
          <div className="hidden md:flex flex-1 items-center justify-center flex-col text-center p-8 bg-zinc-50/50 dark:bg-zinc-950 transition-colors">
             <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-full shadow-2xl flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800">
                <div className="w-16 h-16 bg-[#EAB308] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(234,179,8,0.2)]">
                   <SendHorizontal size={32} className="ml-1" />
                </div>
             </div>
             <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-2">Your Conversations</h2>
             <p className="text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed text-sm">
               Select a chat from the sidebar to view messages, schedule meetings, or share documents.
             </p>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
                if (info.offset.y < -50) {
                    setNotification(null);
                }
            }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-[90%] sm:max-w-sm border border-zinc-800 cursor-grab active:cursor-grabbing"
        >
           <div className="w-8 h-8 rounded-full bg-[#EAB308]/20 flex items-center justify-center shrink-0">
             <MessageCircle size={16} className="text-[#EAB308]" />
           </div>
           <div className="flex flex-col min-w-0">
             <span className="text-xs font-bold text-white truncate">{notification.name}</span>
             <span className="text-sm text-zinc-300 truncate">{notification.message}</span>
           </div>
        </motion.div>
      )}
    </div>

  );
});

export default ChatInterface;

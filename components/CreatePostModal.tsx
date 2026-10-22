import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Image as ImageIcon, Loader2, Feather, Check, Send } from 'lucide-react';
import { StorageService } from '../services/storageService';

interface CreatePostModalProps {
  userProfile: any;
  onClose: () => void;
  onPostCreated?: (post: any) => void;
  quotedPost?: any;
  initialTopic?: string;
}

const TOPICS = ['Insight', 'Milestone', 'Ask', 'Opportunity', 'Fundraising', 'SaaS', 'AI', 'Fintech', 'Growth'];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  userProfile, 
  onClose, 
  onPostCreated, 
  quotedPost, 
  initialTopic 
}) => {
  const [newPostContent, setNewPostContent] = useState(
    initialTopic ? `#${initialTopic.replace(/^#/, '')} ` : ''
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    initialTopic ? [initialTopic.replace(/^#/, '')] : []
  );
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => {
      const exists = prev.includes(topic);
      if (exists) {
        return prev.filter(t => t !== topic);
      } else {
        if (!newPostContent.includes(`#${topic}`)) {
          setNewPostContent(curr => `${curr.trim()} #${topic} `);
        }
        return [...prev, topic];
      }
    });
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;
    setIsPosting(true);
    try {
      const extractedTags = Array.from(newPostContent.matchAll(/#([\w-]+)/g)).map(m => m[1]);
      selectedTopics.forEach(t => {
        if (!extractedTags.some(tag => tag.toLowerCase() === t.toLowerCase())) {
          extractedTags.push(t);
        }
      });

      const { success, post } = await StorageService.createCommunityPost(
        newPostContent, 
        extractedTags, 
        {
          name: userProfile?.name || 'Founder',
          title: userProfile?.title || 'Ecosystem Member',
          avatarUrl: userProfile?.avatarUrl
        }, 
        selectedImage || undefined,
        quotedPost?.id
      );
      
      if (success && post) {
        if (onPostCreated) onPostCreated(post);
        onClose();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const charCount = newPostContent.length;
  const maxChars = 600;
  const charsRemaining = maxChars - charCount;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-zinc-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden touch-none sm:touch-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPosting) onClose();
      }}
    >
      <motion.div 
        initial={{ y: 80, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200/80 dark:border-zinc-800 max-h-[85vh] sm:max-h-[90vh]"
      >
        {/* Mobile Drag Indicator */}
        <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden bg-white dark:bg-zinc-900 shrink-0">
          <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center font-bold shrink-0">
              <Feather size={15} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-zinc-950 dark:text-white leading-tight">
                {quotedPost ? 'Quote Post' : 'New Post'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono tabular-nums ${charsRemaining < 50 ? 'text-amber-500 font-bold' : 'text-zinc-400'}`}>
              {charsRemaining}
            </span>
            <button 
              onClick={() => !isPosting && onClose()} 
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar flex-1 space-y-3">
          {/* User info row */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
              {userProfile?.avatarUrl ? (
                <img src={userProfile.avatarUrl} className="w-full h-full object-cover" alt="You" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-xs">
                  {userProfile?.name?.[0] || 'U'}
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {userProfile?.name || 'You'}
            </span>
          </div>

          {/* Text Area Input */}
          <textarea 
            value={newPostContent}
            onChange={e => setNewPostContent(e.target.value.slice(0, maxChars))}
            placeholder={quotedPost ? "Add your perspective..." : "What are you building, fundraising, or learning today?"}
            className="w-full min-h-[110px] sm:min-h-[130px] p-3 text-zinc-900 dark:text-zinc-100 bg-zinc-50/80 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 focus:border-amber-400 dark:focus:border-amber-400 outline-none resize-none placeholder:text-zinc-400 text-sm leading-relaxed transition-all"
            autoFocus
          />

          {/* Quoted Post Preview */}
          {quotedPost && (
            <div className="border border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-3 bg-zinc-50 dark:bg-zinc-800/50 text-left">
              <div className="flex items-center gap-2 mb-1">
                <img src={quotedPost.avatar} className="w-4 h-4 rounded-full object-cover" alt="" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{quotedPost.author}</span>
                <span className="text-[10px] text-zinc-400">·</span>
                <span className="text-[10px] text-zinc-400">{quotedPost.time}</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed">{quotedPost.content}</p>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              <img src={imagePreview} className="w-full max-h-[200px] sm:max-h-[250px] object-cover" alt="Preview" />
              <button 
                onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Topic Tags Horizontal Scroll Pill Bar */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Quick Tags
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {TOPICS.map(topic => {
                const isSelected = selectedTopics.includes(topic) || newPostContent.includes(`#${topic}`);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow-2xs'
                        : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700/80 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span>#{topic}</span>
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-3 bg-zinc-50 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors px-2.5 py-1.5 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span className="text-xs">{selectedImage ? 'Change Image' : 'Attach Photo'}</span>
          </button>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleImageSelect} 
          />

          <div className="flex items-center gap-2">
            <button 
              onClick={handleCreatePost}
              disabled={isPosting || (!newPostContent.trim() && !selectedImage)}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {isPosting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 fill-current" />}
              <span>{isPosting ? 'Posting...' : 'Post'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Check, RotateCcw, Sparkles } from 'lucide-react';
import pavilionHeroImg from '../../src/assets/images/community_pavilion_hero_1791197922330.jpg';
import summitStageImg from '../../src/assets/images/community_summit_stage_1791197947528.jpg';
import foundersSummitImg from '../../src/assets/images/founders_summit_2_1785147774377.jpg';
import ventureTechImg from '../../src/assets/images/venture_connection_tech_1784549043938.jpg';

export interface BannerConfig {
  imageUrl: string;
  tag: string;
  title: string;
  subtitle: string;
}

interface CustomizeBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: BannerConfig;
  onSave: (config: BannerConfig) => void;
  onReset: () => void;
}

const PRESET_IMAGES = [
  { id: 'pavilion', label: 'Pavilion Hall', src: pavilionHeroImg },
  { id: 'summit', label: 'Summit Stage', src: summitStageImg },
  { id: 'founders', label: 'Founders Circle', src: foundersSummitImg },
  { id: 'tech', label: 'Venture Tech', src: ventureTechImg },
];

export const CustomizeBannerModal: React.FC<CustomizeBannerModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSave,
  onReset,
}) => {
  const [imageUrl, setImageUrl] = useState(currentConfig.imageUrl);
  const [tag, setTag] = useState(currentConfig.tag);
  const [title, setTitle] = useState(currentConfig.title);
  const [subtitle, setSubtitle] = useState(currentConfig.subtitle);
  const [urlInput, setUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setImageUrl(currentConfig.imageUrl);
      setTag(currentConfig.tag);
      setTitle(currentConfig.title);
      setSubtitle(currentConfig.subtitle);
      setUploadError(null);
      setUrlInput('');
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size is too large (maximum 8MB).');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setImageUrl(urlInput.trim());
    setUrlInput('');
  };

  const handleSave = () => {
    onSave({
      imageUrl: imageUrl || currentConfig.imageUrl,
      tag: tag.trim() || 'ConnectUp Ecosystem',
      title: title.trim() || 'Where Visionaries Exchange Conviction',
      subtitle: subtitle.trim() || 'Share unvarnished war stories and trade customer intros.',
    });
    onClose();
  };

  const handleResetToDefault = () => {
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#111114] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              Customize Community Banner
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Live Mini Preview */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Live Preview
            </span>
            <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white min-h-[160px] flex flex-col justify-end p-5 shadow-inner border border-zinc-800">
              <img
                src={imageUrl}
                alt="Banner Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              <div className="relative z-10 space-y-1.5 max-w-md">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  {tag || 'Category Tag'}
                </span>
                <h3 className="text-lg font-serif font-bold text-white leading-tight line-clamp-2">
                  {title || 'Your Headline Goes Here'}
                </h3>
                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                  {subtitle || 'Your custom community description will appear here.'}
                </p>
              </div>
            </div>
          </div>

          {/* 1. Cover Image Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
              <span>Cover Image</span>
              <span className="text-[11px] font-normal text-zinc-400">Upload your own or choose a preset</span>
            </label>

            {/* Upload Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-400 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-amber-500/5 text-zinc-700 dark:text-zinc-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-500" />
                <span>Upload From Device (PNG, JPG, WebP)</span>
              </button>
            </div>

            {uploadError && (
              <p className="text-xs text-red-500 font-medium">{uploadError}</p>
            )}

            {/* Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-zinc-400">Curated Presets:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_IMAGES.map((preset) => {
                  const isSelected = imageUrl === preset.src;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setImageUrl(preset.src)}
                      className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all group cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/30'
                          : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={preset.src}
                        alt={preset.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white leading-none truncate">
                          {preset.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Or Image URL */}
            <div className="pt-1 flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Or paste external image URL..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                disabled={!urlInput.trim()}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 disabled:opacity-40 transition-opacity"
              >
                Apply URL
              </button>
            </div>
          </div>

          {/* 2. Text Content Fields */}
          <div className="space-y-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {/* Tag / Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Category Kicker
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                maxLength={40}
                placeholder="e.g. The Venture Commons, Founder Spotlight..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Headline / Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Banner Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                placeholder="e.g. Where Visionaries Exchange Conviction"
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-amber-400 font-serif font-bold text-sm"
              />
            </div>

            {/* Subtitle / Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Description Subtitle
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={3}
                maxLength={200}
                placeholder="e.g. Share unvarnished war stories, trade customer intros, and build authentic founderhood..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-amber-400 font-sans resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Save & Apply Banner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlayIcon, 
  StopIcon, 
  RotateLeft01Icon, 
} from 'hugeicons-react';
import { 
  Volume2, VolumeX, Undo2, Radio, Loader2
} from 'lucide-react';
import { IconWrapper } from './IconWrapper';
import { cn } from '../lib/utils';
import { synthesizePitchSpeech, PitchVoiceName } from '../services/geminiService';

const VOICE_PERSONAS: { id: PitchVoiceName; label: string; tone: 'conversational' | 'warm' | 'confident' }[] = [
  { id: 'Zephyr', label: 'Natural Warm', tone: 'conversational' },
  { id: 'Puck', label: 'Casual & Lively', tone: 'conversational' },
  { id: 'Charon', label: 'Calm & Grounded', tone: 'warm' },
  { id: 'Kore', label: 'Clear & Steady', tone: 'confident' },
  { id: 'Fenrir', label: 'Deep & Assured', tone: 'confident' },
];

export interface PitchScript {
  hook: string;
  solution: string;
  ask: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  script: PitchScript;
}

const LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    script: {
      hook: "Most founders waste hundreds of hours chasing cold outreach with less than a 2% reply rate.",
      solution: "ConnectUp connects founders and investors through verified conviction, high-signal deal discovery, and instant diligence.",
      ask: "We are currently raising our seed round with active syndicate commitments. Let's schedule an intro."
    }
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    script: {
      hook: "La mayoría de los fundadores pierden cientos de horas en mensajes fríos con menos del 2% de respuesta.",
      solution: "ConnectUp conecta fundadores con inversores mediante coincidencias verificadas y análisis en tiempo real.",
      ask: "Estamos levantando nuestra ronda semilla con compromisos activos. Agendemos una reunión esta semana."
    }
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    script: {
      hook: "La plupart des fondateurs perdent des centaines d'heures en prospection avec moins de 2% de réponses.",
      solution: "ConnectUp connecte fondateurs et investisseurs grâce à des signaux vérifiés et une découverte qualifiée.",
      ask: "Nous levons actuellement notre tour d'amorçage avec des engagements confirmés. Planifions un échange."
    }
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    script: {
      hook: "Die meisten Gründer verschwenden hunderte Stunden mit Kaltakquise bei weniger als zwei Prozent Resonanz.",
      solution: "ConnectUp bringt Gründer und Investoren durch verifizierte Signale und datengestützte Diligence zusammen.",
      ask: "Wir sammeln derzeit unsere Seed-Finanzierungsrunde mit festen Zusagen ein. Lassen Sie uns einen Termin vereinbaren."
    }
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    script: {
      hook: "多くの起業家が返信率2%未満のコールドメールに何百時間も無駄にしています。",
      solution: "ConnectUpは確度の高いマッチングと即時デューデリジェンスで起業家と投資家を直接結びつけます。",
      ask: "現在シードラウンドの資金調達を実施中で、シンジケート枠も確定しています。ぜひ面談を設定させてください。"
    }
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    script: {
      hook: "大多数创业者在回复率不足2%的冷邮件开拓上浪费了数百个小时。",
      solution: "ConnectUp通过高信号验证与快速尽职调查，精准连接创业者与顶级投资人。",
      ask: "我们目前正在进行种子轮融资，已有明确跟投意向，期待与您预约一次深度交流。"
    }
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    script: {
      hook: "A maioria dos fundadores perde centenas de horas em prospecção fria com menos de 2% de taxa de resposta.",
      solution: "A ConnectUp conecta fundadores e investidores com base em convicção verificada e alta afinidade.",
      ask: "Estamos captando nossa rodada seed com compromissos de sindicatos ativos. Vamos agendar uma introdução."
    }
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    script: {
      hook: "La maggior parte dei fondatori perde centinaia di ore in contatti a freddo con meno del due percento di risposte.",
      solution: "ConnectUp unisce fondatori e investitori tramite opportunità ad alto segnale e analisi istantanea.",
      ask: "Stiamo raccogliendo il nostro round seed con impegni già attivi nel consorzio. Fissiamo un incontro."
    }
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    script: {
      hook: "대부분의 창업자는 응답률 2% 미만의 콜드 아웃리치에 수백 시간을 낭비합니다.",
      solution: "ConnectUp은 검증된 확신과 고신호 딜 디스커버리를 통해 창업자와 투자자를 연결합니다.",
      ask: "현재 시드 라운드를 진행 중이며 활성 신디케이트 참여가 확정되어 있습니다. 미팅을 잡고 싶습니다."
    }
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    script: {
      hook: "يهدر معظم المؤسسين مئات الساعات في التواصل البارد بمعدل استجابة يقل عن 2 بالمائة.",
      solution: "تربط ConnectUp بين المؤسسين والمستثمرين من خلال فرص عالية الجودة وتدقيق فوري.",
      ask: "نقوم حالياً بجمع جولة تمويل أولية مع التزامات نشطة. يسعدنا ترتيب اجتماع للتعارف."
    }
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    script: {
      hook: "अधिकांश संस्थापक दो प्रतिशत से कम उत्तर दर वाले कोल्ड आउटरीच में सैकड़ों घंटे बर्बाद करते हैं।",
      solution: "ConnectUp सत्यापित डेटा और उच्च-सिग्नल डील डिस्कवरी के माध्यम से संस्थापकों और निवेशकों को जोड़ता है।",
      ask: "हम वर्तमान में अपने सीड राउंड के लिए पूंजी जुटा रहे हैं। आइए इस सप्ताह एक संक्षिप्त बातचीत तय करें।"
    }
  }
];

// Valid 46-byte silent WAV (24kHz mono 16-bit PCM) to unlock HTMLAudioElement synchronously on click
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YQIAAAAAAA==';

const hasAudioContainerMagic = (bytes: Uint8Array): string | null => {
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    return 'audio/wav';
  }
  if (
    (bytes.length >= 3 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) ||
    (bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)
  ) {
    return 'audio/mpeg';
  }
  if (bytes.length >= 4 && bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) {
    return 'audio/ogg';
  }
  if (bytes.length >= 4 && bytes[0] === 0x66 && bytes[1] === 0x4c && bytes[2] === 0x61 && bytes[3] === 0x43) {
    return 'audio/flac';
  }
  if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return 'audio/webm';
  }
  return null;
};

const preparePlayableAudio = (
  rawBytes: Uint8Array,
  mimeType?: string
): { bytes: Uint8Array; blobType: string } => {
  const detectedMagic = hasAudioContainerMagic(rawBytes);
  if (detectedMagic) {
    return { bytes: rawBytes, blobType: detectedMagic };
  }

  const lowerMime = (mimeType || '').toLowerCase();
  const isCompressed =
    lowerMime.includes('mp3') ||
    lowerMime.includes('mpeg') ||
    lowerMime.includes('ogg') ||
    lowerMime.includes('opus') ||
    lowerMime.includes('webm') ||
    lowerMime.includes('aac') ||
    lowerMime.includes('mp4') ||
    lowerMime.includes('flac');
  if (isCompressed) {
    return { bytes: rawBytes, blobType: mimeType || 'audio/mpeg' };
  }

  // Wrap headerless raw L16 PCM into a valid RIFF/WAV container using reported rate/channels
  const rateMatch = lowerMime.match(/rate=(\d+)/);
  const channelsMatch = lowerMime.match(/channels=(\d+)/);
  const sampleRate = rateMatch ? Math.max(8000, Math.min(96000, Number(rateMatch[1]))) : 24000;
  const numChannels = channelsMatch ? Math.max(1, Math.min(2, Number(channelsMatch[1]))) : 1;
  const bitsPerSample = 16;
  const frameAlign = numChannels * (bitsPerSample / 8);
  const pcmLen = rawBytes.length - (rawBytes.length % frameAlign);
  const pcmBytes = pcmLen === rawBytes.length ? rawBytes : rawBytes.subarray(0, pcmLen);

  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const wav = new Uint8Array(44 + pcmBytes.length);
  const view = new DataView(wav.buffer);

  const writeAscii = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) wav[offset + i] = str.charCodeAt(i);
  };

  writeAscii(0, 'RIFF');
  view.setUint32(4, 36 + pcmBytes.length, true);
  writeAscii(8, 'WAVE');
  writeAscii(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, frameAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeAscii(36, 'data');
  view.setUint32(40, pcmBytes.length, true);
  wav.set(pcmBytes, 44);
  return { bytes: wav, blobType: 'audio/wav' };
};

const applyDeclickEnvelope = (audioBuf: AudioBuffer) => {
  const fadeSamples = Math.min(
    Math.floor(audioBuf.sampleRate * 0.004),
    Math.floor(audioBuf.length / 4)
  );
  if (fadeSamples <= 1) return;
  for (let ch = 0; ch < audioBuf.numberOfChannels; ch++) {
    const data = audioBuf.getChannelData(ch);
    for (let i = 0; i < fadeSamples; i++) {
      const gain = i / fadeSamples;
      data[i] *= gain;
      data[audioBuf.length - 1 - i] *= gain;
    }
  }
};

const decodeWavToAudioBuffer = (ctx: AudioContext, wavBuffer: ArrayBuffer): AudioBuffer | null => {
  try {
    if (wavBuffer.byteLength < 44) return null;
    const view = new DataView(wavBuffer);
    const readStr = (offset: number, len: number) => {
      let s = '';
      for (let i = 0; i < len; i++) s += String.fromCharCode(view.getUint8(offset + i));
      return s;
    };
    if (readStr(0, 4) !== 'RIFF' || readStr(8, 4) !== 'WAVE') return null;

    let offset = 12;
    let audioFormat = 0;
    let numChannels = 1;
    let sampleRate = 24000;
    let bitsPerSample = 16;
    let dataOffset = -1;
    let dataSize = 0;

    while (offset + 8 <= wavBuffer.byteLength) {
      const chunkId = readStr(offset, 4);
      const chunkSize = view.getUint32(offset + 4, true);
      const chunkDataStart = offset + 8;

      if (chunkId === 'fmt ' && chunkSize >= 16 && chunkDataStart + 16 <= wavBuffer.byteLength) {
        audioFormat = view.getUint16(chunkDataStart, true);
        numChannels = view.getUint16(chunkDataStart + 2, true);
        sampleRate = view.getUint32(chunkDataStart + 4, true);
        bitsPerSample = view.getUint16(chunkDataStart + 14, true);
      } else if (chunkId === 'data') {
        dataOffset = chunkDataStart;
        dataSize =
          chunkSize === 0 || chunkSize === 0xffffffff
            ? wavBuffer.byteLength - chunkDataStart
            : Math.min(chunkSize, wavBuffer.byteLength - chunkDataStart);
        break;
      }

      offset = chunkDataStart + chunkSize + (chunkSize % 2);
    }

    if ((audioFormat !== 1 && audioFormat !== 3) || dataOffset < 0 || dataSize <= 0 || numChannels < 1 || sampleRate < 8000) {
      return null;
    }

    if (audioFormat === 1 && bitsPerSample === 16) {
      const bytesPerFrame = numChannels * 2;
      const frameCount = Math.floor(dataSize / bytesPerFrame);
      if (frameCount <= 0) return null;
      const audioBuf = ctx.createBuffer(numChannels, frameCount, sampleRate);
      for (let ch = 0; ch < numChannels; ch++) {
        const channelData = audioBuf.getChannelData(ch);
        for (let i = 0; i < frameCount; i++) {
          const sampleOffset = dataOffset + i * bytesPerFrame + ch * 2;
          channelData[i] = view.getInt16(sampleOffset, true) / 32768;
        }
      }
      applyDeclickEnvelope(audioBuf);
      return audioBuf;
    }

    if (audioFormat === 3 && bitsPerSample === 32) {
      const bytesPerFrame = numChannels * 4;
      const frameCount = Math.floor(dataSize / bytesPerFrame);
      if (frameCount <= 0) return null;
      const audioBuf = ctx.createBuffer(numChannels, frameCount, sampleRate);
      for (let ch = 0; ch < numChannels; ch++) {
        const channelData = audioBuf.getChannelData(ch);
        for (let i = 0; i < frameCount; i++) {
          const sampleOffset = dataOffset + i * bytesPerFrame + ch * 4;
          channelData[i] = Math.max(-1, Math.min(1, view.getFloat32(sampleOffset, true)));
        }
      }
      applyDeclickEnvelope(audioBuf);
      return audioBuf;
    }

    return null;
  } catch {
    return null;
  }
};

type PitchSectionKey = 'hook' | 'solution' | 'ask';

export const PitchSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Pitch Studio Voice & speed states (defaults to 1x)
  const SPEED_OPTIONS = [1, 1.25, 1.5, 0.75] as const;
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isVoicing, setIsVoicing] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [blockedAudioUrl, setBlockedAudioUrl] = useState<string | null>(null);
  const [selectedLangCode, setSelectedLangCode] = useState<string>('en');
  const [selectedPersona, setSelectedPersona] = useState<PitchVoiceName>('Zephyr');
  const [activeVoiceSection, setActiveVoiceSection] = useState<PitchSectionKey | null>(null);

  // Pitch Studio audio engine refs
  const voiceProgressRafRef = useRef<number | null>(null);
  const playbackSpeedRef = useRef<number>(playbackSpeed);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioUnlockedRef = useRef<boolean>(false);
  const voiceRequestIdRef = useRef<number>(0);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const audioBufferCacheRef = useRef<Map<string, ArrayBuffer>>(new Map());
  const isVoicingRef = useRef<boolean>(false);
  const blockedAudioElemRef = useRef<HTMLAudioElement | null>(null);

  const getSavedScriptForLang = (langCode: string): PitchScript | null => {
    try {
      const saved = localStorage.getItem(`connectup_pitch_script_v6_${langCode}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.hook === 'string' && typeof parsed.solution === 'string' && typeof parsed.ask === 'string') {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load pitch script:", e);
    }
    return null;
  };

  const [pitchScript, setPitchScript] = useState<PitchScript>(() => {
    return getSavedScriptForLang('en') || LANGUAGES[0].script;
  });

  const [hookText, setHookText] = useState(pitchScript.hook);
  const [solutionText, setSolutionText] = useState(pitchScript.solution);
  const [askText, setAskText] = useState(pitchScript.ask);

  useEffect(() => {
    if (!isEditing && !isPlaying && !isVoicing) {
      setHookText(pitchScript.hook);
      setSolutionText(pitchScript.solution);
      setAskText(pitchScript.ask);
    }
  }, [isEditing, isPlaying, isVoicing, pitchScript]);

  const handleLanguageChange = (code: string) => {
    stopVoicing();
    setVoiceNotice(null);
    setBlockedAudioUrl(null);
    setSelectedLangCode(code);
    const targetLang = LANGUAGES.find(l => l.code === code);
    if (targetLang) {
      const nextScript = getSavedScriptForLang(code) || targetLang.script;
      setPitchScript(nextScript);
      setHookText(nextScript.hook);
      setSolutionText(nextScript.solution);
      setAskText(nextScript.ask);
    }
  };

  // Sync playback rate on active audio nodes / HTMLAudioElement
  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.playbackRate.value = playbackSpeed;
      } catch {}
    }
  }, [playbackSpeed]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isVoicingRef.current = false;
      voiceRequestIdRef.current += 1;
      if (voiceProgressRafRef.current !== null) cancelAnimationFrame(voiceProgressRafRef.current);
      if (audioSourceRef.current) {
        audioSourceRef.current.onended = null;
        try { audioSourceRef.current.stop(); } catch {}
        try { audioSourceRef.current.disconnect(); } catch {}
        audioSourceRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      audioCacheRef.current.forEach((url) => {
        try { URL.revokeObjectURL(url); } catch {}
      });
      audioCacheRef.current.clear();
      audioBufferCacheRef.current.clear();
    };
  }, []);

  // Smooth 60fps Timer Tick
  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      const deltaSec = Math.min((now - lastTimestamp) / 1000, 0.25);
      lastTimestamp = now;
      setCurrentTime((prev) => {
        const next = prev + deltaSec * playbackSpeedRef.current;
        return next >= 30 ? 30 : next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && currentTime >= 30) {
      handleCompleteSession();
    }
  }, [isPlaying, currentTime]);

  const handleCompleteSession = () => {
    setIsPlaying(false);
    stopVoicing();
  };

  const handleStart = () => {
    setVoiceNotice(null);
    setBlockedAudioUrl(null);
    if (currentTime >= 30) {
      setCurrentTime(0);
    }
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    stopVoicing();
  };

  const handleReset = () => {
    setVoiceNotice(null);
    setBlockedAudioUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    stopVoicing();
  };

  const stopVoicing = () => {
    isVoicingRef.current = false;
    voiceRequestIdRef.current += 1;
    setIsVoicing(false);
    setIsLoadingVoice(false);
    setActiveVoiceSection(null);
    if (voiceProgressRafRef.current !== null) {
      cancelAnimationFrame(voiceProgressRafRef.current);
      voiceProgressRafRef.current = null;
    }
    if (audioSourceRef.current) {
      audioSourceRef.current.onended = null;
      try { audioSourceRef.current.stop(); } catch {}
      try { audioSourceRef.current.disconnect(); } catch {}
      audioSourceRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      try {
        audioRef.current.currentTime = 0;
      } catch {}
      audioRef.current = null;
    }
  };

  const unlockAudioContextSynchronously = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const silentBuf = ctx.createBuffer(1, 128, ctx.sampleRate || 44100);
      const src = ctx.createBufferSource();
      src.buffer = silentBuf;
      src.connect(ctx.destination);
      src.start(0);
      return ctx;
    } catch {
      return null;
    }
  };

  // Dedicated Pitch Studio Voice Engine (server-synthesized WAV played via Web Audio + studio audio player)
  const speakPitch = async () => {
    if (isVoicing || isLoadingVoice) {
      stopVoicing();
      return;
    }

    const taggedSegments: { text: string; section: PitchSectionKey }[] = (
      [
        { text: hookText.trim(), section: 'hook' as const },
        { text: solutionText.trim(), section: 'solution' as const },
        { text: askText.trim(), section: 'ask' as const },
      ]
    ).filter((item) => item.text.length > 0);
    if (taggedSegments.length === 0) return;

    setVoiceNotice(null);
    setBlockedAudioUrl(null);
    const reqId = ++voiceRequestIdRef.current;
    isVoicingRef.current = true;

    const cleanText = taggedSegments
      .map((s) => (/[.!?。！？]$/.test(s.text) ? s.text : `${s.text}.`))
      .join('  ');

    // Add organic breath transitions between Hook, Solution, and Ask for Pitch Studio Voice Engine
    const humanFormattedTtsText = taggedSegments
      .map((s) => {
        const normalized = s.text
          .replace(/[<>|]/g, ' ')
          .replace(/\s+\/\s+/g, ', ')
          .replace(/\s+-\s+/g, ', ')
          .replace(/\s{2,}/g, ' ')
          .trim();
        return /[.!?。！？]$/.test(normalized) ? normalized : `${normalized}.`;
      })
      .join(' <breath> ');

    const personaMeta = VOICE_PERSONAS.find((v) => v.id === selectedPersona) || VOICE_PERSONAS[0];
    const cacheKey = `${selectedLangCode}:${selectedPersona}:${cleanText}`;

    const startAudioSectionSync = (
      getProgressRatio: () => number
    ) => {
      if (voiceProgressRafRef.current !== null) {
        cancelAnimationFrame(voiceProgressRafRef.current);
      }
      const totalChars = taggedSegments.reduce((acc, s) => acc + s.text.length, 0) || 1;
      let cumulative = 0;
      const thresholds = taggedSegments.map((s) => {
        cumulative += s.text.length / totalChars;
        return { section: s.section, upTo: cumulative };
      });

      const updateSection = () => {
        if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;
        const ratio = Math.max(0, Math.min(1, getProgressRatio()));
        const active =
          thresholds.find((t) => ratio <= t.upTo)?.section ||
          thresholds[thresholds.length - 1].section;
        setActiveVoiceSection((prev) => (prev === active ? prev : active));
        voiceProgressRafRef.current = requestAnimationFrame(updateSection);
      };

      setActiveVoiceSection(taggedSegments[0].section);
      voiceProgressRafRef.current = requestAnimationFrame(updateSection);
    };

    const playAudioUrl = async (objectUrl: string) => {
      if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;
      const audio = unlockedAudioRef.current || new Audio();
      unlockedAudioRef.current = audio;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.muted = false;
      audio.volume = 1;
      audio.src = objectUrl;
      audio.playbackRate = playbackSpeed;
      audioRef.current = audio;

      audio.onended = () => {
        if (voiceRequestIdRef.current === reqId) stopVoicing();
      };
      audio.onerror = () => {
        if (isVoicingRef.current && voiceRequestIdRef.current === reqId) {
          setBlockedAudioUrl(objectUrl);
          isVoicingRef.current = false;
          setIsVoicing(false);
          setIsLoadingVoice(false);
          setActiveVoiceSection(null);
          setVoiceNotice('Pitch Studio audio playback was paused by the browser. Click "Play Audio" below to listen.');
        }
      };

      setIsLoadingVoice(false);
      setIsVoicing(true);
      try {
        await audio.play();
        startAudioSectionSync(() => {
          if (!audio.duration || !isFinite(audio.duration)) return 0;
          return audio.currentTime / audio.duration;
        });
      } catch {
        if (isVoicingRef.current && voiceRequestIdRef.current === reqId) {
          setBlockedAudioUrl(objectUrl);
          isVoicingRef.current = false;
          setIsVoicing(false);
          setIsLoadingVoice(false);
          setActiveVoiceSection(null);
          setVoiceNotice('Browser autoplay was blocked. Click "Play Audio" below to listen.');
        }
      }
    };

    const playWavBuffer = async (wavBuffer: ArrayBuffer, objectUrl: string) => {
      if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;

      const ctx = audioCtxRef.current || unlockAudioContextSynchronously();
      if (ctx) {
        try {
          if (ctx.state === 'suspended') {
            await Promise.race([
              ctx.resume().catch(() => {}),
              new Promise((resolve) => setTimeout(resolve, 800)),
            ]);
          }
          if (ctx.state !== 'running') {
            throw new Error('AudioContext suspended');
          }

          let decoded = decodeWavToAudioBuffer(ctx, wavBuffer);
          if (!decoded) {
            decoded = await ctx.decodeAudioData(wavBuffer.slice(0));
          }
          if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;

          if (audioSourceRef.current) {
            audioSourceRef.current.onended = null;
            try { audioSourceRef.current.stop(); } catch {}
            try { audioSourceRef.current.disconnect(); } catch {}
          }

          const source = ctx.createBufferSource();
          source.buffer = decoded;
          source.playbackRate.value = playbackSpeed;

          // Play mastered 24kHz Pitch Studio audio uncolored at unity gain so chest warmth and natural harmonics are preserved
          if (typeof ctx.createGain === 'function') {
            const gain = ctx.createGain();
            gain.gain.value = 1.0;
            source.connect(gain);
            gain.connect(ctx.destination);
          } else {
            source.connect(ctx.destination);
          }

          source.onended = () => {
            if (voiceRequestIdRef.current === reqId) {
              stopVoicing();
            }
          };
          audioSourceRef.current = source;

          setIsLoadingVoice(false);
          setIsVoicing(true);
          source.start(0);

          let lastTrackTime = ctx.currentTime;
          let accumulatedBufferSec = 0;
          const totalDuration = Math.max(decoded.duration, 0.1);
          startAudioSectionSync(() => {
            const now = ctx.currentTime;
            const dt = Math.max(0, now - lastTrackTime);
            lastTrackTime = now;
            accumulatedBufferSec += dt * playbackSpeedRef.current;
            return accumulatedBufferSec / totalDuration;
          });
          return;
        } catch {
          // Fall through to Pitch Studio HTMLAudioElement WAV playback
        }
      }

      await playAudioUrl(objectUrl);
    };

    // Synchronously unlock Web Audio inside the user click gesture across all browsers
    const unlockedCtx = unlockAudioContextSynchronously();

    const cachedBuffer = audioBufferCacheRef.current.get(cacheKey);
    const cachedUrl = audioCacheRef.current.get(cacheKey);
    if (cachedBuffer && cachedUrl) {
      await playWavBuffer(cachedBuffer, cachedUrl);
      return;
    }
    if (cachedUrl) {
      await playAudioUrl(cachedUrl);
      return;
    }

    // Only unlock an HTMLAudioElement fallback synchronously when Web Audio is unavailable,
    // preventing competing silent audio sessions in Safari/iOS WebKit.
    if (!unlockedCtx && !audioUnlockedRef.current) {
      try {
        const audio = unlockedAudioRef.current || new Audio();
        unlockedAudioRef.current = audio;
        audio.muted = true;
        audio.src = SILENT_WAV_DATA_URI;
        const p = audio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            audio.muted = false;
            audioUnlockedRef.current = true;
          }).catch(() => {
            audio.muted = false;
          });
        }
      } catch {}
    }

    setIsLoadingVoice(true);
    try {
      const { audioBase64, mimeType } = await synthesizePitchSpeech(
        humanFormattedTtsText,
        selectedPersona,
        personaMeta.tone
      );
      if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;

      const normalizedB64 = audioBase64
        .replace(/\s+/g, '')
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const paddedB64 = normalizedB64.padEnd(normalizedB64.length + ((4 - (normalizedB64.length % 4)) % 4), '=');
      const binaryString = atob(paddedB64);
      const rawBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        rawBytes[i] = binaryString.charCodeAt(i);
      }
      const { bytes: playableBytes, blobType } = preparePlayableAudio(rawBytes, mimeType);
      const audioBuffer = new ArrayBuffer(playableBytes.byteLength);
      new Uint8Array(audioBuffer).set(playableBytes);
      const blob = new Blob([audioBuffer], { type: blobType });
      const objectUrl = URL.createObjectURL(blob);
      audioBufferCacheRef.current.set(cacheKey, audioBuffer);
      audioCacheRef.current.set(cacheKey, objectUrl);

      await playWavBuffer(audioBuffer, objectUrl);
    } catch (err: any) {
      if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;
      isVoicingRef.current = false;
      setIsVoicing(false);
      setIsLoadingVoice(false);
      setActiveVoiceSection(null);
      if (err?.status === 401) {
        setVoiceNotice('Sign in with an active session to use Pitch Studio voice.');
      } else if (err?.status === 429) {
        setVoiceNotice('Pitch Studio voice limit reached for now. Please wait a moment and try again.');
      } else if (err?.status === 503) {
        setVoiceNotice('Pitch Studio voice engine is temporarily unavailable.');
      } else {
        setVoiceNotice(err?.message || 'Pitch Studio voice could not be generated. Please try again.');
      }
    }
  };

  const getActiveSection = () => {
    if (currentTime < 5) return 'hook';
    if (currentTime < 20) return 'solution';
    return 'ask';
  };

  const handleToggleEdit = () => {
    stopVoicing();
    setVoiceNotice(null);
    setBlockedAudioUrl(null);
    if (isEditing) {
      const updatedScript: PitchScript = {
        hook: hookText,
        solution: solutionText,
        ask: askText,
      };
      setPitchScript(updatedScript);
      try {
        localStorage.setItem(`connectup_pitch_script_v6_${selectedLangCode}`, JSON.stringify(updatedScript));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleResetToDefaults = () => {
    stopVoicing();
    setVoiceNotice(null);
    setBlockedAudioUrl(null);
    const defaultLang = LANGUAGES[0];
    setSelectedLangCode('en');
    setPitchScript(defaultLang.script);
    setHookText(defaultLang.script.hook);
    setSolutionText(defaultLang.script.solution);
    setAskText(defaultLang.script.ask);
    try {
      localStorage.removeItem('connectup_pitch_script_v6_en');
      localStorage.removeItem('connectup_pitch_script_v5');
    } catch {}
  };

  const currentSection = activeVoiceSection ?? getActiveSection();
  const progressPercent = Math.min((currentTime / 30) * 100, 100);

  const totalWords = useMemo(() => {
    const full = `${hookText} ${solutionText} ${askText}`;
    return full.trim().split(/\s+/).filter(Boolean).length;
  }, [hookText, solutionText, askText]);

  const recommendedWpm = Math.round((totalWords / 30) * 60);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-6 shadow-xs border border-zinc-200/70 dark:border-zinc-800 flex flex-col h-full transition-colors duration-200">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white leading-tight">
                Pitch Studio
              </h3>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Translate your pitch and rehearse aloud with Pitch Studio&apos;s built-in voice engine
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language / Translation Selector */}
          <select
            value={selectedLangCode}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="h-8 px-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            title="Convert and voice in target language"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>

          {/* Voice Persona Selector */}
          <select
            value={selectedPersona}
            onChange={(e) => {
              stopVoicing();
              setVoiceNotice(null);
              setBlockedAudioUrl(null);
              setSelectedPersona(e.target.value as PitchVoiceName);
            }}
            disabled={isLoadingVoice}
            className="h-8 px-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer disabled:opacity-50"
            title="Select natural speaker voice style"
          >
            {VOICE_PERSONAS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>

          {/* Playback Speed Toggle (defaults to 1x) */}
          <button
            type="button"
            onClick={() => {
              const idx = SPEED_OPTIONS.indexOf(playbackSpeed as any);
              const nextSpeed = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
              setPlaybackSpeed(nextSpeed);
            }}
            disabled={isLoadingVoice}
            className="h-8 px-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Playback & voice speed (1x normal)"
          >
            {playbackSpeed}x
          </button>

          {/* Voice Read-Aloud Button */}
          <button
            type="button"
            onClick={speakPitch}
            disabled={isEditing}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border disabled:opacity-40 shadow-2xs active:scale-95",
              isVoicing
                ? "bg-amber-400 text-zinc-950 border-amber-400 animate-pulse font-extrabold"
                : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            )}
            title={isVoicing ? "Stop voice narration" : "Listen to pitch voiced aloud"}
          >
            {isLoadingVoice ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>Preparing...</span>
              </>
            ) : isVoicing ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Voice Pitch</span>
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Reset to default script"
            >
              <Undo2 className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleEdit}
            disabled={isPlaying}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border disabled:opacity-40 shadow-2xs",
              isEditing 
                ? "bg-amber-400 text-zinc-950 border-amber-400"
                : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            )}
            title={isEditing ? "Save Script" : "Edit Script"}
          >
            {isEditing ? <span>Save</span> : <span>Customize</span>}
          </button>
        </div>
      </div>

      {/* Timer & Stage Timeline */}
      <div className="mb-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-3xl sm:text-4xl font-mono font-bold tracking-tight transition-colors tabular-nums",
              isPlaying ? "text-amber-500" : "text-zinc-950 dark:text-white"
            )}>
              {currentTime.toFixed(1)}s
            </span>
            <span className="text-xs font-mono text-zinc-400">/ 30.0s</span>

            {/* Active Soundwave Visualizer */}
            {isVoicing && (
              <div className="flex items-end gap-1 ml-2 h-6">
                {[0.3, 0.7, 1.0, 0.6, 0.4].map((scale, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [6, 20 * scale, 8, 18 * scale] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1 rounded-full bg-amber-400"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)] will-change-[width]"
            style={{ width: `${progressPercent}%` }}
          />
          <div className="absolute top-0 bottom-0 left-[16.6%] w-0.5 bg-zinc-300 dark:bg-zinc-700" />
          <div className="absolute top-0 bottom-0 left-[66.6%] w-0.5 bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <AnimatePresence>
          {voiceNotice && (
            <motion.p
              key="voice-notice"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-medium text-amber-600 dark:text-amber-400"
            >
              {voiceNotice}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {blockedAudioUrl && (
            <motion.div
              key="blocked-audio"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center gap-2"
            >
              <button
                type="button"
                onClick={() => {
                  const el = blockedAudioElemRef.current;
                  if (el) {
                    el.playbackRate = playbackSpeed;
                    el.play().catch(() => {});
                  }
                }}
                className="h-9 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Audio</span>
              </button>
              <audio
                ref={blockedAudioElemRef}
                controls
                src={blockedAudioUrl}
                className="flex-1 min-w-[200px] h-9 rounded-xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Teleprompter Script Area */}
      <div className="relative flex-1 min-h-[200px] rounded-2xl p-4 sm:p-5 bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 flex flex-col justify-center overflow-hidden mb-3.5">
        {isPlaying && (
          <motion.div 
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-16 bg-amber-400/5 blur-xl pointer-events-none"
          />
        )}

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="pitch-editor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full space-y-3 relative z-10 overflow-y-auto max-h-[240px] pr-1"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">
                  Phase 1: Hook (0-5s)
                </span>
                <textarea
                  value={hookText}
                  onChange={(e) => setHookText(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-950 dark:text-white outline-none focus:border-amber-400 resize-none font-sans transition-colors"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">
                  Phase 2: Solution (5-20s)
                </span>
                <textarea
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-950 dark:text-white outline-none focus:border-amber-400 resize-none font-sans transition-colors"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">
                  Phase 3: The Ask (20-30s)
                </span>
                <textarea
                  value={askText}
                  onChange={(e) => setAskText(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-950 dark:text-white outline-none focus:border-amber-400 resize-none font-sans transition-colors"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`teleprompter-${selectedLangCode}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="space-y-2.5 relative z-10 w-full"
            >
              {(
                [
                  { key: 'hook' as const, label: '1. Hook', text: hookText },
                  { key: 'solution' as const, label: '2. Solution', text: solutionText },
                  { key: 'ask' as const, label: '3. The Ask', text: askText },
                ]
              ).map((item) => {
                const isActive = currentSection === item.key;
                return (
                  <motion.div
                    key={item.key}
                    animate={{
                      opacity: isActive ? 1 : 0.45,
                      scale: isActive ? 1 : 0.99,
                    }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="relative p-3 rounded-xl"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="pitch-active-card"
                        transition={{ type: 'spring', stiffness: 360, damping: 32, mass: 0.85 }}
                        className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-900/95 border-l-2 border-amber-400 shadow-xs pointer-events-none"
                      />
                    )}
                    <div className="relative z-10">
                      <span className="text-[9px] uppercase font-bold text-amber-500 font-mono block mb-0.5">
                        {item.label}
                      </span>
                      <p
                        className={cn(
                          'text-sm sm:text-base leading-relaxed transition-colors duration-300',
                          isActive
                            ? 'text-zinc-950 dark:text-white font-semibold'
                            : 'text-zinc-500 dark:text-zinc-400 font-medium'
                        )}
                      >
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls & Pacing Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handleStart}
              disabled={isEditing}
              className="h-10 px-5 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-850 text-white dark:text-zinc-950 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-40 shadow-xs flex items-center gap-2"
            >
              <IconWrapper icon={PlayIcon} size={13} className="text-amber-400 dark:text-amber-500" />
              <span>{currentTime > 0 ? "Resume" : "Start Pitch"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="h-10 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs flex items-center gap-2"
            >
              <IconWrapper icon={StopIcon} size={13} />
              <span>Pause</span>
            </button>
          )}

          {(currentTime > 0 || isPlaying) && (
            <button
              type="button"
              onClick={handleReset}
              className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
              title="Reset Timer"
            >
              <IconWrapper icon={RotateLeft01Icon} size={16} />
            </button>
          )}
        </div>

        <div className="text-right text-[11px] text-zinc-400 font-mono">
          <div className="text-zinc-700 dark:text-zinc-300 font-bold">
            {totalWords} words
          </div>
          <div>~{recommendedWpm} WPM pace</div>
        </div>
      </div>
    </div>
  );
};

export default PitchSimulator;

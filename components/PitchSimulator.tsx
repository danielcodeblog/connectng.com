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
import { synthesizePitchSpeech } from '../services/geminiService';

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

const LANG_LOCALES: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  ja: 'ja-JP',
  zh: 'zh-CN',
  pt: 'pt-BR',
  it: 'it-IT',
  ko: 'ko-KR',
  ar: 'ar-SA',
  hi: 'hi-IN',
};

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

interface TaggedSpeechChunk {
  text: string;
  section: PitchSectionKey;
}

const splitIntoSpeechChunks = (
  sections: { text: string; section: PitchSectionKey }[]
): TaggedSpeechChunk[] => {
  const chunks: TaggedSpeechChunk[] = [];
  for (const item of sections) {
    const trimmed = item.text.trim();
    if (!trimmed) continue;
    const sentences = trimmed.split(/(?<=[.!?。！？])\s+/).filter(Boolean);
    const parts = sentences.length === 0 ? [trimmed] : sentences;
    for (const part of parts) {
      if (part.length <= 220) {
        chunks.push({ text: part, section: item.section });
      } else {
        const subParts = part.split(/(?<=[,;、，；])\s+/).filter(Boolean);
        const finalParts = subParts.length > 0 ? subParts : [part];
        for (const sub of finalParts) {
          chunks.push({ text: sub, section: item.section });
        }
      }
    }
  }
  return chunks;
};

export const PitchSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Voice & speed states (defaults to 1x)
  const SPEED_OPTIONS = [1, 1.25, 1.5, 0.75] as const;
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isVoicing, setIsVoicing] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [blockedAudioUrl, setBlockedAudioUrl] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [selectedLangCode, setSelectedLangCode] = useState<string>('en');
  const [activeVoiceSection, setActiveVoiceSection] = useState<PitchSectionKey | null>(null);

  // Audio playback & SpeechSynthesis refs
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const utteranceQueueRef = useRef<SpeechSynthesisUtterance[]>([]);
  const speechTimeoutRef = useRef<any>(null);
  const speechWatchdogRef = useRef<any>(null);
  const voiceProgressRafRef = useRef<number | null>(null);
  const playbackSpeedRef = useRef<number>(playbackSpeed);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioUnlockedRef = useRef<boolean>(false);
  const ttsUnavailableRef = useRef<boolean>(false);
  const voiceRequestIdRef = useRef<number>(0);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const audioBufferCacheRef = useRef<Map<string, ArrayBuffer>>(new Map());
  const isVoicingRef = useRef<boolean>(false);
  const blockedAudioElemRef = useRef<HTMLAudioElement | null>(null);

  const scoreNaturalVoice = (v: SpeechSynthesisVoice, langCode: string): number => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    let score = 0;

    if (lang.startsWith(langCode.toLowerCase())) {
      score += 200;
      if (lang === 'en-us' || lang === 'en-gb') score += 15;
    }

    if (
      name.includes('online (natural)') ||
      name.includes('natural') ||
      name.includes('neural') ||
      name.includes('wavenet') ||
      name.includes('studio')
    ) {
      score += 150;
    } else if (name.includes('enhanced') || name.includes('premium') || name.includes('siri')) {
      score += 115;
    } else if (name.includes('google')) {
      score += 100;
    }

    const warmHumanNames = [
      'samantha', 'ava', 'allison', 'daniel', 'karen', 'moira', 'tessa',
      'aria', 'jenny', 'guy', 'sonia', 'ryan', 'libby', 'serena', 'oliver', 'kate', 'clara'
    ];
    if (warmHumanNames.some((n) => name.includes(n))) {
      score += 75;
    }

    if (v.localService) {
      score += 10;
    }

    const roboticNames = [
      'espeak', 'festival', 'speech-dispatcher', 'rhvoice', 'fred', 'albert', 'bad news',
      'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'deranged', 'good news', 'hysterical',
      'jester', 'organ', 'trinoids', 'whisper', 'zarvox', 'junior', 'kathy', 'ralph', 'eddy',
      'flo', 'grandma', 'grandpa', 'reed', 'rocko', 'sandy', 'shelley',
      'microsoft david', 'microsoft zira', 'microsoft mark', 'microsoft hazel',
      'microsoft george', 'microsoft susan', 'microsoft heera', 'microsoft ravi'
    ];
    if (roboticNames.some((n) => name.includes(n))) {
      score -= 220;
    }

    return score;
  };

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

  // Load and rank browser SpeechSynthesis voices prioritizing natural human voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices && allVoices.length > 0) {
        const sortedVoices = [...allVoices].sort(
          (a, b) => scoreNaturalVoice(b, selectedLangCode) - scoreNaturalVoice(a, selectedLangCode)
        );
        setAvailableVoices(sortedVoices);

        const bestVoice = sortedVoices[0];
        if (bestVoice) {
          setSelectedVoiceURI(bestVoice.voiceURI);
        }
      }
    };

    populateVoices();
    const synth = window.speechSynthesis;
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', populateVoices);
    } else {
      synth.onvoiceschanged = populateVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        if (typeof synth.removeEventListener === 'function') {
          synth.removeEventListener('voiceschanged', populateVoices);
        } else {
          synth.onvoiceschanged = null;
        }
      }
    };
  }, [selectedLangCode]);

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

      // Automatically select highest-ranked natural voice for this language
      const sortedForLang = [...availableVoices].sort(
        (a, b) => scoreNaturalVoice(b, code) - scoreNaturalVoice(a, code)
      );
      if (sortedForLang[0]) {
        setSelectedVoiceURI(sortedForLang[0].voiceURI);
      }
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
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (speechWatchdogRef.current) clearTimeout(speechWatchdogRef.current);
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
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
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
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
    if (speechWatchdogRef.current) {
      clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = null;
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    utteranceRef.current = null;
    utteranceQueueRef.current = [];
  };

  const speakWithBrowserFallback = (
    taggedSegments: { text: string; section: PitchSectionKey }[],
    reqId: number
  ) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      stopVoicing();
      setVoiceNotice('Voice synthesis is not supported in this browser.');
      return;
    }

    const cleanChunks = splitIntoSpeechChunks(taggedSegments);
    if (cleanChunks.length === 0) {
      stopVoicing();
      return;
    }

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    if (speechWatchdogRef.current) clearTimeout(speechWatchdogRef.current);

    const synth = window.speechSynthesis;
    const allVoices = synth.getVoices();
    const rankedVoices = [...(allVoices.length > 0 ? allVoices : availableVoices)].sort(
      (a, b) => scoreNaturalVoice(b, selectedLangCode) - scoreNaturalVoice(a, selectedLangCode)
    );
    const primaryVoice =
      rankedVoices.find((v) => v.voiceURI === selectedVoiceURI) || rankedVoices[0];
    const localLangVoice = rankedVoices.find(
      (v) => v.localService && v.lang.toLowerCase().startsWith(selectedLangCode.toLowerCase())
    ) || rankedVoices.find((v) => v.localService);
    const fallbackLang = LANG_LOCALES[selectedLangCode] || 'en-US';
    const isChromium =
      typeof navigator !== 'undefined' && /Chrome|Chromium|Edg/i.test(navigator.userAgent);

    isVoicingRef.current = true;
    setIsLoadingVoice(false);
    setIsVoicing(true);

    // voiceTier: 0 = ranked voice, 1 = local OS voice, 2 = system default (no explicit .voice)
    // Queue all remaining chunks synchronously so Safari/iOS/Firefox never lose gesture activation between sentences.
    const enqueueRemainingChunks = (startIdx: number, voiceTier: 0 | 1 | 2 = primaryVoice ? 0 : 2) => {
      if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId || startIdx >= cleanChunks.length) {
        if (voiceRequestIdRef.current === reqId) stopVoicing();
        return;
      }

      const chosenVoice =
        voiceTier === 0 ? primaryVoice : voiceTier === 1 ? localLangVoice : undefined;

      utteranceQueueRef.current = [];
      let hasStartedAny = false;

      const retryFromChunk = (failedIdx: number) => {
        if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;
        const nextTier: 1 | 2 | null =
          voiceTier === 0 && localLangVoice && localLangVoice.voiceURI !== primaryVoice?.voiceURI
            ? 1
            : voiceTier < 2
              ? 2
              : null;

        if (nextTier !== null) {
          try {
            synth.cancel();
          } catch {}
          if (isChromium) {
            speechTimeoutRef.current = setTimeout(() => enqueueRemainingChunks(failedIdx, nextTier), 120);
          } else {
            enqueueRemainingChunks(failedIdx, nextTier);
          }
        } else {
          stopVoicing();
          setVoiceNotice('Browser blocked or has no available speech voice. Enable site audio or check browser voice settings.');
        }
      };

      if (speechWatchdogRef.current) clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = setTimeout(() => {
        if (!hasStartedAny && isVoicingRef.current && voiceRequestIdRef.current === reqId) {
          retryFromChunk(startIdx);
        }
      }, voiceTier < 2 ? 1800 : 2600);

      for (let i = startIdx; i < cleanChunks.length; i++) {
        const chunkIdx = i;
        const chunkItem = cleanChunks[chunkIdx];
        const utterance = new SpeechSynthesisUtterance(chunkItem.text);
        if (chunkIdx === startIdx) {
          utteranceRef.current = utterance;
        }
        utteranceQueueRef.current.push(utterance);

        if (chosenVoice) {
          utterance.voice = chosenVoice;
          utterance.lang = chosenVoice.lang || fallbackLang;
        } else {
          utterance.lang = fallbackLang;
        }
        utterance.rate = playbackSpeed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          hasStartedAny = true;
          utteranceRef.current = utterance;
          setActiveVoiceSection(chunkItem.section);
          if (speechWatchdogRef.current) {
            clearTimeout(speechWatchdogRef.current);
            speechWatchdogRef.current = null;
          }
        };

        utterance.onend = () => {
          if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;
          if (chunkIdx === cleanChunks.length - 1) {
            stopVoicing();
          } else {
            if (speechWatchdogRef.current) clearTimeout(speechWatchdogRef.current);
            speechWatchdogRef.current = setTimeout(() => {
              if (isVoicingRef.current && voiceRequestIdRef.current === reqId) {
                retryFromChunk(chunkIdx + 1);
              }
            }, 2500);
          }
        };

        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          if (speechWatchdogRef.current) {
            clearTimeout(speechWatchdogRef.current);
            speechWatchdogRef.current = null;
          }
          if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;
          if (event?.error === 'interrupted' || event?.error === 'canceled') return;
          retryFromChunk(chunkIdx);
        };

        try {
          if (synth.paused) synth.resume();
          synth.speak(utterance);
        } catch {
          retryFromChunk(chunkIdx);
          return;
        }
      }
    };

    const needsCancel = synth.speaking || synth.pending;
    if (needsCancel) {
      try {
        synth.cancel();
      } catch {}
      if (isChromium) {
        speechTimeoutRef.current = setTimeout(() => enqueueRemainingChunks(0), 120);
      } else {
        enqueueRemainingChunks(0);
      }
    } else {
      enqueueRemainingChunks(0);
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

  const primeSpeechSynthesisSynchronously = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const synth = window.speechSynthesis;
      synth.getVoices();
      if (synth.paused) synth.resume();
      const primer = new SpeechSynthesisUtterance(' ');
      primer.volume = 0;
      primer.rate = 10;
      primer.lang = LANG_LOCALES[selectedLangCode] || 'en-US';
      utteranceRef.current = primer;
      synth.speak(primer);
    } catch {}
  };

  // Natural AI Voice Read-Aloud (Gemini TTS primary via Web Audio + HTMLAudio, browser speechSynthesis fallback)
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
    const cacheKey = `${selectedLangCode}:${cleanText}`;

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
          speakWithBrowserFallback(taggedSegments, reqId);
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

          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch {}
          }

          const source = ctx.createBufferSource();
          source.buffer = decoded;
          source.playbackRate.value = playbackSpeed;

          let lastNode: AudioNode = source;
          if (typeof ctx.createBiquadFilter === 'function') {
            const highpass = ctx.createBiquadFilter();
            highpass.type = 'highpass';
            highpass.frequency.value = 80;
            highpass.Q.value = 0.7;

            const presence = ctx.createBiquadFilter();
            presence.type = 'peaking';
            presence.frequency.value = 3000;
            presence.Q.value = 0.9;
            presence.gain.value = 2.0;

            lastNode.connect(highpass);
            highpass.connect(presence);
            lastNode = presence;
          }

          if (typeof ctx.createDynamicsCompressor === 'function') {
            const compressor = ctx.createDynamicsCompressor();
            compressor.threshold.value = -10;
            compressor.knee.value = 12;
            compressor.ratio.value = 2.5;
            compressor.attack.value = 0.004;
            compressor.release.value = 0.14;
            lastNode.connect(compressor);
            lastNode = compressor;
          }

          if (typeof ctx.createGain === 'function') {
            const makeup = ctx.createGain();
            makeup.gain.value = 1.15;
            lastNode.connect(makeup);
            lastNode = makeup;
          }

          lastNode.connect(ctx.destination);

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
          // Fall through to HTMLAudioElement playback
        }
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch {}
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

    // Only skip server TTS if the server explicitly returned 503 (missing GEMINI_API_KEY)
    if (ttsUnavailableRef.current) {
      speakWithBrowserFallback(taggedSegments, reqId);
      return;
    }

    // Synchronously prime speechSynthesis inside the click gesture so Safari/iOS/Firefox
    // preserve activation if async server TTS falls back (e.g., 401/503/network error).
    primeSpeechSynthesisSynchronously();

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
      const { audioBase64, mimeType } = await synthesizePitchSpeech(cleanText, 'Kore');
      if (!isVoicingRef.current || voiceRequestIdRef.current !== reqId) return;

      const binaryString = atob(audioBase64);
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
      if (err?.status === 503) {
        ttsUnavailableRef.current = true;
      }
      setIsLoadingVoice(false);
      speakWithBrowserFallback(taggedSegments, reqId);
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
              Translate your pitch and voice it aloud with high-level neural personas
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

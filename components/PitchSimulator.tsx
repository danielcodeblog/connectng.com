import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlayIcon, 
  StopIcon, 
  RotateLeft01Icon, 
  PencilEdit02Icon, 
} from 'hugeicons-react';
import { 
  Mic, MicOff, Volume2, VolumeX, Check, Undo2, 
  Play, Pause, Trash2, Radio, Download, 
  Settings2, Sliders, ChevronDown, Globe, Languages
} from 'lucide-react';
import { IconWrapper } from './IconWrapper';
import { cn } from '../lib/utils';

export interface PitchScript {
  hook: string;
  solution: string;
  ask: string;
}
export type PitchFormula = PitchScript;

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  sampleScript?: PitchScript;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    sampleScript: {
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
    sampleScript: {
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
    sampleScript: {
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
    sampleScript: {
      hook: "Die meisten Gründer verschwenden hunderte Stunden mit Kaltakquise bei weniger als zwei Prozent Resonanz.",
      solution: "ConnectUp bringt Gründer und Investoren durch verifizierte Signale und datengestützte Diligence zusammen.",
      ask: "Wir sammeln derzeit unsere Seed-Finanzierungsrunde mit festen Zusagen ein. Lassen Sie uns einen Termin vereinbaren."
    }
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    sampleScript: {
      hook: "La maggior parte dei fondatori perde centinaia di ore in contatti a freddo con meno del due percento di risposte.",
      solution: "ConnectUp unisce fondatori e investitori tramite opportunità ad alto segnale e analisi istantanea.",
      ask: "Stiamo raccogliendo il nostro round seed con impegni già attivi nel consorzio. Fissiamo un incontro."
    }
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    sampleScript: {
      hook: "A maioria dos fundadores perde centenas de horas em prospecção fria com menos de 2% de taxa de resposta.",
      solution: "A ConnectUp conecta fundadores e investidores com base em convicção verificada e alta afinidade.",
      ask: "Estamos captando nossa rodada seed com compromissos de sindicatos ativos. Vamos agendar uma introdução."
    }
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    sampleScript: {
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
    sampleScript: {
      hook: "大多数创业者在回复率不足2%的冷邮件开拓上浪费了数百个小时。",
      solution: "ConnectUp通过高信号验证与快速尽职调查，精准连接创业者与顶级投资人。",
      ask: "我们目前正在进行种子轮融资，已有明确跟投意向，期待与您预约一次深度交流。"
    }
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    sampleScript: {
      hook: "अधिकांश संस्थापक दो प्रतिशत से कम उत्तर दर वाले कोल्ड आउटरीच में सैकड़ों घंटे बर्बाद करते हैं।",
      solution: "ConnectUp सत्यापित डेटा और उच्च-सिग्नल डील डिस्कवरी के माध्यम से संस्थापकों और निवेशकों को जोड़ता है।",
      ask: "हम वर्तमान में अपने सीड राउंड के लिए पूंजी जुटा रहे हैं। आइए इस सप्ताह एक संक्षिप्त बातचीत तय करें।"
    }
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    sampleScript: {
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
    sampleScript: {
      hook: "يهدر معظم المؤسسين مئات الساعات في التواصل البارد بمعدل استجابة يقل عن 2 بالمائة.",
      solution: "تربط ConnectUp بين المؤسسين والمستثمرين من خلال فرص عالية الجودة وتدقيق فوري.",
      ask: "نقوم حالياً بجمع جولة تمويل أولية مع التزامات نشطة. يسعدنا ترتيب اجتماع للتعارف."
    }
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    sampleScript: {
      hook: "De meeste oprichters verspillen honderden uren aan koude acquisitie met minder dan 2% respons.",
      solution: "ConnectUp verbindt oprichters en investeerders via geverifieerde signalen en realtime diligence.",
      ask: "We halen momenteel onze seed-ronde op met actieve toezeggingen. Laten we een introductie inplannen."
    }
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    sampleScript: {
      hook: "Большинство основателей тратят сотни часов на холодные контакты с откликом менее двух процентов.",
      solution: "ConnectUp соединяет фаундеров и инвесторов на основе проверенных сигналов и быстрого анализа.",
      ask: "Сейчас мы закрываем посевной раунд с подтвержденными синдикатами. Давайте назначим вводную встречу."
    }
  }
];

const defaultPitchScript: PitchScript = {
  hook: "Most founders waste hundreds of hours chasing cold outreach with less than a 2% reply rate.",
  solution: "ConnectUp connects founders and investors through verified conviction, high-signal deal discovery, and instant diligence.",
  ask: "We are currently raising our seed round with active syndicate commitments. Let's schedule an intro."
};

export const PitchSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Voice states
  const [isVoicing, setIsVoicing] = useState(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Voice & Narration Config
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem('connectup_pitch_voice_lang') || 'en';
    } catch {
      return 'en';
    }
  });
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.1);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);

  // Voice Dictation (Speech-to-Text)
  const [isDictating, setIsDictating] = useState(false);
  const [dictatingField, setDictatingField] = useState<'hook' | 'solution' | 'ask' | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Web Audio and MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Chrome utterance keep-alive refs
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveIntervalRef = useRef<any>(null);

  const [pitchScript, setPitchScript] = useState<PitchScript>(() => {
    try {
      const saved = localStorage.getItem('connectup_pitch_script_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.hook === 'string' && typeof parsed.solution === 'string' && typeof parsed.ask === 'string') {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load pitch script:", e);
    }
    return defaultPitchScript;
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

  const currentLangConfig = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
  }, [selectedLanguage]);

  // Helper to check if a voice is a Google voice persona
  const isGoogleVoice = (v: SpeechSynthesisVoice): boolean => {
    return v.name.toLowerCase().includes('google') || v.voiceURI.toLowerCase().includes('google');
  };

  // Pick best Google voice persona for a given language
  const pickBestVoiceForLang = (langCode: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (!voices || voices.length === 0) return null;
    
    // Enforce ONLY Google voice persona allowed
    const googleVoices = voices.filter(isGoogleVoice);
    const pool = googleVoices.length > 0 ? googleVoices : voices;

    const matching = langCode === 'all'
      ? pool
      : pool.filter(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
    
    if (matching.length === 0) return pool[0] || null;

    // Pick top Google voice persona for selected language
    const preferred = matching.find(isGoogleVoice) || matching[0];

    return preferred;
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    try {
      localStorage.setItem('connectup_pitch_voice_lang', langCode);
    } catch {}
    const best = pickBestVoiceForLang(langCode, availableVoices);
    if (best) {
      setSelectedVoiceURI(best.voiceURI);
    }
  };

  const handleLoadLanguageScript = (langCode: string) => {
    const targetLang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (targetLang && targetLang.sampleScript) {
      setPitchScript(targetLang.sampleScript);
      setHookText(targetLang.sampleScript.hook);
      setSolutionText(targetLang.sampleScript.solution);
      setAskText(targetLang.sampleScript.ask);
      try {
        localStorage.setItem('connectup_pitch_script_v4', JSON.stringify(targetLang.sampleScript));
      } catch {}
    }
  };

  const filteredVoices = useMemo(() => {
    if (!availableVoices || availableVoices.length === 0) return [];
    
    // Only Google voice personas allowed
    const googlePool = availableVoices.filter(isGoogleVoice);
    const pool = googlePool.length > 0 ? googlePool : availableVoices;

    if (selectedLanguage === 'all') return pool;
    const matching = pool.filter(v => 
      v.lang.toLowerCase().startsWith(selectedLanguage.toLowerCase())
    );
    return matching.length > 0 ? matching : pool;
  }, [availableVoices, selectedLanguage]);

  // Load browser SpeechSynthesis voices (Restricted ONLY to Google Voice Personas)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const populateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices && allVoices.length > 0) {
        // Enforce ONLY Google voice persona allowed
        const googleVoices = allVoices.filter(isGoogleVoice);
        
        // If Google voices are present in the browser, strictly allow only them
        const finalVoices = googleVoices.length > 0 ? googleVoices : allVoices;
        setAvailableVoices(finalVoices);

        if (!selectedVoiceURI || !finalVoices.some(v => v.voiceURI === selectedVoiceURI)) {
          const preferred = pickBestVoiceForLang(selectedLanguage, finalVoices);
          if (preferred) setSelectedVoiceURI(preferred.voiceURI);
        }
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceURI, selectedLanguage]);

  // Clean up audio context and intervals on unmount
  useEffect(() => {
    return () => {
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 30) {
            handleCompleteSession();
            return 30;
          }
          return Number((prev + 0.1).toFixed(1));
        });
      }, 100);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleCompleteSession = () => {
    setIsPlaying(false);
    stopVoicing();
    stopRecording();
    stopDictation();
  };

  const handleStart = () => {
    if (currentTime >= 30) {
      setCurrentTime(0);
    }
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    stopVoicing();
    stopRecording();
    stopDictation();
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    stopVoicing();
    stopRecording();
    stopDictation();
  };

  // --- AI Voice Read-Aloud (Speech Synthesis) ---
  const speakPitch = () => {
    if (isVoicing) {
      stopVoicing();
      handleStop();
      return;
    }

    // Stop mic recording / dictation if active
    if (isRecordingMic) stopRecording();
    if (isDictating) stopDictation();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setMicError("Speech synthesis is not supported on this browser.");
      return;
    }

    const cleanText = `${hookText}. ${solutionText}. ${askText}`;

    window.speechSynthesis.cancel();
    if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Strictly apply Google Voice Persona
    const googlePool = availableVoices.filter(isGoogleVoice);
    const pool = googlePool.length > 0 ? googlePool : availableVoices;
    const activeVoice = pool.find(v => v.voiceURI === selectedVoiceURI) || pickBestVoiceForLang(selectedLanguage, pool);
    if (activeVoice) {
      utterance.voice = activeVoice;
      utterance.lang = activeVoice.lang;
    } else if (selectedLanguage && selectedLanguage !== 'all') {
      utterance.lang = selectedLanguage;
    }

    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsVoicing(true);
      handleStart();
      // Chrome keep-alive bug
      keepAliveIntervalRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 4500);
    };

    utterance.onend = () => {
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
      setIsVoicing(false);
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (err) => {
      console.warn("SpeechSynthesis error:", err);
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
      setIsVoicing(false);
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    // Wake up speech engine
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  const stopVoicing = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
    setIsVoicing(false);
    utteranceRef.current = null;
  };

  // --- Founder Mic Voice Recording (With Live Reactive Web Audio Visualizer) ---
  const startRecording = async () => {
    setMicError(null);
    if (isVoicing) stopVoicing();
    if (isDictating) stopDictation();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Audio analysis for real-time waveform bars
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateLevel = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animationFrameRef.current = requestAnimationFrame(updateLevel);
          };
          updateLevel();
        }
      } catch (err) {
        console.warn("Web Audio Analyser not initialized:", err);
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());

        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(() => {});
          audioContextRef.current = null;
        }
        setAudioLevel(0);
      };

      mediaRecorder.start();
      setIsRecordingMic(true);
      handleStart();
    } catch (err: any) {
      console.warn("Microphone access denied or unavailable:", err);
      setMicError("Microphone permission required for voice rehearsal. Check your browser settings.");
      setIsRecordingMic(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingMic(false);
  };

  const handleToggleMicRecord = () => {
    if (isRecordingMic) {
      stopRecording();
      handleStop();
    } else {
      startRecording();
    }
  };

  // --- Voice Dictation (Speech-to-Text) ---
  const isSpeechRecSupported = typeof window !== 'undefined' && 
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const startDictation = (field: 'hook' | 'solution' | 'ask') => {
    setMicError(null);
    if (isVoicing) stopVoicing();
    if (isRecordingMic) stopRecording();

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicError("Voice dictation is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      const activeVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
      recognition.lang = activeVoice?.lang || (selectedLanguage === 'all' ? 'en-US' : selectedLanguage);

      setDictatingField(field);
      setIsDictating(true);
      setInterimTranscript('');

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            interimChunk += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interimChunk);

        if (finalChunk) {
          const appended = finalChunk.trim();
          if (field === 'hook') {
            setHookText(prev => prev ? `${prev} ${appended}` : appended);
          } else if (field === 'solution') {
            setSolutionText(prev => prev ? `${prev} ${appended}` : appended);
          } else if (field === 'ask') {
            setAskText(prev => prev ? `${prev} ${appended}` : appended);
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn("Dictation error:", e);
        if (e.error === 'not-allowed') {
          setMicError("Microphone permission denied for voice dictation.");
        }
        setIsDictating(false);
        setDictatingField(null);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsDictating(false);
        setDictatingField(null);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn("Could not start speech recognition:", err);
      setMicError("Could not start speech recognition.");
      setIsDictating(false);
      setDictatingField(null);
    }
  };

  const stopDictation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsDictating(false);
    setDictatingField(null);
    setInterimTranscript('');
  };

  const playRecordedAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingRecorded) {
      audioPlayerRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  const downloadRecordedAudio = () => {
    if (!recordedAudioUrl) return;
    const a = document.createElement('a');
    a.href = recordedAudioUrl;
    a.download = `connectup-pitch-rehearsal-${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getActiveSection = () => {
    if (currentTime < 5) return 'hook';
    if (currentTime < 20) return 'solution';
    return 'ask';
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      const updatedScript: PitchScript = {
        hook: hookText,
        solution: solutionText,
        ask: askText,
      };
      setPitchScript(updatedScript);
      try {
        localStorage.setItem('connectup_pitch_script_v4', JSON.stringify(updatedScript));
      } catch (e) {
        console.error("Failed to save to localStorage", e);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleResetToDefaults = () => {
    setPitchScript(defaultPitchScript);
    setHookText(defaultPitchScript.hook);
    setSolutionText(defaultPitchScript.solution);
    setAskText(defaultPitchScript.ask);
    try {
      localStorage.removeItem('connectup_pitch_script_v4');
      localStorage.removeItem('connectup_pitch_formulas_v3');
    } catch {}
  };

  const currentSection = getActiveSection();
  const progressPercent = Math.min((currentTime / 30) * 100, 100);

  // Word count & Pace metrics
  const totalWords = useMemo(() => {
    const full = `${hookText} ${solutionText} ${askText}`;
    return full.trim().split(/\s+/).filter(Boolean).length;
  }, [hookText, solutionText, askText]);

  const recommendedWpm = Math.round((totalWords / 30) * 60);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-7 shadow-xs border border-zinc-200/70 dark:border-zinc-800 flex flex-col h-full transition-colors duration-200">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white leading-tight">
                Pitch Studio
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                Voice Enabled
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              30-second teleprompter & Google voice narration
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Read-Aloud Button */}
          <button
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
            {isVoicing ? (
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

          {/* Quick Voice Language Button */}
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-2xs"
            title="Switch voice language & settings"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span>{currentLangConfig.flag} {currentLangConfig.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {/* Voice Settings Dropdown */}
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className={cn(
              "p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center border shadow-2xs",
              showVoiceSettings
                ? "bg-amber-400 text-zinc-950 border-amber-400"
                : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            )}
            title="Configure voice persona, language & narration pace"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Edit / Customize Script Button */}
          {isEditing && (
            <button
              onClick={handleResetToDefaults}
              className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Reset to default script"
            >
              <Undo2 className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
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
            {isEditing ? (
              <span>Save</span>
            ) : (
              <span>Customize</span>
            )}
          </button>
        </div>
      </div>

      {/* Voice Configuration Drawer (Language, Pace & Voice Persona) */}
      <AnimatePresence>
        {showVoiceSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-amber-500" />
                    Google Voice Narration Settings
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[9px] font-black uppercase tracking-wider border border-amber-400/30">
                    Google Voice Persona Only
                  </span>
                </div>
                <button
                  onClick={() => setShowVoiceSettings(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  Close
                </button>
              </div>

              {/* Language Selection: Quick Pills & Full Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-amber-500" />
                    Google Voice Language
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    {filteredVoices.length} Google {filteredVoices.length === 1 ? 'persona' : 'personas'} available
                  </span>
                </div>

                {/* Quick Language Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {SUPPORTED_LANGUAGES.slice(0, 8).map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                          "px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center gap-1",
                          isSelected
                            ? "bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow-2xs"
                            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('all')}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center gap-1",
                      selectedLanguage === 'all'
                        ? "bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow-2xs"
                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    <span>🌐</span>
                    <span>All Google Personas</span>
                  </button>
                </div>

                {/* Extended Language Select */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name} — {lang.nativeName} ({lang.code.toUpperCase()})
                    </option>
                  ))}
                  <option value="all">🌐 All Available Google Voice Personas</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
                {/* Voice Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400">
                      Google Voice Persona ({filteredVoices.length})
                    </label>
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                      Google Only
                    </span>
                  </div>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400"
                  >
                    {filteredVoices.length > 0 ? (
                      filteredVoices.map((v) => {
                        const displayName = v.name.toLowerCase().includes('google')
                          ? v.name
                          : `Google Voice Persona — ${v.name}`;
                        return (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {displayName} ({v.lang})
                          </option>
                        );
                      })
                    ) : availableVoices.length > 0 ? (
                      availableVoices.map((v) => {
                        const displayName = v.name.toLowerCase().includes('google')
                          ? v.name
                          : `Google Voice Persona — ${v.name}`;
                        return (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {displayName} ({v.lang})
                          </option>
                        );
                      })
                    ) : (
                      <option value="">Google Voice Persona (Default)</option>
                    )}
                  </select>
                </div>

                {/* Pace Selection */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Narration Pace: {speechRate.toFixed(2)}x
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[0.9, 1.0, 1.1, 1.25].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setSpeechRate(rate)}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer",
                          speechRate === rate
                            ? "bg-amber-400 text-zinc-950 border-amber-400 shadow-2xs font-extrabold"
                            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                        )}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Script in Selected Language Action */}
              {currentLangConfig.sampleScript && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/40">
                  <div className="text-[11px] text-amber-900 dark:text-amber-200">
                    <span className="font-bold">Test {currentLangConfig.nativeName} voice:</span> Load startup pitch example in {currentLangConfig.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLoadLanguageScript(selectedLanguage)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-400 text-zinc-950 hover:bg-amber-300 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Load {currentLangConfig.nativeName} Pitch</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic Permission / Voice Warning */}
      {micError && (
        <div className="mb-4 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between animate-in fade-in">
          <span>{micError}</span>
          <button onClick={() => setMicError(null)} className="text-amber-900 dark:text-amber-200 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Timer & Stage Timeline */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          {/* Clock Display */}
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
                {[0.3, 0.7, 1.0, 0.6, 0.4].map((scale, i) => {
                  return (
                    <motion.div
                      key={i}
                      animate={{ height: [6, 20 * scale, 8, 18 * scale] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 rounded-full bg-amber-400"
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Current Active Stage Indicator */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
            <span className={cn(
              "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all shrink-0",
              currentSection === 'hook'
                ? "bg-amber-400 text-zinc-950 font-black shadow-2xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
            )}>
              1. Hook (0-5s)
            </span>
            <span className={cn(
              "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all shrink-0",
              currentSection === 'solution'
                ? "bg-amber-400 text-zinc-950 font-black shadow-2xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
            )}>
              2. Solution (5-20s)
            </span>
            <span className={cn(
              "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all shrink-0",
              currentSection === 'ask'
                ? "bg-amber-400 text-zinc-950 font-black shadow-2xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
            )}>
              3. Ask (20-30s)
            </span>
          </div>
        </div>

        {/* Progress Bar with Phase Segments */}
        <div className="relative w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-400 rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Phase tick lines */}
          <div className="absolute top-0 bottom-0 left-[16.6%] w-0.5 bg-zinc-300 dark:bg-zinc-700" title="Hook boundary (5s)" />
          <div className="absolute top-0 bottom-0 left-[66.6%] w-0.5 bg-zinc-300 dark:bg-zinc-700" title="Solution boundary (20s)" />
        </div>
      </div>

      {/* Teleprompter Script Area */}
      <div className="relative flex-1 min-h-[220px] rounded-2xl p-4 sm:p-5 bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800 flex flex-col justify-center overflow-hidden mb-4">
        {/* Subtle scanline animation during playback */}
        {isPlaying && (
          <motion.div 
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-16 bg-amber-400/5 blur-xl pointer-events-none"
          />
        )}

        {isEditing ? (
          <div className="w-full space-y-3 relative z-10 overflow-y-auto max-h-[260px] pr-1">
            {/* Hook Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-amber-500">
                  Phase 1: The Hook (0-5s) · Target ~15 words
                </span>
                {isSpeechRecSupported && (
                  <button
                    onClick={() => dictatingField === 'hook' ? stopDictation() : startDictation('hook')}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer",
                      dictatingField === 'hook'
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-amber-400 hover:text-zinc-950"
                    )}
                    title="Dictate hook using voice"
                  >
                    <Mic className="w-2.5 h-2.5" />
                    <span>{dictatingField === 'hook' ? 'Listening...' : 'Voice Input'}</span>
                  </button>
                )}
              </div>
              <textarea
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                rows={2}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-950 dark:text-white outline-none focus:border-amber-400 resize-none font-sans"
              />
            </div>

            {/* Solution Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-amber-500">
                  Phase 2: The Solution (5-20s) · Target ~35 words
                </span>
                {isSpeechRecSupported && (
                  <button
                    onClick={() => dictatingField === 'solution' ? stopDictation() : startDictation('solution')}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer",
                      dictatingField === 'solution'
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-amber-400 hover:text-zinc-950"
                    )}
                    title="Dictate solution using voice"
                  >
                    <Mic className="w-2.5 h-2.5" />
                    <span>{dictatingField === 'solution' ? 'Listening...' : 'Voice Input'}</span>
                  </button>
                )}
              </div>
              <textarea
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                rows={2}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-950 dark:text-white outline-none focus:border-amber-400 resize-none font-sans"
              />
            </div>

            {/* Ask Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-amber-500">
                  Phase 3: The Ask & Traction (20-30s) · Target ~20 words
                </span>
                {isSpeechRecSupported && (
                  <button
                    onClick={() => dictatingField === 'ask' ? stopDictation() : startDictation('ask')}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer",
                      dictatingField === 'ask'
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-amber-400 hover:text-zinc-950"
                    )}
                    title="Dictate ask using voice"
                  >
                    <Mic className="w-2.5 h-2.5" />
                    <span>{dictatingField === 'ask' ? 'Listening...' : 'Voice Input'}</span>
                  </button>
                )}
              </div>
              <textarea
                value={askText}
                onChange={(e) => setAskText(e.target.value)}
                rows={2}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-950 dark:text-white outline-none focus:border-amber-400 resize-none font-sans"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 relative z-10 w-full transition-all duration-300">
            {/* Hook */}
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300 border-l-2",
              currentSection === 'hook'
                ? "bg-white dark:bg-zinc-900/90 border-amber-400 shadow-2xs"
                : "border-transparent opacity-40 hover:opacity-75"
            )}>
              <span className="text-[9px] uppercase font-bold text-amber-500 font-mono block mb-0.5">
                1. Hook (0-5s)
              </span>
              <p className={cn(
                "text-sm sm:text-base font-medium leading-relaxed transition-colors",
                currentSection === 'hook'
                  ? "text-zinc-950 dark:text-white font-semibold"
                  : "text-zinc-500 dark:text-zinc-400"
              )}>
                {hookText}
              </p>
            </div>

            {/* Solution */}
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300 border-l-2",
              currentSection === 'solution'
                ? "bg-white dark:bg-zinc-900/90 border-amber-400 shadow-2xs"
                : "border-transparent opacity-40 hover:opacity-75"
            )}>
              <span className="text-[9px] uppercase font-bold text-amber-500 font-mono block mb-0.5">
                2. Solution (5-20s)
              </span>
              <p className={cn(
                "text-sm sm:text-base font-medium leading-relaxed transition-colors",
                currentSection === 'solution'
                  ? "text-zinc-950 dark:text-white font-semibold"
                  : "text-zinc-500 dark:text-zinc-400"
              )}>
                {solutionText}
              </p>
            </div>

            {/* Ask */}
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300 border-l-2",
              currentSection === 'ask'
                ? "bg-white dark:bg-zinc-900/90 border-amber-400 shadow-2xs"
                : "border-transparent opacity-40 hover:opacity-75"
            )}>
              <span className="text-[9px] uppercase font-bold text-amber-500 font-mono block mb-0.5">
                3. The Ask (20-30s)
              </span>
              <p className={cn(
                "text-sm sm:text-base font-medium leading-relaxed transition-colors",
                currentSection === 'ask'
                  ? "text-zinc-950 dark:text-white font-semibold"
                  : "text-zinc-500 dark:text-zinc-400"
              )}>
                {askText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls & Pacing Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={handleStart}
              disabled={isEditing}
              className="h-10 px-5 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-850 text-white dark:text-zinc-950 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-40 shadow-xs flex items-center gap-2"
            >
              <IconWrapper icon={PlayIcon} size={13} className="text-amber-400 dark:text-amber-500" />
              <span>{currentTime > 0 ? "Resume" : "Start Pitch"}</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="h-10 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs flex items-center gap-2"
            >
              <IconWrapper icon={StopIcon} size={13} />
              <span>Pause</span>
            </button>
          )}

          {(currentTime > 0 || isPlaying) && (
            <button
              onClick={handleReset}
              className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
              title="Reset Timer"
            >
              <IconWrapper icon={RotateLeft01Icon} size={16} />
            </button>
          )}
        </div>

        {/* Pacing Coach Hint */}
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

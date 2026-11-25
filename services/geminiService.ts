import { supabase } from './supabaseClient';

const getAuthHeaders = async (forceRefresh = false): Promise<Record<string, string>> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    if (forceRefresh) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      const refreshedToken = refreshed?.session?.access_token;
      if (refreshedToken) {
        headers['Authorization'] = `Bearer ${refreshedToken}`;
        return headers;
      }
    }

    const { data } = await supabase.auth.getSession();
    let session = data?.session;
    const expiresAtSec = session?.expires_at ?? 0;
    const nowSec = Math.floor(Date.now() / 1000);
    if (session && expiresAtSec > 0 && expiresAtSec - nowSec < 60) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (refreshed?.session) {
        session = refreshed.session;
      }
    }

    const token = session?.access_token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Ignore session lookup errors
  }
  return headers;
};

export const analyzePitchDeck = async (pitchText: string): Promise<string> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/gemini/analyze-pitch', {
      method: 'POST',
      headers,
      body: JSON.stringify({ pitchText })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }
    const data = await response.json();
    return data.text || "Analysis complete.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "Error generating analysis. Make sure you are signed in and GEMINI_API_KEY is configured on the server.";
  }
};

export const performMarketResearch = async (query: string): Promise<{ text: string; sources: { title: string; uri: string }[] }> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch('/api/gemini/market-research', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }
    const data = await response.json();
    return { text: data.text || "No results found.", sources: data.sources || [] };
  } catch (error: any) {
    console.error("Gemini Search Error:", error);
    return { text: "Error performing research. Make sure you are signed in and GEMINI_API_KEY is configured on the server.", sources: [] };
  }
};

export type PitchVoiceName = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';
export type PitchVoiceTone = 'conversational' | 'warm' | 'confident';

export const synthesizePitchSpeech = async (
  text: string,
  voiceName: PitchVoiceName = 'Zephyr',
  tone: PitchVoiceTone = 'conversational'
): Promise<{ audioBase64: string; mimeType: string }> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  const requestSpeech = async (forceRefresh = false) => {
    const headers = await getAuthHeaders(forceRefresh);
    return fetch('/api/gemini/tts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, voiceName, tone }),
      signal: controller.signal,
    });
  };

  try {
    let response = await requestSpeech(false);
    if (response.status === 401) {
      const refreshedHeaders = await getAuthHeaders(true);
      if (refreshedHeaders['Authorization']) {
        response = await fetch('/api/gemini/tts', {
          method: 'POST',
          headers: refreshedHeaders,
          body: JSON.stringify({ text, voiceName, tone }),
          signal: controller.signal,
        });
      }
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const err: any = new Error(errData.error || `Pitch Studio voice failed (${response.status})`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    if (!data?.audioBase64) {
      throw new Error('Empty audio payload returned from Pitch Studio voice engine');
    }
    return {
      audioBase64: data.audioBase64,
      mimeType: data.mimeType || 'audio/wav',
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      const timeoutErr: any = new Error('Pitch Studio voice took too long to respond. Please try again.');
      timeoutErr.status = 504;
      throw timeoutErr;
    }
    if (err?.name === 'TypeError') {
      const netErr: any = new Error('Unable to reach Pitch Studio voice server. Please check your connection.');
      netErr.status = 503;
      throw netErr;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};

import { supabase } from './supabaseClient';

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
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

export const synthesizePitchSpeech = async (
  text: string,
  voiceName: 'Kore' | 'Zephyr' | 'Puck' | 'Charon' | 'Fenrir' = 'Kore'
): Promise<{ audioBase64: string; mimeType: string }> => {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, voiceName }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const err: any = new Error(errData.error || `Voice synthesis failed (${response.status})`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    if (!data?.audioBase64) {
      throw new Error('Empty audio payload returned from server');
    }
    return {
      audioBase64: data.audioBase64,
      mimeType: data.mimeType || 'audio/wav',
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

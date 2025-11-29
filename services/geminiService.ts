import { GoogleGenAI, Modality } from "@google/genai";

export class GeminiService {

  public reloadClient() {
    // Client is now initialized per request
  }

  public async generateWebsiteVideo(
    url: string,
    aspectRatio: '16:9' | '9:16',
    scrapedSummary: string
  ): Promise<string> {
    if (!process.env.API_KEY) {
      throw new Error("API Key not available. Please connect your API key first.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const resolution = aspectRatio === '16:9' ? '1080p' : '720p';

    const prompt = `A professional, high-quality video advertisement for a website. 
    The website is: ${url}. 
    Visual style: ${scrapedSummary}. 
    The video should feature smooth scrolling animations of a modern web interface, 
    glassmorphism UI elements, and dynamic transitions. 
    Cinematic lighting, 4k render quality. 
    Show a cursor interacting with buttons. 
    The overall vibe should be tech-forward and clean.`;

    console.log("Starting Veo generation with prompt:", prompt);

    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (operation.error) {
         throw new Error(`Generation failed: ${operation.error.message}`);
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) {
        throw new Error("The AI service completed but returned no video.");
      }

      const downloadUrl = `${videoUri}&key=${process.env.API_KEY}`;
      const videoResponse = await fetch(downloadUrl);

      if (!videoResponse.ok) {
         throw new Error(`Failed to download video: ${videoResponse.statusText}`);
      }
      
      const videoBlob = await videoResponse.blob();
      return URL.createObjectURL(videoBlob);

    } catch (error: any) {
      this.handleError(error);
      return ""; // Unreachable due to throw
    }
  }

  public async generateScript(url: string, theme: string, language: string): Promise<string> {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Write a short, engaging voiceover script (approx 15-20 seconds spoken) for a video preview of this website: ${url}. 
    The visual theme is: ${theme}.
    
    CRITICAL: The script must be written purely in ${language}. 
    If the website concept is in English, translate the marketing message to ${language}.
    
    Do not include any scene directions, camera instructions, or labels like "Narrator:". 
    Just output the raw spoken text. 
    Keep it professional, energetic, and focused on the value proposition.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Welcome to our website. Discover amazing features and explore what we have to offer.";
  }

  public async generateSpeech(text: string, voiceName: string): Promise<string> {
    if (!process.env.API_KEY) throw new Error("API Key missing");
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("No audio data returned");
      }

      // Convert Base64 -> raw PCM bytes
      const pcmBytes = this.base64ToUint8Array(base64Audio);

      // Convert PCM -> WAV Blob
      // The model returns raw PCM (typically 24kHz, 1 channel, 16-bit)
      const wavBlob = this.pcmToWav(pcmBytes, 24000);

      return URL.createObjectURL(wavBlob);

    } catch (error: any) {
      console.error("TTS Error:", error);
      // Fail gracefully for audio
      return "";
    }
  }

  private handleError(error: any) {
    console.error("Gemini Service Error:", error);
    let friendlyMessage = "An unexpected error occurred.";
    const rawMsg = error.message || error.toString();

    if (rawMsg.includes("403") || rawMsg.includes("API key") || rawMsg.includes("PERMISSION_DENIED")) {
      friendlyMessage = "Authentication failed. Please reconnect your API Key.";
    } else if (rawMsg.includes("429") || rawMsg.includes("Resource has been exhausted")) {
      friendlyMessage = "Service is busy (Quota Exceeded). Please try again in a minute.";
    } else if (rawMsg.includes("Requested entity was not found")) {
      friendlyMessage = "Session expired. Please reconnect your API Key to proceed.";
    } else if (rawMsg.includes("SAFETY") || rawMsg.includes("blocked")) {
      friendlyMessage = "Generation blocked by safety settings. Try a different website URL.";
    } else if (rawMsg.includes("500") || rawMsg.includes("Internal")) {
      friendlyMessage = "The video service is experiencing temporary issues. Please try again later.";
    } else if (rawMsg.includes("Failed to fetch") || rawMsg.includes("Network")) {
      friendlyMessage = "Network connection issue. Please check your internet.";
    }

    throw new Error(friendlyMessage);
  }

  // --- Audio Helpers ---

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private pcmToWav(pcmData: Uint8Array, sampleRate: number): Blob {
    // 16-bit mono
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = pcmData.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, byteRate, true); // ByteRate
    view.setUint16(32, blockAlign, true); // BlockAlign
    view.setUint16(34, bitsPerSample, true); // BitsPerSample

    // data sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write PCM data
    const pcmView = new Uint8Array(buffer, 44);
    pcmView.set(pcmData);

    return new Blob([buffer], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

export const geminiService = new GeminiService();

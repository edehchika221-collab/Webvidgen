import React, { useState, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { GeneratedVideo, VideoStatus, VoiceOption, LanguageOption } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ConfigPanel } from './components/ConfigPanel';
import { PromptEditor } from './components/PromptEditor';
import { ResultSection } from './components/ResultSection';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  // UI State
  const [darkMode, setDarkMode] = useState(true);
  const [isApiKeyReady, setIsApiKeyReady] = useState(false);

  // Generation State
  const [urlInput, setUrlInput] = useState('');
  const [status, setStatus] = useState<VideoStatus>(VideoStatus.IDLE);
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedVideo[]>([]);

  // Config State
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [enableVoiceover, setEnableVoiceover] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>('Kore');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>('English');

  // Prompt Editor State
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [tempVideoId, setTempVideoId] = useState<string | null>(null);

  const isProcessing = status === VideoStatus.ANALYZING || status === VideoStatus.GENERATING;

  // --- Effects ---
  useEffect(() => {
    checkApiKey();
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      const savedHistory = localStorage.getItem('webvidgen_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, [darkMode]);

  // --- API Key Handling ---
  const checkApiKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsApiKeyReady(hasKey);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setIsApiKeyReady(true);
      geminiService.reloadClient();
    }
  };

  // --- History Management ---
  const saveToHistory = (newVideo: GeneratedVideo) => {
    setHistory(prev => {
      const updated = [newVideo, ...prev];
      const storagePayload = updated.map(v => ({
        ...v,
        videoUrl: null,
        audioUrl: null
      }));
      localStorage.setItem('webvidgen_history', JSON.stringify(storagePayload));
      return updated;
    });
  };

  const handleDeleteVideo = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(v => v.id !== id);
      const storagePayload = updated.map(v => ({ ...v, videoUrl: null, audioUrl: null }));
      localStorage.setItem('webvidgen_history', JSON.stringify(storagePayload));
      return updated;
    });

    if (currentVideo?.id === id) {
      setCurrentVideo(null);
      setStatus(VideoStatus.IDLE);
    }
  };

  const handlePlayVideo = (video: GeneratedVideo) => {
    setCurrentVideo(video);
    setStatus(VideoStatus.COMPLETED);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Generation Flow ---
  const handleAnalyze = async () => {
    setErrorMsg(null);
    setStatus(VideoStatus.IDLE);

    if (!urlInput.trim()) {
      setErrorMsg("Please enter a website URL.");
      setStatus(VideoStatus.FAILED);
      return;
    }

    if (!isApiKeyReady) {
      await handleSelectKey();
      return;
    }

    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Basic Validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (!urlPattern.test(formattedUrl)) {
      setErrorMsg("Invalid URL format.");
      setStatus(VideoStatus.FAILED);
      return;
    }

    setStatus(VideoStatus.ANALYZING);

    // Create temp video object
    const tempId = Date.now().toString();
    setTempVideoId(tempId);

    const tempVideo: GeneratedVideo = {
      id: tempId,
      url: formattedUrl,
      videoUrl: null,
      timestamp: Date.now(),
      status: VideoStatus.ANALYZING,
      aspectRatio,
      promptUsed: ''
    };
    setCurrentVideo(tempVideo);

    try {
      // Simulate Analysis
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate initial prompt based on URL keywords
      let theme = "Modern SaaS Technology, Blue and White Color Scheme, Professional, Clean UI";
      if (formattedUrl.includes('food') || formattedUrl.includes('restaurant')) theme = "Delicious Food, Warm Colors, Restaurant Vibe, Cinematic Food Shots";
      if (formattedUrl.includes('fashion') || formattedUrl.includes('shop')) theme = "Trendy Fashion, High Contrast, E-commerce Layout, Dynamic Transitions";
      if (formattedUrl.includes('portfolio') || formattedUrl.includes('design')) theme = "Creative Design Portfolio, Minimalist, Black and White, Smooth Scrolling";
      if (formattedUrl.includes('news') || formattedUrl.includes('blog')) theme = "News Portal, Text Heavy, Clean Typography, Information Dense";

      setGeneratedPrompt(theme);
      setShowPromptEditor(true);
      // We pause here. Status technically stays ANALYZING or we can switch to a 'REVIEW' internal state.
      // But visually we just show the modal.

    } catch (err: any) {
      console.error(err);
      setStatus(VideoStatus.FAILED);
      setErrorMsg(err.message || "Failed to analyze website.");
    }
  };

  const handleConfirmGenerate = async () => {
    setShowPromptEditor(false);
    setStatus(VideoStatus.GENERATING);

    if (!currentVideo || !tempVideoId) return;

    try {
      // --- PARALLEL GENERATION ---
      const videoPromise = geminiService.generateWebsiteVideo(currentVideo.url, aspectRatio, generatedPrompt);

      let audioPromise: Promise<string> = Promise.resolve("");
      let scriptPromise: Promise<string> = Promise.resolve("");

      if (enableVoiceover) {
        audioPromise = geminiService.generateScript(currentVideo.url, generatedPrompt, selectedLanguage)
          .then(script => {
            scriptPromise = Promise.resolve(script);
            return geminiService.generateSpeech(script, selectedVoice);
          });
      }

      const [videoUrl, audioUrl] = await Promise.all([videoPromise, audioPromise]);
      const script = enableVoiceover ? await scriptPromise : undefined;
      // ---------------------------

      const completedVideo: GeneratedVideo = {
        ...currentVideo,
        videoUrl,
        audioUrl: audioUrl || null,
        script: script,
        status: VideoStatus.COMPLETED,
        promptUsed: generatedPrompt,
        duration: enableVoiceover ? 20 : 6
      };

      setStatus(VideoStatus.COMPLETED);
      setCurrentVideo(completedVideo);
      saveToHistory(completedVideo);

    } catch (err: any) {
      console.error(err);
      setStatus(VideoStatus.FAILED);
      setErrorMsg(err.message || "Failed to generate video.");
    }
  };

  const handleReset = () => {
    setStatus(VideoStatus.IDLE);
    setCurrentVideo(null);
    setTempVideoId(null);
    setErrorMsg(null);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isApiKeyReady={isApiKeyReady}
        onConnectKey={handleSelectKey}
        onReset={handleReset}
      />

      <main className="flex-grow flex flex-col items-center pt-12 px-4 pb-12 w-full max-w-7xl mx-auto">

        {/* Hero & Config - Only show when not viewing a result (or when analyzing) */}
        {(status === VideoStatus.IDLE || status === VideoStatus.ANALYZING || status === VideoStatus.FAILED) && !currentVideo?.videoUrl && (
          <Hero
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            handleGenerate={handleAnalyze}
            isProcessing={isProcessing}
            isApiKeyReady={isApiKeyReady}
          >
            <ConfigPanel
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              enableVoiceover={enableVoiceover}
              setEnableVoiceover={setEnableVoiceover}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              isProcessing={isProcessing}
            />
          </Hero>
        )}

        {/* Result Section (includes Processing, Completed, Failed states) */}
        <ResultSection
          status={status}
          video={currentVideo}
          errorMsg={errorMsg}
          onReset={handleReset}
          onRetry={handleAnalyze}
          onReconnectKey={handleSelectKey}
          historyLength={history.length}
        />

        {/* Dashboard / History - Only show when idle */}
        {status === VideoStatus.IDLE && (
          <Dashboard
            videos={history}
            onDelete={handleDeleteVideo}
            onPlay={handlePlayVideo}
          />
        )}
      </main>

      <Footer />

      <PromptEditor
        isOpen={showPromptEditor}
        prompt={generatedPrompt}
        onPromptChange={setGeneratedPrompt}
        onConfirm={handleConfirmGenerate}
        onCancel={() => { setShowPromptEditor(false); setStatus(VideoStatus.IDLE); }}
        isGenerating={status === VideoStatus.GENERATING}
      />
    </div>
  );
};

export default App;
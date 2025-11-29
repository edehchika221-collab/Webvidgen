import React from 'react';
import { Check, AlertCircle, Mic, Download, RefreshCw, Layout, Layers, Video as VideoIcon } from 'lucide-react';
import { VideoStatus, GeneratedVideo } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { LoadingTerminal } from './LoadingTerminal';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ResultSectionProps {
    status: VideoStatus;
    video: GeneratedVideo | null;
    errorMsg: string | null;
    onReset: () => void;
    onRetry: () => void;
    onReconnectKey: () => void;
    historyLength: number;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
    status,
    video,
    errorMsg,
    onReset,
    onRetry,
    onReconnectKey,
    historyLength
}) => {
    const isProcessing = status === VideoStatus.ANALYZING || status === VideoStatus.GENERATING;

    const handleDownload = () => {
        if (video?.videoUrl) {
            const a = document.createElement('a');
            a.href = video.videoUrl;
            a.download = `webvidgen-${video.id}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    // Idle State with Feature Cards
    if (status === VideoStatus.IDLE && historyLength === 0 && !errorMsg) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in-up delay-200">
                <FeatureCard
                    icon={<Layout className="text-pink-500" />}
                    title="Smart Capture"
                    desc="Automatically simulates scrolling and captures key sections."
                />
                <FeatureCard
                    icon={<Layers className="text-purple-500" />}
                    title="Brand Colors"
                    desc="Extracts palette and applies it to the video theme."
                />
                <FeatureCard
                    icon={<VideoIcon className="text-indigo-500" />}
                    title="HD Export"
                    desc="Get a 1080p MP4 ready for YouTube or Instagram."
                />
            </div>
        );
    }

    // Processing State
    if (isProcessing) {
        return (
            <div className="animate-fade-in mt-12 w-full max-w-4xl mx-auto">
                <LoadingTerminal
                    url={video?.url || ''}
                    step={status === VideoStatus.ANALYZING ? 'analyzing' : 'generating'}
                />
                <p className="text-center mt-6 text-slate-500 dark:text-slate-400 animate-pulse font-medium">
                    {status === VideoStatus.GENERATING
                        ? "Creating video frames... This takes about 30-60 seconds."
                        : "Analyzing website structure..."}
                </p>
            </div>
        );
    }

    // Completed State
    if (status === VideoStatus.COMPLETED && video) {
        return (
            <div className="animate-scale-in w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="mb-4"
                    >
                        Generate Another
                    </Button>

                    <h3 className="text-2xl font-bold flex items-center justify-center gap-3 text-slate-900 dark:text-white">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm">
                            <Check size={16} />
                        </span>
                        Video Generated!
                    </h3>
                </div>

                <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black">
                    <VideoPlayer src={video.videoUrl} audioSrc={video.audioUrl} />
                </div>

                <div className="flex justify-center mt-6 gap-4">
                    <Button
                        onClick={handleDownload}
                        variant="primary"
                        icon={<Download size={18} />}
                    >
                        Download Video
                    </Button>
                </div>

                {video.script && (
                    <Card className="mt-8 max-w-2xl mx-auto p-6" glass>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Mic size={14} /> AI Script
                            </h4>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-lg">
                            "{video.script}"
                        </p>
                    </Card>
                )}
            </div>
        );
    }

    // Failed State
    if (status === VideoStatus.FAILED) {
        return (
            <div className="w-full max-w-lg mx-auto mt-8 animate-fade-in">
                <Card className="p-8 text-center border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <AlertCircle className="text-red-500" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Unable to Generate Video</h3>
                    <p className="text-red-600 dark:text-red-300 mb-8 px-4 leading-relaxed">{errorMsg}</p>

                    <div className="flex gap-3 justify-center">
                        {(errorMsg?.includes('API Key') || errorMsg?.includes('Session expired') || errorMsg?.includes('Authentication failed')) && (
                            <Button onClick={onReconnectKey} variant="secondary">
                                Reconnect API Key
                            </Button>
                        )}
                        <Button
                            onClick={onRetry}
                            variant="danger"
                            icon={<RefreshCw size={16} />}
                        >
                            Try Again
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return null;
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <Card className="p-6 hover:transform hover:-translate-y-1 transition-all duration-300" glass hover>
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </Card>
);

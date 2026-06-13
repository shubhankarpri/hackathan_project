import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { analyzeJournal } from "../services/gemini";
import type { AnalysisResult } from "../services/gemini";
import type { JournalEntry } from "../types";
import {
    Sparkles,
    Loader2,
    CheckCircle2,
    ArrowRight,
    Brain,
    Zap,
    TrendingUp,
    ShieldCheck
} from "lucide-react";

export const Journal = () => {
    const navigate = useNavigate();
    const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>("journal-entries", []);
    const [text, setText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!text.trim()) return;

        setIsAnalyzing(true);
        setAnalysis(null);
        setError(null);
        try {
            const result = await analyzeJournal(text);
            setAnalysis(result);

            const newEntry: JournalEntry = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                text,
                analysis: result,
            };

            setJournalEntries([newEntry, ...journalEntries]);
        } catch (err: any) {
            console.error(err);
            setError("Analysis failed. Please try again or check your internet connection.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Safe Space Journal</h1>
                <p className="text-muted-foreground text-lg italic">
                    "What happened today? Let your thoughts flow freely. No judgments here."
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Input area */}
                <section className="glass-card p-8 space-y-6">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="I studied for 8 hours but I still feel anxious about my mock test..."
                        className="w-full h-80 bg-background/50 border-2 border-border/50 rounded-2xl p-6 text-lg focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
                    />

                    <div className="flex gap-4">
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !text.trim()}
                            className={`
                flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all
                ${!text.trim() || isAnalyzing
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"}
              `}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Gemini is thinking...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Analyze Journal
                                </>
                            )}
                        </button>
                    </div>
                </section>

                {/* Results area */}
                <section className="space-y-6 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!analysis && !isAnalyzing ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center p-10 text-center space-y-4"
                            >
                                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <Brain size={40} />
                                </div>
                                <h3 className="text-xl font-bold">Awaiting your thoughts</h3>
                                <p className="text-muted-foreground">
                                    Our AI Wellness Coach will analyze your journal to provide personalized emotional insights.
                                </p>
                                {error && (
                                    <div className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 flex items-center gap-2">
                                        <Zap size={16} />
                                        {error}
                                    </div>
                                )}
                            </motion.div>
                        ) : isAnalyzing ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-card p-10 flex flex-col items-center justify-center space-y-6 text-center"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Sparkles className="text-primary animate-bounce" size={40} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Analyzing Emotions...</h3>
                                    <p className="text-muted-foreground">Identifying stress levels, triggers, and focus areas.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {analysis && (
                                    <>
                                        {/* Emotional Summary Card */}
                                        <div className="glass-card p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                                    <Sparkles className="text-primary" />
                                                    AI Insights
                                                </h3>
                                                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                                                    {analysis.burnoutRisk} Burnout Risk
                                                </div>
                                            </div>
                                            <p className="text-lg leading-relaxed mb-6 font-medium">
                                                {analysis.emotionalSummary}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-xl bg-background shadow-inner">
                                                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Stress Level</div>
                                                    <div className="text-2xl font-bold text-red-500">{analysis.stressLevel}/10</div>
                                                </div>
                                                <div className="p-4 rounded-xl bg-background shadow-inner">
                                                    <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Motivation</div>
                                                    <div className="text-2xl font-bold text-green-500">{analysis.motivationLevel}/10</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Triggers & Observations */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="glass-card p-6 bg-green-500/5">
                                                <h4 className="font-bold flex items-center gap-2 text-green-600 mb-3">
                                                    <CheckCircle2 size={18} />
                                                    Positives
                                                </h4>
                                                <ul className="space-y-2">
                                                    {analysis.positiveObservations.map((obs: string, i: number) => (
                                                        <li key={i} className="text-sm border-l-2 border-green-500 pl-3 py-1">{obs}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="glass-card p-6 bg-orange-500/5">
                                                <h4 className="font-bold flex items-center gap-2 text-orange-600 mb-3">
                                                    <Zap size={18} />
                                                    Stress Triggers
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.triggers.map((trigger: string, i: number) => (
                                                        <span key={i} className="px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 font-medium text-xs">
                                                            {trigger}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Advice Card */}
                                        <div className="glass-card p-6 bg-primary/10 border-primary/30">
                                            <h4 className="font-bold flex items-center gap-2 text-primary mb-3">
                                                <TrendingUp size={18} />
                                                Coach's Advice
                                            </h4>
                                            <p className="text-sm leading-relaxed">
                                                {analysis.personalizedAdvice}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => navigate("/dashboard")}
                                            className="w-full py-4 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all"
                                        >
                                            View Overall Progress
                                            <ArrowRight size={20} />
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            <div className="flex items-center justify-center gap-8 py-4 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <ShieldCheck size={16} />
                    Private Analysis
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Sparkles size={16} />
                    Powered by Gemini 1.5
                </div>
            </div>
        </div>
    );
};

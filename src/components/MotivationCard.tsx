import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Quote, Share2, RefreshCw } from "lucide-react";
import { getDailyMotivation } from "../services/gemini";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { MoodLog } from "../utils/wellness";

export const MotivationCard = () => {
    const [moodLogs] = useLocalStorage<MoodLog[]>("mood-logs", []);
    const [motivation, setMotivation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchMotivation = async () => {
        setIsLoading(true);
        const mood = moodLogs.length > 0 ? moodLogs[0].mood : "focused";
        try {
            const text = await getDailyMotivation(mood);
            setMotivation(text);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMotivation();
    }, []);

    return (
        <div className="glass-card p-8 bg-gradient-to-br from-indigo-500/10 to-primary/10 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-2 right-2 flex gap-2">
                <button
                    onClick={fetchMotivation}
                    disabled={isLoading}
                    className="p-2 rounded-lg hover:bg-primary/20 transition-colors text-primary"
                >
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                </button>
                <button className="p-2 rounded-lg hover:bg-primary/20 transition-colors text-primary">
                    <Share2 size={18} />
                </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
                <div className="p-3 rounded-full bg-primary/20 text-primary">
                    <Sparkles size={24} />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={motivation}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-4"
                    >
                        <Quote className="mx-auto text-primary/30" size={40} />
                        <p className="text-2xl font-bold tracking-tight leading-snug">
                            {isLoading ? "Generating your personlized spark..." : motivation}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary/50">
                    Personalized for your journey
                </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>
    );
};

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, Pause, RotateCcw, Heart } from "lucide-react";

const BreathingExercise = () => {
    const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Reset">("Reset");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer: any;
        if (isActive) {
            if (phase === "Reset") setPhase("Inhale");

            const timings = {
                Inhale: 4000,
                Hold: 4000,
                Exhale: 6000
            };

            timer = setTimeout(() => {
                if (phase === "Inhale") setPhase("Hold");
                else if (phase === "Hold") setPhase("Exhale");
                else if (phase === "Exhale") setPhase("Inhale");
            }, timings[phase as keyof typeof timings]);
        }
        return () => clearTimeout(timer);
    }, [phase, isActive]);

    return (
        <div className="glass-card p-10 flex flex-col items-center text-center space-y-10">
            <div className="space-y-2">
                <h3 className="text-3xl font-bold">4-4-6 Breathing</h3>
                <p className="text-muted-foreground italic">Relieve exam anxiety and center your focus.</p>
            </div>

            <div className="relative flex items-center justify-center w-64 h-64">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        className={`absolute rounded-full bg-primary/20 flex items-center justify-center`}
                        initial={{ scale: phase === "Inhale" ? 0.5 : 1.2 }}
                        animate={{
                            scale: phase === "Inhale" ? 1.5 : (phase === "Hold" ? 1.5 : 0.8),
                            opacity: isActive ? 1 : 0.5
                        }}
                        transition={{
                            duration: phase === "Inhale" ? 4 : (phase === "Hold" ? 4 : 6),
                            ease: "easeInOut"
                        }}
                    >
                        <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-2xl shadow-primary/40">
                            {isActive ? phase : "Ready?"}
                        </div>
                    </motion.div>
                </AnimatePresence>
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping"></div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${isActive ? "bg-accent text-white" : "bg-primary text-white"}`}
                >
                    {isActive ? <Pause size={20} /> : <Play size={20} />}
                    {isActive ? "Pause" : "Start Exercise"}
                </button>
                <button
                    onClick={() => { setIsActive(false); setPhase("Reset"); }}
                    className="p-3 rounded-2xl glass border-primary/20 text-primary hover:bg-primary/10 transition-all"
                >
                    <RotateCcw size={24} />
                </button>
            </div>
        </div>
    );
};

export const Mindfulness = () => {
    return (
        <div className="max-w-4xl mx-auto py-10 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Mindfulness Sanctuary</h1>
                <p className="text-muted-foreground text-lg">Science-backed exercises to reset your brain and recover from deep study sessions.</p>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <BreathingExercise />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="glass-card p-8 space-y-6 bg-purple-500/5">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-600">
                            <Brain size={32} />
                        </div>
                        <h3 className="text-2xl font-bold">Focus Reset</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Step away from your desk. Look at something 20 feet away for 20 seconds.
                            Gently acknowledge your progress without judging what's left to do.
                        </p>
                        <button className="text-purple-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Try Guide <Play size={16} />
                        </button>
                    </section>

                    <section className="glass-card p-8 space-y-6 bg-rose-500/5">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-600">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-2xl font-bold">Gratitude Quick-Check</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            List three things that went well today, no matter how small.
                            Examples: "I understood a hard concept", "I drank enough water", or "I took a nap".
                        </p>
                        <button className="text-rose-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            Start Check <Play size={16} />
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

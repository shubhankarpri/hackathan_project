import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Mood, MoodLog } from "../utils/wellness";
import {
    Smile,
    Meh,
    Frown,
    Battery,
    Target,
    Moon,
    BookOpen,
    ArrowRight,
    Sparkles
} from "lucide-react";

const moods: { label: Mood; icon: any; color: string }[] = [
    { label: "Excellent", icon: Smile, color: "text-green-500 bg-green-500/10" },
    { label: "Good", icon: Smile, color: "text-blue-500 bg-blue-500/10" },
    { label: "Okay", icon: Meh, color: "text-yellow-500 bg-yellow-500/10" },
    { label: "Stressed", icon: Frown, color: "text-orange-500 bg-orange-500/10" },
    { label: "Exhausted", icon: Frown, color: "text-red-500 bg-red-500/10" },
];

/**
 * Mood Check-in component for tracking daily wellness metrics (mood, sleep, study).
 */
export const MoodCheckin = () => {
    const navigate = useNavigate();
    const [moodLogs, setMoodLogs] = useLocalStorage<MoodLog[]>("mood-logs", []);

    const [selectedMood, setSelectedMood] = useState<Mood | "">("");
    const [studyHours, setStudyHours] = useState(6);
    const [sleepHours, setSleepHours] = useState(7);
    const [energyLevel, setEnergyLevel] = useState(7);
    const [focusLevel, setFocusLevel] = useState(7);

    const handleSubmit = () => {
        if (!selectedMood) return;

        const newLog: MoodLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            mood: selectedMood as Mood,
            studyHours,
            sleepHours,
            energyLevel,
            focusLevel,
        };

        setMoodLogs([newLog, ...moodLogs]);
        navigate("/journal");
    };

    return (
        <div className="max-w-4xl mx-auto py-10 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Daily Wellness Check-in</h1>
                <p className="text-muted-foreground text-lg">Take a moment to reflect on your day before continuing your journey.</p>
            </div>

            {/* Mood Selection */}
            <section className="glass-card p-10">
                <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                    <Smile className="text-primary" />
                    How are you feeling today?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {moods.map((m) => (
                        <button
                            key={m.label}
                            onClick={() => setSelectedMood(m.label)}
                            className={`
                flex flex-col items-center gap-4 p-6 rounded-3xl transition-all duration-300
                ${selectedMood === m.label
                                    ? `${m.color} border-2 border-primary scale-105 shadow-xl`
                                    : "bg-background hover:bg-accent border-2 border-transparent hover:scale-105"
                                }
              `}
                        >
                            <m.icon size={48} className={selectedMood === m.label ? m.color.split(" ")[0] : "text-muted-foreground"} />
                            <span className="font-bold text-sm tracking-wide uppercase">{m.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Metrics Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="glass-card p-8 space-y-8">
                    <div className="space-y-6">
                        <label className="flex items-center justify-between font-bold text-lg">
                            <div className="flex items-center gap-3">
                                <BookOpen className="text-blue-500" />
                                Study Hours
                            </div>
                            <span className="text-primary bg-primary/10 px-4 py-1 rounded-full">{studyHours}h</span>
                        </label>
                        <input
                            type="range" min="0" max="16" step="0.5"
                            value={studyHours} onChange={(e) => setStudyHours(parseFloat(e.target.value))}
                            className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-6">
                        <label className="flex items-center justify-between font-bold text-lg">
                            <div className="flex items-center gap-3">
                                <Moon className="text-purple-500" />
                                Sleep Last Night
                            </div>
                            <span className="text-primary bg-primary/10 px-4 py-1 rounded-full">{sleepHours}h</span>
                        </label>
                        <input
                            type="range" min="0" max="12" step="0.5"
                            value={sleepHours} onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                            className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </section>

                <section className="glass-card p-8 space-y-8">
                    <div className="space-y-6">
                        <label className="flex items-center justify-between font-bold text-lg">
                            <div className="flex items-center gap-3">
                                <Battery className="text-green-500" />
                                Energy Level
                            </div>
                            <span className="text-primary bg-primary/10 px-4 py-1 rounded-full">{energyLevel}/10</span>
                        </label>
                        <input
                            type="range" min="1" max="10"
                            aria-label="Energy Level slider"
                            value={energyLevel} onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                            className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="space-y-6">
                        <label className="flex items-center justify-between font-bold text-lg">
                            <div className="flex items-center gap-3">
                                <Target className="text-red-500" />
                                Focus Level
                            </div>
                            <span className="text-primary bg-primary/10 px-4 py-1 rounded-full">{focusLevel}/10</span>
                        </label>
                        <input
                            type="range" min="1" max="10"
                            aria-label="Focus Level slider"
                            value={focusLevel} onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                            className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </section>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!selectedMood}
                aria-label="Submit your wellness check-in"
                className={`
          w-full py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl transition-all
          ${selectedMood
                        ? "bg-primary text-primary-foreground shadow-primary/30"
                        : "bg-muted text-muted-foreground cursor-not-allowed"}
        `}
            >
                Continue to Journal
                <ArrowRight size={24} />
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Sparkles size={16} className="text-primary" />
                <span>Your data is stored securely on your device</span>
            </div>
        </div>
    );
};

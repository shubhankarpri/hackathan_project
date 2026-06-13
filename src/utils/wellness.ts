export type Mood = "Excellent" | "Good" | "Okay" | "Stressed" | "Exhausted";

export interface MoodLog {
    id: string;
    date: string;
    mood: Mood;
    studyHours: number;
    sleepHours: number;
    energyLevel: number; // 1-10
    focusLevel: number; // 1-10
}

export const getMoodScore = (mood: Mood): number => {
    switch (mood) {
        case "Excellent": return 100;
        case "Good": return 80;
        case "Okay": return 60;
        case "Stressed": return 40;
        case "Exhausted": return 20;
        default: return 50;
    }
};

export const calculateWellnessScore = (log: MoodLog): number => {
    const moodWeight = 0.4;
    const sleepWeight = 0.3;
    const energyWeight = 0.15;
    const focusWeight = 0.15;

    const moodScore = getMoodScore(log.mood);

    // Ideal sleep is 7-8 hours
    let sleepScore = 0;
    if (log.sleepHours >= 7 && log.sleepHours <= 9) sleepScore = 100;
    else if (log.sleepHours === 6 || log.sleepHours === 10) sleepScore = 80;
    else if (log.sleepHours === 5 || log.sleepHours === 11) sleepScore = 50;
    else sleepScore = 30;

    const energyScore = log.energyLevel * 10;
    const focusScore = log.focusLevel * 10;

    const total = (moodScore * moodWeight) + (sleepScore * sleepWeight) + (energyScore * energyWeight) + (focusScore * focusWeight);
    return Math.round(total);
};

export const getWellnessCategory = (score: number) => {
    if (score >= 85) return { label: "Excellent", color: "text-green-500" };
    if (score >= 70) return { label: "Good", color: "text-blue-500" };
    if (score >= 50) return { label: "Average", color: "text-yellow-500" };
    return { label: "Needs Attention", color: "text-red-500" };
};

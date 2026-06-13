import type { Mood, MoodLog } from "../utils/wellness";
import type { AnalysisResult } from "../services/gemini";

export type { Mood, MoodLog, AnalysisResult };

export interface JournalEntry {
    id: string;
    date: string;
    text: string;
    analysis?: AnalysisResult;
}

export interface AppState {
    moodLogs: MoodLog[];
    journalEntries: JournalEntry[];
    wellnessScore: number;
}

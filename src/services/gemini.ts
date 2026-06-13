import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing! Please check your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export interface AnalysisResult {
    emotionalSummary: string;
    stressLevel: number; // 1-10
    motivationLevel: number; // 1-10
    burnoutRisk: "Low" | "Moderate" | "High" | "Critical";
    positiveObservations: string[];
    concerns: string[];
    personalizedAdvice: string;
    triggers: string[];
}

/**
 * Analyzes a journal entry and returns a structured emotional assessment.
 * @param text - The journal entry content.
 * @returns A structured AnalysisResult object.
 */
export const analyzeJournal = async (text: string): Promise<AnalysisResult> => {
    // Using a more specific prompt for JSON output
    const prompt = `
    Analyze this student journal entry and provide a wellness assessment.
    Student Entry: "${text}"
    
    Response must be a valid JSON object matching this schema:
    {
      "emotionalSummary": "Concise summary",
      "stressLevel": integer 1-10,
      "motivationLevel": integer 1-10,
      "burnoutRisk": "Low" | "Moderate" | "High" | "Critical",
      "positiveObservations": ["string"],
      "concerns": ["string"],
      "personalizedAdvice": "Friendly advice",
      "triggers": ["string"]
    }
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
            }
        });
        const response = await result.response;
        return JSON.parse(response.text()) as AnalysisResult;
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw error;
    }
};

/**
 * Communicates with the AI Wellness Coach to get empathetic feedback.
 * @param userMessage - The user's input message.
 * @param history - The current chat history.
 * @returns The AI's response string.
 */
export const getCoachResponse = async (userMessage: string, history: { role: string; content: string }[]) => {
    const chat = model.startChat({
        history: history.map(h => ({ role: h.role === "user" ? "user" : "model", parts: [{ text: h.content }] })),
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    const systemPrompt = "You are MindMate AI, an empathetic student wellness coach for competitive exam aspirants (JEE, NEET, UPSC, etc.). Rules: Never diagnose illness. Never provide medical advice. Be encouraging, supportive, and positive. Identify recurring stress triggers if possible.";

    try {
        const result = await chat.sendMessage(`${systemPrompt}\n\nUser says: ${userMessage}`);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Coach Error:", error);
        return "I'm sorry, I'm having trouble connecting. But remember, you're doing your best and that's what matters!";
    }
};

/**
 * Generates a daily motivational quote based on the user's current mood.
 * @param mood - The current mood string.
 * @returns A motivational quote string.
 */
export const getDailyMotivation = async (mood: string) => {
    const prompt = `Generate a short, powerful motivational quote for a student who is feeling ${mood}. The student is preparing for competitive exams. Keep it to one or two sentences.`;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        return "Every study session is a step toward your goal.";
    }
};

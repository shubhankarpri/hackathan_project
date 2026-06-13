import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles, User, Brain, ShieldCheck } from "lucide-react";
import { getCoachResponse } from "../services/gemini";

interface Message {
    role: "user" | "coach";
    content: string;
}

/**
 * AI Coach component providing an interactive chat interface for wellness support.
 */
export const Coach = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "coach",
            content: "Hello! I'm your MindMate AI Wellness Coach. Preparation for competitive exams can be tough, but you're not alone. How are you feeling today? Anything specific on your mind?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
        setMessages(newMessages);

        setIsLoading(true);
        try {
            // Map to Gemini history format
            const history = messages.map(m => ({
                role: m.role === "user" ? "user" : "model",
                content: m.content
            }));

            const response = await getCoachResponse(userMsg, history);
            setMessages([...newMessages, { role: "coach", content: response }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[85vh] flex flex-col py-6">
            <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                        <Brain size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">AI Wellness Coach</h1>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online & Ready to Listen
                        </div>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass border-primary/20 text-xs font-bold text-primary">
                    <ShieldCheck size={16} />
                    Safe & Empathetic
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 space-y-6 pb-10 scrollbar-hide"
            >
                <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`
                max-w-[80%] p-5 rounded-3xl shadow-sm
                ${message.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "glass-card rounded-tl-none border-primary/10"}
              `}>
                                <div className="flex items-center gap-2 mb-2 opacity-70 text-xs font-bold uppercase tracking-wider">
                                    {message.role === "user" ? <User size={12} /> : <Sparkles size={12} />}
                                    {message.role === "user" ? "You" : "MindMate Coach"}
                                </div>
                                <p className="text-lg leading-relaxed">{message.content}</p>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="glass-card p-5 rounded-3xl rounded-tl-none border-primary/10 flex items-center gap-3">
                                <Loader2 size={20} className="animate-spin text-primary" />
                                <span className="text-muted-foreground font-medium italic">Coach is typing...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="mt-4 p-4 glass-card border-primary/10 relative">
                <div className="flex gap-4">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Tell me what's bothering you..."
                        className="flex-1 bg-background/50 border-2 border-border/50 rounded-2xl p-4 min-h-[60px] max-h-[150px] focus:outline-none focus:border-primary transition-colors resize-none text-lg"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-all
              ${!input.trim() || isLoading
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"}
            `}
                    >
                        <Send size={24} />
                    </button>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                    Press Enter to send. MindMate AI Coach provides support but is not a replacement for professional medical advice.
                </p>
            </div>
        </div>
    );
};

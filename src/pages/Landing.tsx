import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Brain, Shield, Heart, Zap } from "lucide-react";

/**
 * Landing page component showcasing the application's features and core mission.
 */
export const Landing = () => {
    return (
        <div className="flex flex-col gap-20 py-10">
            {/* Hero Section */}
            <section className="text-center space-y-8 py-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary font-medium text-sm mb-4"
                >
                    <Sparkles size={16} />
                    <span>Designed for JEE, NEET, UPSC & CAT aspirants</span>
                </motion.div>

                <motion.h1
                    className="text-5xl lg:text-7xl font-bold tracking-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Your AI Companion for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        Exam Wellness
                    </span>
                </motion.h1>

                <motion.p
                    className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Cracking competitive exams shouldn't mean sacrificing your mental peace.
                    Track your mood, journal your thoughts, and get personalized AI insights.
                </motion.p>

                <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link
                        to="/check-in"
                        aria-label="Start your daily wellness assessment"
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        Start Assessment
                    </Link>
                    <Link
                        to="/coach"
                        aria-label="Start chatting with the AI Wellness Coach"
                        className="px-8 py-4 glass border border-primary/20 rounded-2xl font-bold text-lg hover:bg-accent transition-all"
                    >
                        Talk to AI Coach
                    </Link>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                {[
                    {
                        icon: Brain,
                        title: "AI Analysis",
                        desc: "Advanced emotional intelligence to understand your study stress and burnout risk.",
                        color: "text-blue-500"
                    },
                    {
                        icon: Shield,
                        title: "Safe Space",
                        desc: "Your data stays locally on your device. No cloud, no database, 100% privacy.",
                        color: "text-green-500"
                    },
                    {
                        icon: Zap,
                        title: "Stress Triggers",
                        desc: "Identify exactly what disrupts your focus and learn how to manage exam pressure.",
                        color: "text-purple-500"
                    },
                    {
                        icon: Heart,
                        title: "Empathy First",
                        desc: "Designed to be your supportive friend throughout your preparation journey.",
                        color: "text-rose-500"
                    }
                ].map((feature, i) => (
                    <motion.div
                        key={feature.title}
                        className="glass-card p-8 group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className={`p-4 rounded-2xl bg-background mb-6 w-fit shadow-inner ${feature.color}`}>
                            <feature.icon size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {feature.desc}
                        </p>
                    </motion.div>
                ))}
            </section>

            {/* Quote Section */}
            <section className="py-20 text-center glass-card mx-4 lg:mx-20 bg-primary/5">
                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-3xl font-medium italic text-primary leading-tight mb-8">
                        "The greatest weapon against stress is our ability to choose one thought over another."
                    </p>
                    <div className="font-bold text-lg">— William James</div>
                </div>
            </section>
        </div>
    );
};

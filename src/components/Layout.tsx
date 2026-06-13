import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Smile,
    BookOpen,
    MessageCircle,
    Wind,
    Moon,
    Sun,
    LayoutDashboard,
    Menu,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navigation item component for the sidebar and mobile menu.
 */
const NavItem = ({ to, icon: Icon, children, active, onClick }: any) => (
    <Link
        to={to}
        onClick={onClick}
        aria-label={`Navigate to ${children}`}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
            }`}
    >
        <Icon size={20} aria-hidden="true" />
        <span className="font-medium">{children}</span>
    </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const navLinks = [
        { to: "/", label: "Landing", icon: Home },
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/check-in", label: "Mood Check", icon: Smile },
        { to: "/journal", label: "Journal", icon: BookOpen },
        { to: "/coach", label: "AI Coach", icon: MessageCircle },
        { to: "/mindfulness", label: "Mindfulness", icon: Wind },
    ];

    return (
        <div className="min-h-screen bg-background transition-colors duration-300">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 glass sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">M</div>
                    <span className="font-bold text-lg tracking-tight">MindMate AI</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        aria-label="Toggle Dark Mode"
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label="Toggle Navigation Menu"
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
          fixed lg:sticky top-0 h-screen w-64 glass border-r z-40 transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">M</div>
                            <h1 className="font-bold text-xl tracking-tight">MindMate <span className="text-primary italic">AI</span></h1>
                        </div>

                        <nav className="space-y-2">
                            {navLinks.map((link) => (
                                <NavItem
                                    key={link.to}
                                    to={link.to}
                                    icon={link.icon}
                                    active={location.pathname === link.to}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    {link.label}
                                </NavItem>
                            ))}
                        </nav>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            aria-label={`Switch to ${darkMode ? "Light" : "Dark"} Mode`}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-accent transition-all duration-200"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Background shapes */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />
            </div>
        </div>
    );
};

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary hover:scale-110 active:scale-95 transition-all duration-300 group overflow-hidden"
            aria-label="Toggle theme"
        >
            {/* Dynamic Background Glow */}
            <div className={`absolute inset-0 opacity-20 blur-lg transition-transform duration-1000 group-hover:scale-150 ${theme === 'light' ? 'bg-amber-400' : 'bg-sky-400'}`} />

            <AnimatePresence mode="wait" initial={false}>
                {theme === "light" ? (
                    <motion.div
                        key="light"
                        initial={{ y: 20, opacity: 0, rotate: -45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: 45 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Sun className="h-5 w-5 text-amber-500 relative z-10" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dark"
                        initial={{ y: 20, opacity: 0, rotate: -45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: 45 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Moon className="h-5 w-5 text-sky-400 relative z-10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}

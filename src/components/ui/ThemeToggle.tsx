"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-accent transition-colors"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{
                    scale: theme === "light" ? 1 : 0,
                    rotate: theme === "light" ? 0 : -90,
                    opacity: theme === "light" ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute"
            >
                <Sun className="h-5 w-5 text-amber-500" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    scale: theme === "dark" ? 1 : 0,
                    rotate: theme === "dark" ? 0 : 90,
                    opacity: theme === "dark" ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute"
            >
                <Moon className="h-5 w-5 text-sky-400" />
            </motion.div>
        </button>
    );
}

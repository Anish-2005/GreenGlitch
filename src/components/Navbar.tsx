"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ui/ThemeToggle";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { PROJECT_NAME } from "@/lib/constants";
import { Menu, X, ArrowRight, Command } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
    { name: "Intelligence", href: "/dashboard" },
    { name: "Protocols", href: "/report" },
    { name: "Network", href: "#" },
    { name: "Interface", href: "#" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { scrollY } = useScroll();

    // High-end scroll reactivity
    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ["rgba(255, 255, 255, 0)", "rgba(var(--background-rgb), 0.8)"]
    );
    const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);
    const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);
    const yOffset = useTransform(scrollY, [0, 100], [20, 0]);
    const navPadding = useTransform(scrollY, [0, 100], ["1.5rem", "0.75rem"]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
            <motion.nav
                style={{
                    backgroundColor,
                    backdropFilter: backdropBlur,
                    paddingTop: navPadding,
                    paddingBottom: navPadding,
                }}
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-border/0 transition-all duration-300"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all duration-500 group-hover:rotate-[15deg]">
                                <Image
                                    src="/greenglitch-logo.svg"
                                    alt="Logo"
                                    width={30}
                                    height={30}
                                    className="transition-transform duration-700 group-hover:scale-110 dark:invert-0 invert"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter leading-none text-foreground">
                                    GREEN<span className="text-primary italic">GLITCH</span>
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase leading-none mt-1">
                                    Systems Core
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-secondary/30 border border-border/20 backdrop-blur-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative px-5 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300 group"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    <motion.div
                                        className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                        layoutId="nav-hover"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2">
                            <ThemeToggle />
                            <div className="h-4 w-[1px] bg-border/50 mx-2" />
                            <Link
                                href="/login"
                                className="group relative flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-foreground text-background text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10">Initialize</span>
                                <ArrowRight className="relative z-10 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-3 rounded-2xl bg-secondary/50 border border-border/50 text-foreground hover:bg-secondary transition-all"
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                    >
                                        <X className="h-6 w-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, rotate: 90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                    >
                                        <Menu className="h-6 w-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Fullscreen Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[-1] bg-background/95 backdrop-blur-2xl lg:hidden flex flex-col pt-32 px-8"
                    >
                        <div className="space-y-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="group flex items-center justify-between text-5xl font-black tracking-tighter hover:text-primary transition-colors italic"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="h-10 w-10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-auto mb-12 space-y-8"
                        >
                            <div className="h-[1px] w-full bg-border/50" />
                            <div className="flex justify-between items-center">
                                <ThemeToggle />
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 text-2xl font-black italic hover:text-primary transition-colors"
                                >
                                    ACCESS CORE <ArrowRight className="h-6 w-6" />
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

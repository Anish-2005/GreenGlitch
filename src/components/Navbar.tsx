"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ui/ThemeToggle";
import { motion } from "framer-motion";
import { PROJECT_NAME } from "@/lib/constants";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
    { name: "Report", href: "/report" },
    { name: "Live Map", href: "/dashboard" },
    { name: "Analytics", href: "/dashboard" }, // Analytics might be a separate page or part of dashboard
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                                <Image
                                    src="/greenglitch-logo.svg"
                                    alt="Logo"
                                    width={28}
                                    height={28}
                                    className="transition-transform group-hover:scale-110"
                                />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gradient">
                                {PROJECT_NAME}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-6 w-[1px] bg-border/50 mx-2" />
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-muted-foreground"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                className="md:hidden overflow-hidden bg-background border-b border-border"
            >
                <div className="px-4 py-6 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block text-lg font-medium text-muted-foreground"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="block w-full rounded-xl bg-primary py-3 text-center font-semibold text-primary-foreground"
                    >
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </nav>
    );
}

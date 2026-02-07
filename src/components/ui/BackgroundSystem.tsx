"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export function BackgroundSystem() {
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Base Grid */}
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

            {/* Noise Grain */}
            <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.05]" />

            {/* Dynamic Ambient Glows */}
            <motion.div
                style={{
                    y: useTransform(smoothProgress, [0, 1], [0, 500]),
                    opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.15, 0.08, 0.15])
                }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[140px] rounded-full"
            />
            <motion.div
                style={{
                    y: useTransform(smoothProgress, [0, 1], [0, -400]),
                    opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.1, 0.2, 0.1])
                }}
                className="absolute top-[30%] -right-[10%] w-[45%] h-[45%] bg-sky-500/20 blur-[140px] rounded-full"
            />
            <motion.div
                style={{
                    y: useTransform(smoothProgress, [0, 1], [0, 300]),
                    opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.05, 0.15, 0.05])
                }}
                className="absolute bottom-[5%] left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[140px] rounded-full"
            />

            {/* Static Accent Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] opacity-50" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px] opacity-50" />
        </div>
    );
}

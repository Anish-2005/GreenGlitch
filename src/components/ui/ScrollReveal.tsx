"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, Variants } from "framer-motion";

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
}

export const ScrollReveal = ({
    children,
    width = "100%",
    direction = "up",
    delay = 0,
}: ScrollRevealProps) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const variants: Variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
            x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1], // Premium quintic ease-out
                delay: delay,
            },
        } as any,
    };

    if (!hasMounted) return <div style={{ width }}>{children}</div>;

    return (
        <div style={{ position: "relative", width }}>
            <motion.div
                variants={variants}
                initial="hidden"
                whileInView="visible"
                // once: false enables reverse scroll animations (hide/show on scroll up/down)
                viewport={{ once: false, margin: "-10%" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export const ParallaxSection = ({ children, offset = 60 }: { children: React.ReactNode; offset?: number }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div ref={ref} style={{ y: smoothY }}>
            {children}
        </motion.div>
    );
};

export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
        {children}
    </motion.div>
);

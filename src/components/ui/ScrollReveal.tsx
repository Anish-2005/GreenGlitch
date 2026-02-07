"use client";

import React, { useEffect, useState } from "react";
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

    if (!hasMounted) return <div style={{ width }}>{children}</div>;

    const variants: Variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98],
                delay: delay,
            },
        } as any, // Cast as any to circumvent strict cubic-bezier typing if it fails
    };

    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-100px" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export const ParallaxSection = ({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, offset]);
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

    return (
        <motion.div style={{ y: smoothY }}>
            {children}
        </motion.div>
    );
};

export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1, delay }}
    >
        {children}
    </motion.div>
);

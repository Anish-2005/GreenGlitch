"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField({ count = 1500 }) {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 15;
            p[i * 3 + 1] = (Math.random() - 0.5) * 15;
            p[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return p;
    }, [count]);

    const ref = useRef<THREE.Points>(null!);
    const { mouse } = useThree();

    useFrame((state, delta) => {
        if (ref.current) {
            // Atmospheric rotation
            ref.current.rotation.x += delta / 40;
            ref.current.rotation.y += delta / 60;

            // Subtle mouse tracking for "depth" feel
            ref.current.rotation.y += (mouse.x * 0.1 - ref.current.rotation.y) * 0.05;
            ref.current.rotation.x += (-mouse.y * 0.1 - ref.current.rotation.x) * 0.05;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#10b981"
                    size={0.012}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.3}
                />
            </Points>
        </group>
    );
}

function ProfessionalGrid() {
    const gridRef = useRef<THREE.GridHelper>(null!);
    const { mouse } = useThree();

    useFrame(() => {
        if (gridRef.current) {
            // Tilt the grid slightly based on mouse
            gridRef.current.rotation.x = (Math.PI / 2.2) + (mouse.y * 0.05);
            gridRef.current.rotation.z = (mouse.x * 0.05);
        }
    });

    return (
        <gridHelper
            ref={gridRef}
            args={[30, 30, "#10b981", "#1e293b"]}
            position={[0, -2.5, 0]}
            rotation={[Math.PI / 2.2, 0, 0]}
        >
            <meshStandardMaterial transparent opacity={0.05} />
        </gridHelper>
    );
}

export function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-50">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#10b981" />
                <ParticleField />
                <ProfessionalGrid />
            </Canvas>
        </div>
    );
}

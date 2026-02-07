"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function AnimatedCore() {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.cos(time / 4) * 0.2;
            meshRef.current.rotation.y = Math.sin(time / 2) * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <MeshDistortMaterial
                    color="#10b981"
                    speed={3}
                    distort={0.4}
                    radius={1}
                    emissive="#059669"
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Outer technical rings */}
            <group rotation={[Math.PI / 4, 0, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.2, 0.01, 16, 100]} />
                    <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2} transparent opacity={0.3} />
                </mesh>
                <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                    <torusGeometry args={[2.5, 0.005, 16, 100]} />
                    <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} transparent opacity={0.2} />
                </mesh>
            </group>
        </Float>
    );
}

export function CoreEngine3D() {
    return (
        <div className="w-full h-[300px] md:h-[500px] relative">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} color="#10b981" intensity={1} />
                <AnimatedCore />
            </Canvas>

            {/* Absolute UI overlay - Responsive sizes */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-emerald-500/20 rounded-full animate-[pulse_4s_infinite] scale-110" />
                <div className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] border border-emerald-500/10 rounded-full animate-[pulse_6s_infinite] scale-125" />
            </div>
        </div>
    );
}

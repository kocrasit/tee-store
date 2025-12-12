"use client";

import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text3D, Stars, Center, Sparkles, Environment, DragControls } from '@react-three/drei';
import * as THREE from 'three';

// Solid White Moon Component
const Moon = () => {
    return (
        <group position={[-12, 9, -12]}> {/* Top Left Position */}
            <mesh>
                <sphereGeometry args={[3, 64, 64]} /> {/* Smooth sphere */}
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={3} // Very bright white light
                    roughness={0.1}
                />
            </mesh>
            {/* Glow/Halo effect */}
            <pointLight intensity={3} color="#ffffff" distance={50} decay={1.5} />
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.BackSide} />
            </mesh>
        </group>
    );
};

const DraggableLetter = ({ char, position, fontUrl }: { char: string, position: [number, number, number], fontUrl: string }) => {
    const [hovered, setHover] = useState(false);

    // Using DragControls to allow dragging directly
    // The matrix of the object inside will be mutated by DragControls

    return (
        <DragControls
            onDragStart={() => { document.body.style.cursor = 'grabbing'; }}
            onDragEnd={() => { document.body.style.cursor = 'grab'; }}
        >
            <group position={position}>
                <Center>
                    <Text3D
                        font={fontUrl}
                        curveSegments={32}
                        bevelEnabled
                        bevelSize={0.02}
                        bevelThickness={0.05}
                        height={0.15}
                        lineHeight={0.5}
                        letterSpacing={-0.05}
                        size={1.5}
                        onPointerOver={() => { document.body.style.cursor = 'grab'; setHover(true); }}
                        onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
                    >
                        {char}
                        {/* Pure BEMBEYAZ White Material */}
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#ffffff"
                            emissiveIntensity={0.35}
                            metalness={0.1}
                            roughness={0.1}
                            envMapIntensity={1}
                        />
                    </Text3D>
                </Center>
            </group>
        </DragControls>
    );
};

const Word = () => {
    const word = "ELEGANSIA";
    const letterSpacing = 1.8;
    const startX = -((word.length - 1) * letterSpacing) / 2;
    const fontUrl = "/fonts/helvetiker_regular.typeface.json";

    return (
        <group>
            {word.split('').map((char, i) => (
                <DraggableLetter
                    key={i}
                    char={char}
                    position={[startX + (i * letterSpacing), 0, 0]}
                    fontUrl={fontUrl}
                />
            ))}
        </group>
    );
};

const Scene = () => {
    return (
        <>
            <ambientLight intensity={0.2} />

            {/* Front Light for brightness */}
            <spotLight position={[0, 10, 20]} intensity={1.5} color="#ffffff" angle={0.6} penumbra={1} />

            {/* Backlight from Moon direction */}
            <spotLight position={[-10, 10, -5]} intensity={2} color="#ffffff" angle={0.5} />

            <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={150} scale={20} size={2} speed={0.4} opacity={0.4} color="#ffffff" />

            <Environment preset="night" />

            {/* Removing Float to ensure stable dragging */}
            <Word />

            <Moon />
        </>
    );
};

const LoginHero3D = () => {
    return (
        <div className="w-full h-[500px] lg:h-[700px] bg-black relative overflow-hidden rounded-b-[60px] lg:rounded-b-[100px] shadow-2xl border-b border-gray-900 cursor-auto">
            <Canvas camera={{ position: [0, 0, 12], fov: 40 }} gl={{ toneMappingExposure: 1.2 }}>
                <Scene />
                <fog attach="fog" args={['#000000', 10, 50]} />
            </Canvas>
        </div>
    );
};

export default LoginHero3D;

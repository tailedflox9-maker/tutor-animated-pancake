import React, { useEffect, useState, useCallback, useMemo } from 'react';

interface ShootingStar {
    id: number;
    x: number;
    y: number;
    angle: number;
    speed: number;
    size: number;
}

export const Background: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [stars, setStars] = useState<ShootingStar[]>([]);

    // Track mouse movement for parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 2 - 1, // -1 to 1
                y: (e.clientY / window.innerHeight) * 2 - 1  // -1 to 1
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Generate static star layers (memoized)
    const generateStars = (count: number) => {
        let value = '';
        for (let i = 0; i < count; i++) {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 1.5 + 0.5; // Reduced size: 0.5px to 2px
            const opacity = Math.random() * 0.8; // Slightly reduced max opacity
            value += `${x}vw ${y}vh 0 ${opacity}px #fff, `;
        }
        return value.slice(0, -2);
    };

    const layer1 = useMemo(() => generateStars(50), []); // Reduced count: 100 -> 50
    const layer2 = useMemo(() => generateStars(100), []); // Reduced count: 200 -> 100
    const layer3 = useMemo(() => generateStars(150), []); // Reduced count: 300 -> 150

    // Shooting stars logic
    const createStar = useCallback(() => {
        const id = Date.now();
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.5);
        const angle = 45;
        const speed = 2 + Math.random() * 3;
        const size = 1 + Math.random() * 2;

        setStars(prev => [...prev, { id, x, y, angle, speed, size }]);

        setTimeout(() => {
            setStars(prev => prev.filter(star => star.id !== id));
        }, 2000);
    }, []);

    useEffect(() => {
        const initialTimeout = setTimeout(() => createStar(), 1000);
        const interval = setInterval(() => {
            if (Math.random() > 0.7) createStar();
        }, 2000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [createStar]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
            {/* Nebula Pulse */}
            <div
                className="absolute inset-0 animate-nebula-pulse opacity-30"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.2), rgba(15, 23, 42, 0) 70%)'
                }}
            />

            {/* Parallax Star Layers */}
            {/* Layer 3 (Far) - Moves least */}
            <div
                className="absolute inset-0 transition-transform duration-100 ease-out"
                style={{
                    boxShadow: layer3,
                    width: '1px', height: '1px',
                    transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
                    opacity: 0.4
                }}
            />

            {/* Layer 2 (Mid) */}
            <div
                className="absolute inset-0 transition-transform duration-100 ease-out"
                style={{
                    boxShadow: layer2,
                    width: '2px', height: '2px',
                    transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
                    opacity: 0.6
                }}
            />

            {/* Layer 1 (Close) - Moves most */}
            <div
                className="absolute inset-0 transition-transform duration-100 ease-out"
                style={{
                    boxShadow: layer1,
                    width: '2px', height: '2px',
                    transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)`,
                    opacity: 0.8
                }}
            />

            {/* Shooting Stars */}
            {stars.map(star => (
                <div
                    key={star.id}
                    className="shooting-star"
                    style={{
                        left: star.x,
                        top: star.y,
                        '--angle': `${star.angle}deg`,
                        '--speed': `${star.speed}s`,
                        '--size': `${star.size}px`
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

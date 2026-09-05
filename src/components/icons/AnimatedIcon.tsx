'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Player as PlayerClass } from '@lordicon/react';

interface AnimatedIconProps {
    name: string;
    size?: number;
    className?: string;
    fallbackGlyph: string;
}

type PlayerComponentType = new (
    props: React.ComponentProps<typeof PlayerClass>,
) => PlayerClass;

type IconData = React.ComponentProps<typeof PlayerClass>['icon'];
type PlayerInstance = PlayerClass;

export default function AnimatedIcon({
    name,
    size = 32,
    className = '',
    fallbackGlyph,
}: AnimatedIconProps) {
    const playerRef = useRef<PlayerInstance | null>(null);
    const [PlayerComponent, setPlayerComponent] = useState<PlayerComponentType | null>(null);
    const [iconData, setIconData] = useState<IconData | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setPlayerComponent(null);
        setIconData(null);
        setFailed(false);
        (async () => {
            try {
                const [{ Player }, asset] = await Promise.all([
                    import('@lordicon/react'),
                    fetch(`/assets/icon/${encodeURIComponent(name)}.json`).then((res) => {
                        if (!res.ok) throw new Error(`icon asset unavailable (${res.status})`);
                        return res.json() as Promise<IconData>;
                    }),
                ]);
                if (cancelled) return;
                setPlayerComponent(() => Player);
                setIconData(asset);
            } catch {
                if (!cancelled) setFailed(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [name]);

    const playOnHover = useCallback(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        playerRef.current?.playFromBeginning();
    }, []);

    const handleReady = useCallback(() => {
        playerRef.current?.goToFirstFrame();
    }, []);

    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center ${className}`}
            style={{ width: size, height: size }}
            onMouseEnter={playOnHover}
        >
            {PlayerComponent && iconData && !failed ? (
                <PlayerComponent ref={playerRef} icon={iconData} size={size} onReady={handleReady} />
            ) : (
                <i
                    className={`bi ${fallbackGlyph}`}
                    style={{ fontSize: Math.round(size * 0.72) }}
                    aria-hidden="true"
                ></i>
            )}
        </span>
    );
}

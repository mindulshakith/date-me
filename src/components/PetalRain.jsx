import { useMemo } from 'react';

const petals = ['🌸', '🌷', '💮', '🌺', '✿'];

export default function PetalRain({ count = 18 }) {
  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      emoji: petals[Math.floor(Math.random() * petals.length)],
      size: `${0.8 + Math.random() * 0.8}rem`,
    }))
  , [count]);

  return (
    <>
      {items.map(p => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            top: '-30px',
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  );
}

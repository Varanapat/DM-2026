import type { ClockModuloProps } from './ClockModulo.types';
import styles from './ClockModulo.module.css';

export function ClockModulo({ modulus, value, size = 160 }: ClockModuloProps) {
  const center = size / 2;
  const radius = size / 2 - 20;
  const position = modulus > 0 ? ((value % modulus) + modulus) % modulus : 0;
  const angle = (position / Math.max(modulus, 1)) * 2 * Math.PI - Math.PI / 2;
  const handX = center + radius * 0.8 * Math.cos(angle);
  const handY = center + radius * 0.8 * Math.sin(angle);

  const ticks = Array.from({ length: modulus }, (_, i) => {
    const tickAngle = (i / modulus) * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(tickAngle);
    const y = center + radius * Math.sin(tickAngle);
    return { i, x, y };
  });

  return (
    <div className={styles.wrapper}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`Clock mod ${modulus}, value ${position}`}>
        <circle className={styles.face} cx={center} cy={center} r={radius + 10} />
        {ticks.map((tick) => (
          <text key={tick.i} x={tick.x} y={tick.y} className={styles.tickLabel} textAnchor="middle" dominantBaseline="middle">
            {tick.i}
          </text>
        ))}
        <line className={styles.hand} x1={center} y1={center} x2={handX} y2={handY} />
        <circle cx={center} cy={center} r={4} fill="var(--color-secondary)" />
      </svg>
      <span className={styles.valueLabel}>
        {value} mod {modulus} = {position}
      </span>
    </div>
  );
}

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import './components.css';

const SIZE = 540;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 230;    // main ring radius where text labels sit
const DOT_R = 200;     // inner ring for dots / tick marks
const RING_R = 215;    // visible ring

/**
 * Distribute pizza items in a SEMICIRCLE on the RIGHT side (from ~-100° to +100°).
 * 0° = right side (3-o-clock). We'll use top-half arc: 200° span
 * centered at 270° (top, 12-o-clock) for the active item.
 *
 * Active pizza is always at the top (270° = 12 o'clock).
 * The selector "rotates" by offsetting all item angles.
 */

const ARC_SPAN = 240; // degrees: total arc used (right semicircle spread)

export default function CircularSelector({ pizzas, activeIndex, onSelect }) {
  const count = pizzas.length;

  // Each item's base angle within the arc
  // We spread items evenly across ARC_SPAN
  const baseAngles = useMemo(() => {
    return pizzas.map((_, i) => {
      // center angle at 270 (top), spread items
      const step = ARC_SPAN / (count - 1);
      return 270 - ARC_SPAN / 2 + i * step;
    });
  }, [count]);

  // Offset: active item should be at 270° (top)
  // Current angle of activeIndex without offset = baseAngles[activeIndex]
  // We need to rotate the whole arc so baseAngles[activeIndex] aligns to 270
  const offset = 270 - baseAngles[activeIndex];

  // rotateAngle for the framer-motion group
  const groupRotate = offset;

  return (
    <div className="circular-selector">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Static background rings */}
        <circle cx={CX} cy={CY} r={RING_R} className="selector-ring" />
        <circle cx={CX} cy={CY} r={DOT_R - 22} className="selector-ring-inner" />

        {/* Rotating group: all labels and dots */}
        <motion.g
          style={{ originX: `${CX}px`, originY: `${CY}px` }}
          animate={{ rotate: groupRotate }}
          transition={{
            type: 'spring',
            stiffness: 80,
            damping: 20,
            mass: 0.8,
          }}
        >
          {pizzas.map((pizza, i) => {
            const angle = baseAngles[i]; // degrees
            const rad = (angle * Math.PI) / 180;

            // Label position on outer ring
            const lx = CX + RADIUS * Math.cos(rad);
            const ly = CY + RADIUS * Math.sin(rad);

            // Dot position on inner ring
            const dx = CX + DOT_R * Math.cos(rad);
            const dy = CY + DOT_R * Math.sin(rad);

            // Tick line
            const t1x = CX + (DOT_R - 10) * Math.cos(rad);
            const t1y = CY + (DOT_R - 10) * Math.sin(rad);
            const t2x = CX + (DOT_R + 6) * Math.cos(rad);
            const t2y = CY + (DOT_R + 6) * Math.sin(rad);

            const isActive = i === activeIndex;

            // Counter-rotate text so it stays upright
            const textRotate = -groupRotate;

            return (
              <g key={pizza.id} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
                {/* Tick */}
                <line
                  x1={t1x} y1={t1y}
                  x2={t2x} y2={t2y}
                  className={`selector-tick ${isActive ? 'active' : ''}`}
                />

                {/* Dot */}
                <motion.circle
                  cx={dx}
                  cy={dy}
                  r={isActive ? 4 : 2.5}
                  fill={isActive ? '#F4A261' : 'rgba(255,255,255,0.25)'}
                  animate={{
                    r: isActive ? 4 : 2.5,
                    fill: isActive ? '#F4A261' : 'rgba(255,255,255,0.25)',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />

                {/* Label — counter-rotate to stay upright */}
                <motion.text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`pizza-label ${isActive ? 'active' : ''}`}
                  style={{
                    transformOrigin: `${lx}px ${ly}px`,
                  }}
                  animate={{
                    rotate: textRotate,
                    fill: isActive ? '#F4A261' : 'rgba(255,255,255,0.35)',
                    fontSize: isActive ? '12px' : '10px',
                  }}
                  transition={{ type: 'spring', stiffness: 80, damping: 20, mass: 0.8 }}
                >
                  {pizza.name}
                </motion.text>
              </g>
            );
          })}
        </motion.g>

        {/* Active item highlight arc — static, always at top */}
        <HighlightArc cx={CX} cy={CY} r={RING_R} />

        {/* Center decoration rings */}
        <circle cx={CX} cy={CY} r={145} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={60}  fill="none" stroke="rgba(244,162,97,0.1)"   strokeWidth="1" />
      </svg>
    </div>
  );
}

/** Small glowing arc highlight at the top (12 o'clock) for the active item */
function HighlightArc({ cx, cy, r }) {
  const spanDeg = 28;
  const startAngle = ((270 - spanDeg / 2) * Math.PI) / 180;
  const endAngle   = ((270 + spanDeg / 2) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  return (
    <motion.path
      d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
      fill="none"
      stroke="#F4A261"
      strokeWidth="2.5"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        filter: 'drop-shadow(0 0 6px #F4A261) drop-shadow(0 0 12px #FF6B35)',
      }}
    />
  );
}

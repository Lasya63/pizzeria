import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SemicircleSelector.css';

/**
 * SemicircleSelector — matches the reference images:
 * - Large circle, only TOP HALF visible (clipped by parent overflow:hidden)
 * - Pizza image shown as a tight circle crop (clip-path) — no wooden background
 * - Pizza names arranged along the outer arc, rendered above the pizza
 * - Concentric decorative rings
 */

const DIAMETER = 860;
const R = DIAMETER / 2; // 430
const CX = R;
const CY = R;

const ARC_START = 194;
const ARC_END   = 346;

// Rings from outside to inside
const RING_RADII = [429, 394, 362]; // R-1, R-36, R-68

// Label text sits at a precise distance outside the crust
const LABEL_R = 412;
// Bullet dot radius sits right on the crust perimeter
const DOT_R   = 394;

function deg2rad(d) { return (d * Math.PI) / 180; }

export default function SemicircleSelector({ pizzas, activeIndex, onSelect, direction }) {
  const count = pizzas.length;

  const itemAngles = useMemo(() =>
    pizzas.map((_, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1);
      return ARC_START + t * (ARC_END - ARC_START);
    }),
    [count]
  );

  // No rotation offset anymore, the rings and text stay completely static
  const activePizza = pizzas[activeIndex];

  return (
    <div className="sc-root">

      {/* ── Layer 1: Pizza image (bottom) ── */}
      <div className="sc-pizza-wrap">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={activePizza.id}
            src={activePizza.image}
            alt={activePizza.title}
            className="sc-pizza-img"
            custom={direction}
            initial={{ opacity: 0, scale: 0.95, rotate: direction > 0 ? -14 : 14 }}
            animate={{
              opacity: 1, scale: 1, rotate: 0,
              transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
            }}
            exit={{
              opacity: 0, scale: 0.95, rotate: direction > 0 ? 14 : -14,
              transition: { duration: 0.28, ease: 'easeIn' }
            }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* ── Layer 2: SVG rings + labels (on top) ── */}
      <div className="sc-svg-wrap">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${DIAMETER} ${CY}`}
          style={{ overflow: 'visible', display: 'block' }}
        >
          <defs>
            <path id="textCurve" d={`M ${CX - LABEL_R},${CY} A ${LABEL_R},${LABEL_R} 0 0,1 ${CX + LABEL_R},${CY}`} fill="none" />
          </defs>

          {/* Static decorative rings */}
          {RING_RADII.map((r, ri) => (
            <circle
              key={ri}
              cx={CX} cy={CY} r={r}
              fill="none"
              stroke={ri === 0
                ? 'rgba(255,255,255,0.22)'
                : ri === 1
                  ? 'rgba(255,255,255,0.09)'
                  : 'rgba(255,255,255,0.05)'}
              strokeWidth={ri === 0 ? 1.5 : 1}
            />
          ))}

          {/* Static group */}
          <g style={{ originX: `${CX}px`, originY: `${CY}px` }}>
            {pizzas.map((pizza, i) => {
              const aRad = deg2rad(itemAngles[i]);
              const isActive = i === activeIndex;
              const textRot = itemAngles[i] + 90;

              // Label coords
              const lx = CX + LABEL_R * Math.cos(aRad);
              const ly = CY + LABEL_R * Math.sin(aRad);
              // Dot coords
              const dx = CX + DOT_R * Math.cos(aRad);
              const dy = CY + DOT_R * Math.sin(aRad);

              return (
                <g key={pizza.id} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
                  {/* Dot */}
                  <motion.circle
                    cx={dx} cy={dy}
                    animate={{
                      r: isActive ? 5 : 3,
                      fill: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                    }}
                    transition={{ duration: 0.35 }}
                  />

                  {/* Curved Label */}
                  <motion.text
                    style={{
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      userSelect: 'none',
                    }}
                    animate={{
                      fill: isActive ? '#ffffff' : 'rgba(255,255,255,0.42)',
                      fontSize: isActive ? '20px' : '14px',
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    <textPath href="#textCurve" startOffset={`${((itemAngles[i] - 180) / 180) * 100}%`} textAnchor="middle">
                      • {pizza.name} •
                    </textPath>
                  </motion.text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

    </div>
  );
}

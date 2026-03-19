import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { pizzas } from './data/pizzas';
import SemicircleSelector from './components/SemicircleSelector';
import './App.css';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isAnimating = useRef(false);

  const selectPizza = useCallback((index) => {
    if (isAnimating.current || index === activeIndex) return;
    isAnimating.current = true;
    const total = pizzas.length;
    const diff = ((index - activeIndex + total) % total);
    setDirection(diff <= total / 2 ? 1 : -1);
    setActiveIndex(index);
    setTimeout(() => { isAnimating.current = false; }, 700);
  }, [activeIndex]);

  const next = useCallback(() => selectPizza((activeIndex + 1) % pizzas.length), [activeIndex, selectPizza]);
  const prev = useCallback(() => selectPizza((activeIndex - 1 + pizzas.length) % pizzas.length), [activeIndex, selectPizza]);

  const pizza = pizzas[activeIndex];

  return (
    <div className="app">
      {/* Left navigation arrow */}
      <button className="nav-arrow nav-arrow--left" onClick={prev} aria-label="Previous pizza">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right navigation arrow */}
      <button className="nav-arrow nav-arrow--right" onClick={next} aria-label="Next pizza">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Top content: title + description */}
      <div className="top-content">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pizza.id}
            custom={direction}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22,1,0.36,1] } }}
            exit={{ opacity: 0, y: -20, filter: 'blur(6px)', transition: { duration: 0.3 } }}
            className="pizza-text-block"
          >
            <h1 className="pizza-title">{pizza.title}</h1>
            <p className="pizza-description">{pizza.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom semicircle selector */}
      <div className="bottom-selector">
        <SemicircleSelector
          pizzas={pizzas}
          activeIndex={activeIndex}
          onSelect={selectPizza}
          direction={direction}
        />
      </div>
    </div>
  );
}

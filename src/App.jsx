import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { pizzas } from './data/pizzas';
import SemicircleSelector from './components/SemicircleSelector';
import Particles from './components/Particles';
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
      {/* Translucent pizza background decorations */}
      <div className="bg-pizza-decor">
        {/* Extra sticker: small pizza slice top-left */}
        <svg className="bg-sticker bg-sticker--tl" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 15 L100 95 Q60 108 20 95 Z" fill="rgba(255,200,80,0.05)" stroke="rgba(255,200,80,0.1)" strokeWidth="1" strokeLinejoin="round"/>
          <circle cx="55" cy="55" r="4" fill="rgba(200,60,30,0.07)"/>
          <circle cx="68" cy="65" r="3.5" fill="rgba(200,60,30,0.06)"/>
          <circle cx="50" cy="72" r="4.5" fill="rgba(200,60,30,0.07)"/>
          <circle cx="62" cy="78" r="3" fill="rgba(80,160,60,0.06)"/>
        </svg>

        {/* Extra sticker: small herb leaf mid-right */}
        <svg className="bg-sticker bg-sticker--mr" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 10 Q55 30 50 55 Q45 70 40 75 Q35 70 30 55 Q25 30 40 10Z" fill="rgba(80,160,60,0.06)" stroke="rgba(80,160,60,0.1)" strokeWidth="0.8"/>
          <path d="M40 15 L40 70" stroke="rgba(80,160,60,0.08)" strokeWidth="0.5"/>
          <path d="M40 30 L50 25" stroke="rgba(80,160,60,0.06)" strokeWidth="0.4"/>
          <path d="M40 42 L30 37" stroke="rgba(80,160,60,0.06)" strokeWidth="0.4"/>
          <path d="M40 54 L48 50" stroke="rgba(80,160,60,0.06)" strokeWidth="0.4"/>
        </svg>

        {/* Extra sticker: scattered dots / spices center-left */}
        <svg className="bg-sticker bg-sticker--cl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="30" r="2" fill="rgba(255,180,60,0.08)"/>
          <circle cx="50" cy="15" r="1.5" fill="rgba(255,180,60,0.06)"/>
          <circle cx="75" cy="40" r="2.5" fill="rgba(255,180,60,0.07)"/>
          <circle cx="35" cy="60" r="1.8" fill="rgba(200,60,30,0.06)"/>
          <circle cx="65" cy="70" r="2" fill="rgba(200,60,30,0.05)"/>
          <circle cx="80" cy="80" r="1.5" fill="rgba(255,180,60,0.06)"/>
          <circle cx="15" cy="80" r="2.2" fill="rgba(255,180,60,0.07)"/>
          <circle cx="45" cy="45" r="1.8" fill="rgba(200,60,30,0.05)"/>
          <circle cx="90" cy="20" r="1.2" fill="rgba(255,180,60,0.05)"/>
        </svg>

        {/* Extra sticker: whole pizza bottom-right */}
        <svg className="bg-sticker bg-sticker--br" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="48" fill="rgba(255,200,80,0.04)" stroke="rgba(255,200,80,0.1)" strokeWidth="1.2"/>
          <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,180,60,0.06)" strokeWidth="0.6"/>
          <line x1="60" y1="12" x2="60" y2="108" stroke="rgba(255,220,120,0.05)" strokeWidth="0.5"/>
          <line x1="12" y1="60" x2="108" y2="60" stroke="rgba(255,220,120,0.05)" strokeWidth="0.5"/>
          <line x1="26" y1="26" x2="94" y2="94" stroke="rgba(255,220,120,0.04)" strokeWidth="0.5"/>
          <line x1="94" y1="26" x2="26" y2="94" stroke="rgba(255,220,120,0.04)" strokeWidth="0.5"/>
          <circle cx="48" cy="45" r="4.5" fill="rgba(200,60,30,0.07)"/>
          <circle cx="72" cy="50" r="4" fill="rgba(200,60,30,0.06)"/>
          <circle cx="55" cy="68" r="5" fill="rgba(200,60,30,0.07)"/>
          <circle cx="68" cy="74" r="3.5" fill="rgba(200,60,30,0.06)"/>
          <circle cx="42" cy="58" r="3" fill="rgba(80,160,60,0.06)"/>
          <circle cx="75" cy="65" r="2.5" fill="rgba(80,160,60,0.05)"/>
        </svg>
      </div>

      {/* Golden sparks from the pizza */}
      <Particles />

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

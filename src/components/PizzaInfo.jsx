import { AnimatePresence, motion } from 'framer-motion';
import './components.css';

const infoVariants = {
  enter: (dir) => ({
    opacity: 0,
    y: dir > 0 ? 30 : -30,
    filter: 'blur(6px)',
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir) => ({
    opacity: 0,
    y: dir > 0 ? -30 : 30,
    filter: 'blur(6px)',
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

export default function PizzaInfo({ pizza, direction }) {
  return (
    <div className="pizza-info">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={pizza.id}
          custom={direction}
          variants={infoVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="pizza-info-inner"
        >
          <motion.span
            className="pizza-tag"
            style={{ borderColor: pizza.accent, color: pizza.accent }}
          >
            {pizza.tag}
          </motion.span>

          <h1 className="pizza-title">{pizza.title}</h1>

          <div className="pizza-divider" style={{ background: pizza.accent }} />

          <p className="pizza-description">{pizza.description}</p>

          <button
            className="order-btn"
            style={{
              '--btn-accent': pizza.accent,
            }}
          >
            <span>Order Now</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

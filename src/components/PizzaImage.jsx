import { motion, AnimatePresence } from 'framer-motion';
import './components.css';

const imgVariants = {
  enter: (dir) => ({
    opacity: 0,
    scale: 0.75,
    rotate: dir > 0 ? -15 : 15,
    filter: 'blur(8px)',
  }),
  center: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (dir) => ({
    opacity: 0,
    scale: 0.8,
    rotate: dir > 0 ? 15 : -15,
    filter: 'blur(8px)',
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

export default function PizzaImage({ pizza, direction }) {
  return (
    <div className="pizza-image-container">
      <div
        className="pizza-glow"
        style={{ '--pizza-accent': pizza.accent }}
      />
      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={pizza.id}
          src={pizza.image}
          alt={pizza.title}
          className="pizza-img"
          custom={direction}
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ '--pizza-accent': pizza.accent }}
          draggable={false}
          whileHover={{ scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        />
      </AnimatePresence>
    </div>
  );
}

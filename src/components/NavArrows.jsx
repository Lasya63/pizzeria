import './components.css';

export default function NavArrows({ onPrev, onNext }) {
  return (
    <div className="nav-arrows">
      <button
        className="nav-btn"
        onClick={onPrev}
        aria-label="Previous pizza"
        id="nav-prev"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        className="nav-btn"
        onClick={onNext}
        aria-label="Next pizza"
        id="nav-next"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

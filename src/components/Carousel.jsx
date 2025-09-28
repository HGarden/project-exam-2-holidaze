/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Carousel({ images = [], className = '' }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const hasImages = Array.isArray(images) && images.length > 0;

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const current = hasImages ? images[index] : null;
  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onKey(e) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [prev, next]);

  // Basic swipe support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    function onTouchStart(e){ startX = e.touches[0].clientX; }
    function onTouchEnd(e){
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 30) { dx > 0 ? prev() : next(); }
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [prev, next]);

  if (!hasImages) {
    return <div className={`bg-base-200 rounded-box ${className}`} style={{ minHeight: 200 }} />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative rounded-box overflow-hidden ${className}`}
      aria-roledescription="carousel"
      tabIndex={0}
    >
      <img
        key={index}
        src={current.url}
        alt={current.alt || 'Venue image'}
        className="w-full h-64 md:h-80 lg:h-96 object-cover pointer-events-none select-none"
        draggable={false}
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            className="btn btn-circle btn-sm absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-auto"
            onClick={prev}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
          >
            ❮
          </button>
          <button
            type="button"
            aria-label="Next image"
            className="btn btn-circle btn-sm absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-auto"
            onClick={next}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.preventDefault()}
          >
            ❯
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`btn btn-xs ${i === index ? 'btn-primary' : ''}`}
                aria-label={`Go to image ${i + 1}`}
                onClick={() => setIndex(i)}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

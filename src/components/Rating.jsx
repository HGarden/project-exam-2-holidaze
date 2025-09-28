/* eslint-disable react/prop-types */
export default function Rating({ value = 0, showValue = false, size = 'sm', className = '' }) {
  const rounded = Math.round(Number(value) || 0);
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const s = sizes[size] || sizes.sm;
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rating ${value} out of 5`}>
      {[1,2,3,4,5].map(n => (
        <svg key={n} className={`${s} ${n <= rounded ? 'text-amber-400' : 'text-base-content/30'}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
      {showValue && <span className="text-sm opacity-80">{Number(value).toFixed(1)}</span>}
    </div>
  );
}

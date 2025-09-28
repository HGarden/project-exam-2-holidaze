/* eslint-disable react/prop-types */
import { useEffect } from 'react';

export default function Toasts({ toasts, remove }) {
  useEffect(() => {
    const timers = toasts.map(t => setTimeout(() => remove(t.id), t.timeout || 3000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  return (
    <div className="toast toast-end z-50">
      {toasts.map(t => (
        <div key={t.id} className={`alert ${t.type === 'error' ? 'alert-error' : t.type === 'success' ? 'alert-success' : ''}`}>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

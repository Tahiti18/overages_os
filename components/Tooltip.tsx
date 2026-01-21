
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let top = 0;
    let left = 0;

    // We calculate the center of the trigger
    const triggerCenterX = rect.left + rect.width / 2 + scrollLeft;
    const triggerCenterY = rect.top + rect.height / 2 + scrollTop;

    switch (position) {
      case 'top':
        top = rect.top + scrollTop;
        left = triggerCenterX;
        break;
      case 'bottom':
        top = rect.bottom + scrollTop;
        left = triggerCenterX;
        break;
      case 'left':
        top = triggerCenterY;
        left = rect.left + scrollLeft;
        break;
      case 'right':
        top = triggerCenterY;
        left = rect.right + scrollLeft;
        break;
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      // Recalculate on scroll or resize to keep tooltip pinned
      window.addEventListener('scroll', calculatePosition, true);
      window.addEventListener('resize', calculatePosition);
    }
    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible]);

  const positionClasses = {
    top: '-translate-x-1/2 -translate-y-full mb-3',
    bottom: '-translate-x-1/2 mt-3',
    left: '-translate-x-full -translate-y-1/2 mr-3',
    right: '-translate-y-1/2 ml-3',
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-slate-900',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-slate-900',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-slate-900',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-slate-900',
  };

  return (
    <div 
      className="relative inline-block" 
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && createPortal(
        <div 
          ref={tooltipRef}
          className={`fixed z-[9999] w-52 p-3 bg-slate-900 text-white text-[10px] font-bold leading-relaxed rounded-xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200 pointer-events-none uppercase tracking-wider ${positionClasses[position]}`}
          style={{ 
            top: `${coords.top}px`, 
            left: `${coords.left}px` 
          }}
        >
          {content}
          <div className={`absolute border-4 border-transparent ${arrowClasses[position]}`}></div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Tooltip;

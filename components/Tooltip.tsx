
import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-slate-900',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-slate-900',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-slate-900',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-slate-900',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute z-[100] hidden group-hover:block w-52 p-3 bg-slate-900 text-white text-[10px] font-bold leading-relaxed rounded-xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200 pointer-events-none uppercase tracking-wider ${positionClasses[position]}`}>
        {content}
        <div className={`absolute border-4 border-transparent ${arrowClasses[position]}`}></div>
      </div>
    </div>
  );
};

export default Tooltip;

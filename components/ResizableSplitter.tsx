
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Theme } from '../App';

interface ResizableSplitterProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  initialLeftWidth?: number; // Percentage (0-100)
  minLeftWidth?: number; // Percentage
  maxLeftWidth?: number; // Percentage
  className?: string;
  theme: Theme;
}

export const ResizableSplitter: React.FC<ResizableSplitterProps> = ({
  leftContent,
  rightContent,
  initialLeftWidth = 20,
  minLeftWidth = 10,
  maxLeftWidth = 80,
  className = "",
  theme,
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.classList.add('is-dragging');
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth);
    
    setLeftWidth(clampedWidth);
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove('is-dragging');
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const isDark = theme === 'dark';
  const handleColor = isDark ? 'bg-[#1e1e1e]' : 'bg-[#e5e5e5]';

  return (
    <div 
      ref={containerRef} 
      className={`flex w-full h-full overflow-hidden ${className}`}
    >
      {/* Left Pane */}
      <div 
        style={{ width: `${leftWidth}%` }} 
        className="h-full shrink-0 overflow-hidden relative"
      >
        {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}
        <div className="w-full h-full overflow-hidden flex flex-col">
          {leftContent}
        </div>
      </div>

      {/* Resizer Handle */}
      <div
        className={`w-[1px] hover:w-[2px] h-full cursor-col-resize flex items-center justify-center shrink-0 z-40 relative group transition-all delay-75
            ${isDragging ? 'bg-blue-500 w-[2px]' : `${handleColor} hover:bg-blue-400`}`}
        onMouseDown={handleMouseDown}
      >
        {/* Invisible hit area */}
        <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
      </div>

      {/* Right Pane */}
      <div className="flex-1 h-full overflow-hidden relative min-w-0">
         {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}
         <div className="w-full h-full overflow-hidden flex flex-col">
          {rightContent}
         </div>
      </div>
    </div>
  );
};

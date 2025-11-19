import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ResizableSplitterProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  initialLeftWidth?: number; // Percentage (0-100)
  minLeftWidth?: number; // Percentage
  maxLeftWidth?: number; // Percentage
  className?: string;
}

export const ResizableSplitter: React.FC<ResizableSplitterProps> = ({
  leftContent,
  rightContent,
  initialLeftWidth = 30,
  minLeftWidth = 10,
  maxLeftWidth = 80,
  className = "",
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handler to start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.classList.add('is-dragging');
  }, []);

  // Handler for dragging movement (attached to document)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Clamp the width between min and max
    const clampedWidth = Math.min(Math.max(newLeftWidth, minLeftWidth), maxLeftWidth);
    
    setLeftWidth(clampedWidth);
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  // Handler to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove('is-dragging');
  }, []);

  // Attach global event listeners when dragging starts
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
        {/* Overlay to catch mouse events over iframes/heavy content during drag */}
        {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}
        <div className="w-full h-full overflow-auto custom-scrollbar">
          {leftContent}
        </div>
      </div>

      {/* Resizer Handle */}
      <div
        className={`w-1 hover:w-1.5 h-full cursor-col-resize flex items-center justify-center shrink-0 z-40 transition-all duration-150 relative group ${
          isDragging ? 'bg-blue-500 w-1.5' : 'bg-neutral-800 hover:bg-blue-400'
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Invisible hit area for easier grabbing */}
        <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
        
        {/* Visual Grip indicator (optional) */}
        <div className={`h-8 w-0.5 rounded-full bg-neutral-600 group-hover:bg-white transition-colors ${isDragging ? 'bg-white' : ''}`} />
      </div>

      {/* Right Pane */}
      <div className="flex-1 h-full overflow-hidden relative min-w-0">
         {/* Overlay to catch mouse events during drag */}
         {isDragging && <div className="absolute inset-0 z-50 bg-transparent" />}
         <div className="w-full h-full overflow-auto custom-scrollbar">
          {rightContent}
         </div>
      </div>
    </div>
  );
};
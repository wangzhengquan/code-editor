
import React, { useMemo } from 'react';
import { FileNode } from '../data/fileSystem';
import { CloseIcon, FileIcon } from './Icons';

interface EditorProps {
  activeFile: FileNode | null;
  openFiles: FileNode[];
  onCloseFile: (e: React.MouseEvent, fileId: string) => void;
  onSwitchFile: (fileId: string) => void;
}

// Simple syntax highlighting helper
const highlightSyntax = (code: string, language?: string) => {
    if (!code) return <span />;
    
    const lines = code.split('\n');
    
    return lines.map((line, i) => {
        // Very basic tokenization regexes for demo purposes
        let formattedLine: React.ReactNode[] = [];
        let remaining = line;
        
        // Split by spaces and symbols loosely to colorize keywords
        // This is NOT a real parser, just a visual approximation for the demo
        const parts = line.split(/([ (){}.,:;<>=])/);
        
        const nodes = parts.map((part, idx) => {
            let colorClass = "text-[#d4d4d4]"; // Default VSCode light text
            
            if (['import', 'export', 'const', 'let', 'var', 'function', 'return', 'interface', 'type', 'from'].includes(part)) {
                colorClass = "text-[#c586c0]"; // Purple keywords
            } else if (['React', 'useState', 'useEffect', 'FC'].includes(part)) {
                colorClass = "text-[#4ec9b0]"; // Teal classes/types
            } else if (part.startsWith("'") || part.startsWith('"') || part.startsWith('`')) {
                colorClass = "text-[#ce9178]"; // Orange strings
            } else if (!isNaN(Number(part)) && part.trim() !== '') {
                colorClass = "text-[#b5cea8]"; // Light green numbers
            } else if (['true', 'false', 'null', 'undefined'].includes(part)) {
                colorClass = "text-[#569cd6]"; // Blue booleans
            } else if (['=>', '=', '===', ':', '{', '}'].includes(part)) {
                colorClass = "text-[#d4d4d4]"; // Symbols
            } else if (part.match(/^[A-Z][a-zA-Z0-9]*$/) && language === 'typescript') {
                colorClass = "text-[#4ec9b0]"; // Likely component/class
            } else if (part.match(/^[a-z][a-zA-Z0-9]*$/) && idx > 0 && parts[idx-1] === 'const') {
                 colorClass = "text-[#9cdcfe]"; // Variable def
            }

            // Comments (Override)
            if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
                 return <span key={idx} className="text-[#6a9955]">{part}</span>;
            }

            return <span key={idx} className={colorClass}>{part}</span>;
        });
        
        return (
            <div key={i} className="flex leading-6 hover:bg-white/5">
                <div className="w-12 shrink-0 text-right pr-4 text-[#858585] select-none text-xs py-[2px]">{i + 1}</div>
                <div className="font-mono text-[13px] py-[2px] whitespace-pre text-[#d4d4d4]">
                    {nodes}
                </div>
            </div>
        );
    });
};

export const Editor: React.FC<EditorProps> = ({ activeFile, openFiles, onCloseFile, onSwitchFile }) => {
  
  const content = useMemo(() => {
    if (!activeFile) return null;
    return highlightSyntax(activeFile.content || "", activeFile.language);
  }, [activeFile]);

  if (openFiles.length === 0) {
    return (
        <div className="h-full w-full bg-[#1e1e1e] flex flex-col items-center justify-center text-neutral-500">
            <div className="mb-4 opacity-20">
                <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            </div>
            <p className="text-sm">Select a file to start editing</p>
            <p className="text-xs mt-2 opacity-60">VS Code Clone Demo</p>
        </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] h-full w-full flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex bg-[#252526] overflow-x-auto scrollbar-hide h-9">
        {openFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => onSwitchFile(file.id)}
            className={`
              group px-3 min-w-[120px] max-w-[200px] border-r border-[#1e1e1e] text-xs flex items-center gap-2 cursor-pointer select-none
              ${activeFile?.id === file.id 
                ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' 
                : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2d2e] border-t-2 border-t-transparent'}
            `}
          >
            <span className="shrink-0 opacity-80">
                <FileIcon ext={file.name.split('.').pop() || ''} />
            </span>
            <span className="truncate flex-1">{file.name}</span>
            <span 
                onClick={(e) => onCloseFile(e, file.id)}
                className={`p-0.5 rounded-md hover:bg-neutral-700 opacity-0 group-hover:opacity-100 ${activeFile?.id === file.id ? 'opacity-100' : ''}`}
            >
               <CloseIcon />
            </span>
          </div>
        ))}
      </div>

      {/* Breadcrumbs */}
      {activeFile && (
         <div className="h-6 bg-[#1e1e1e] flex items-center px-4 text-xs text-neutral-500 shrink-0">
            src <span className="mx-1">›</span> ... <span className="mx-1">›</span> {activeFile.name}
         </div>
      )}

      {/* Code Area */}
      <div className="flex-1 overflow-auto p-2 custom-scrollbar bg-[#1e1e1e] relative">
        {content}
        <div className="h-[50vh]"></div> {/* Extra scroll space at bottom */}
      </div>
    </div>
  );
};

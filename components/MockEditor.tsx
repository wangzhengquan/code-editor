
import React, { useMemo, useState, useEffect } from 'react';
import { FileNode } from '../data/fileSystem';
import { CloseIcon, FileIcon } from './Icons';
import { Theme } from '../App';

interface EditorProps {
  activeFile: FileNode | null;
  openFiles: FileNode[];
  onCloseFile: (e: React.MouseEvent, fileId: string) => void;
  onSwitchFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  theme: Theme;
}

// Syntax highlighting helper with theme support
const highlightSyntax = (code: string, language?: string, theme: Theme = 'dark') => {
    if (!code) return <span />;
    
    const lines = code.split('\n');
    const isDark = theme === 'dark';
    
    return lines.map((line, i) => {
        let formattedLine: React.ReactNode[] = [];
        const parts = line.split(/([ (){}.,:;<>=])/);
        
        const nodes = parts.map((part, idx) => {
            // Default Text
            let colorClass = isDark ? "text-[#d4d4d4]" : "text-[#333333]"; 
            
            if (['import', 'export', 'const', 'let', 'var', 'function', 'return', 'interface', 'type', 'from'].includes(part)) {
                colorClass = isDark ? "text-[#c586c0]" : "text-[#af00db]"; // Purple
            } else if (['React', 'useState', 'useEffect', 'FC'].includes(part)) {
                colorClass = isDark ? "text-[#4ec9b0]" : "text-[#267f99]"; // Teal
            } else if (part.startsWith("'") || part.startsWith('"') || part.startsWith('`')) {
                colorClass = isDark ? "text-[#ce9178]" : "text-[#a31515]"; // Red/Orange
            } else if (!isNaN(Number(part)) && part.trim() !== '') {
                colorClass = isDark ? "text-[#b5cea8]" : "text-[#098658]"; // Green/Light Green
            } else if (['true', 'false', 'null', 'undefined'].includes(part)) {
                colorClass = isDark ? "text-[#569cd6]" : "text-[#0000ff]"; // Blue
            } else if (['=>', '=', '===', ':', '{', '}'].includes(part)) {
                colorClass = isDark ? "text-[#d4d4d4]" : "text-[#333333]"; // Symbols
            } else if (part.match(/^[A-Z][a-zA-Z0-9]*$/) && language === 'typescript') {
                colorClass = isDark ? "text-[#4ec9b0]" : "text-[#267f99]"; // Components
            } else if (part.match(/^[a-z][a-zA-Z0-9]*$/) && idx > 0 && parts[idx-1] === 'const') {
                 colorClass = isDark ? "text-[#9cdcfe]" : "text-[#001080]"; // Variable def
            }

            // Comments (Override)
            if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
                 return <span key={idx} className={isDark ? "text-[#6a9955]" : "text-[#008000]"}>{part}</span>;
            }

            return <span key={idx} className={colorClass}>{part}</span>;
        });
        
        return (
            <div key={i} className="h-6 px-4 whitespace-pre">
                {nodes}
            </div>
        );
    });
};

export const Editor: React.FC<EditorProps> = ({ activeFile, openFiles, onCloseFile, onSwitchFile, updateFileContent, theme }) => {
  const [content, setContent] = useState(activeFile?.content || "");
  const isDark = theme === 'dark';

  useEffect(() => {
     setContent(activeFile?.content || "");
  }, [activeFile]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setContent(newContent);
      if (activeFile) {
          updateFileContent(activeFile.id, newContent);
      }
  };

  // Background colors
  const containerBg = isDark ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]';
  const tabBg = isDark ? 'bg-[#252526]' : 'bg-[#f3f3f3]';
  const activeTabBg = isDark ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]';
  const inactiveTabBg = isDark ? 'bg-[#2d2d2d]' : 'bg-[#ececec]';
  const tabText = isDark ? 'text-[#969696]' : 'text-[#616161]';
  const activeTabText = isDark ? 'text-white' : 'text-[#333333]';
  const lineNumberColor = isDark ? 'text-[#858585]' : 'text-[#237893]';
  const breadcrumbBg = isDark ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]';
  const breadcrumbText = isDark ? 'text-neutral-500' : 'text-neutral-600';
  const emptyStateText = isDark ? 'text-neutral-500' : 'text-neutral-400';

  const highlightedContent = useMemo(() => {
    return highlightSyntax(content, activeFile?.language, theme);
  }, [content, activeFile, theme]);

  // Line numbers
  const lineNumbers = useMemo(() => {
      return content.split('\n').map((_, i) => (
          <div key={i} className={`h-6 text-right pr-4 select-none text-xs leading-6 ${lineNumberColor}`}>
              {i + 1}
          </div>
      ));
  }, [content, lineNumberColor]);

  if (openFiles.length === 0) {
    return (
        <div className={`h-full w-full ${containerBg} flex flex-col items-center justify-center ${emptyStateText} transition-colors duration-200`}>
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
    <div className={`${containerBg} h-full w-full flex flex-col overflow-hidden transition-colors duration-200`}>
      {/* Tabs */}
      <div className={`flex ${tabBg} overflow-x-auto scrollbar-hide h-9 transition-colors duration-200`}>
        {openFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => onSwitchFile(file.id)}
            className={`
              group px-3 min-w-[120px] max-w-[200px] border-r ${isDark ? 'border-[#1e1e1e]' : 'border-[#e5e5e5]'} text-xs flex items-center gap-2 cursor-pointer select-none transition-colors
              ${activeFile?.id === file.id 
                ? `${activeTabBg} ${activeTabText} border-t-2 border-t-blue-500` 
                : `${inactiveTabBg} ${tabText} hover:${activeTabBg} border-t-2 border-t-transparent`}
            `}
          >
            <span className="shrink-0 opacity-80">
                <FileIcon ext={file.name.split('.').pop() || ''} />
            </span>
            <span className="truncate flex-1">{file.name}</span>
            <span 
                onClick={(e) => onCloseFile(e, file.id)}
                className={`p-0.5 rounded-md opacity-0 group-hover:opacity-100 ${isDark ? 'hover:bg-neutral-700' : 'hover:bg-neutral-300'} ${activeFile?.id === file.id ? 'opacity-100' : ''}`}
            >
               <CloseIcon />
            </span>
          </div>
        ))}
      </div>

      {/* Breadcrumbs */}
      {activeFile && (
         <div className={`h-6 ${breadcrumbBg} flex items-center px-4 text-xs ${breadcrumbText} shrink-0 transition-colors duration-200`}>
            src <span className="mx-1">›</span> ... <span className="mx-1">›</span> {activeFile.name}
         </div>
      )}

      {/* Code Area with Overlay Technique */}
      <div className={`flex-1 relative overflow-auto custom-scrollbar ${containerBg}`}>
         <div className="flex min-h-full relative">
            {/* Line Numbers */}
            <div className={`w-12 shrink-0 py-2 ${containerBg} sticky left-0 z-10`}>
                {lineNumbers}
            </div>

            {/* Editor Content Stack */}
            <div className="flex-1 relative font-mono text-[13px]">
                {/* Bottom Layer: Syntax Highlighting */}
                <div className="absolute inset-0 py-2 pointer-events-none z-0">
                    {highlightedContent}
                </div>

                {/* Top Layer: Transparent Input for Editing */}
                <textarea 
                    value={content}
                    onChange={handleChange}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-blue-500 resize-none outline-none p-0 py-2 px-4 leading-6 overflow-hidden z-10 font-mono text-[13px]"
                    style={{ whiteSpace: 'pre' }}
                />
            </div>
         </div>
      </div>
    </div>
  );
};

import React from 'react';

// Simple Icon components
const FolderIcon = () => (
  <svg className="w-4 h-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

const FileIcon = ({ ext }: { ext: string }) => {
  let color = "text-neutral-400";
  if (ext === 'tsx') color = "text-blue-300";
  if (ext === 'css') color = "text-sky-300";
  if (ext === 'json') color = "text-yellow-300";
  if (ext === 'html') color = "text-orange-400";

  return (
    <svg className={`w-4 h-4 ${color} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
};

const FileItem = ({ name, ext, active = false, level = 0 }: { name: string; ext?: string; active?: boolean; level: number }) => (
  <div 
    className={`flex items-center px-2 py-1.5 text-sm cursor-pointer transition-colors border-l-2
      ${active ? 'bg-neutral-800 text-white border-blue-500' : 'border-transparent text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'}
    `}
    style={{ paddingLeft: `${level * 12 + 8}px` }}
  >
    {ext ? <FileIcon ext={ext} /> : <FolderIcon />}
    <span className="truncate">{name}</span>
  </div>
);

export const FileExplorer: React.FC = () => {
  return (
    <div className="bg-neutral-900 min-h-full w-full py-2">
      <div className="px-4 py-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Explorer</div>
      
      <div className="flex flex-col">
        <FileItem name="src" level={0} />
        <FileItem name="components" level={1} />
        <FileItem name="Splitter.tsx" ext="tsx" level={2} active />
        <FileItem name="Button.tsx" ext="tsx" level={2} />
        <FileItem name="Header.tsx" ext="tsx" level={2} />
        <FileItem name="hooks" level={1} />
        <FileItem name="useResize.ts" ext="tsx" level={2} />
        <FileItem name="App.tsx" ext="tsx" level={1} />
        <FileItem name="index.tsx" ext="tsx" level={1} />
        <FileItem name="index.css" ext="css" level={1} />
        <FileItem name="public" level={0} />
        <FileItem name="index.html" ext="html" level={1} />
        <FileItem name="package.json" ext="json" level={0} />
        <FileItem name="tsconfig.json" ext="json" level={0} />
        <FileItem name="README.md" ext="txt" level={0} />
      </div>
    </div>
  );
};
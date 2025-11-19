
import React from 'react';
import { FileNode } from '../data/fileSystem';
import { ChevronRightIcon, ChevronDownIcon, FileIcon, FolderIcon } from './Icons';
import { Theme } from '../App';

interface FileExplorerProps {
  files: FileNode[];
  activeFileId: string | null;
  onFileClick: (file: FileNode) => void;
  onFolderToggle: (folderId: string) => void;
  theme: Theme;
}

const FileSystemItem: React.FC<{
  node: FileNode;
  level: number;
  activeFileId: string | null;
  onFileClick: (file: FileNode) => void;
  onFolderToggle: (folderId: string) => void;
  theme: Theme;
}> = ({ node, level, activeFileId, onFileClick, onFolderToggle, theme }) => {
  const isFolder = node.type === 'folder';
  const isActive = activeFileId === node.id;
  const isDark = theme === 'dark';

  // Dynamic styles based on theme
  const activeClass = isDark ? 'bg-[#37373d] text-white' : 'bg-[#e4e6f1] text-[#333333]';
  const inactiveClass = isDark 
    ? 'text-neutral-400 hover:bg-[#2a2d2e] hover:text-neutral-200' 
    : 'text-neutral-600 hover:bg-[#e8e8e8] hover:text-black';
  const chevronColor = isDark ? 'text-neutral-400' : 'text-neutral-500';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      onFolderToggle(node.id);
    } else {
      onFileClick(node);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer select-none text-sm transition-colors
          ${isActive ? activeClass : inactiveClass}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {isFolder && (
          <span className={`mr-1 ${chevronColor}`}>
            {node.isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </span>
        )}
        {!isFolder && <span className="w-4 mr-1" />} {/* Spacer for files to align with folders */}
        
        {isFolder ? <FolderIcon /> : <FileIcon ext={node.name.split('.').pop() || ''} />}
        <span className="truncate">{node.name}</span>
      </div>
      
      {isFolder && node.isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileSystemItem
              key={child.id}
              node={child}
              level={level + 1}
              activeFileId={activeFileId}
              onFileClick={onFileClick}
              onFolderToggle={onFolderToggle}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFileId, onFileClick, onFolderToggle, theme }) => {
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#252526]' : 'bg-[#f3f3f3]';
  const headerTextClass = isDark ? 'text-neutral-500' : 'text-neutral-600';

  return (
    <div className={`${bgClass} h-full w-full flex flex-col text-sm transition-colors duration-200`}>
      <div className={`h-9 px-4 flex items-center text-xs font-bold ${headerTextClass} uppercase tracking-wider shrink-0`}>
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="pb-2">
            {files.map((node) => (
            <FileSystemItem
                key={node.id}
                node={node}
                level={0}
                activeFileId={activeFileId}
                onFileClick={onFileClick}
                onFolderToggle={onFolderToggle}
                theme={theme}
            />
            ))}
         </div>
      </div>
    </div>
  );
};

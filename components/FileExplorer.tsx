
import React, { useState, useEffect, useRef } from 'react';
import { FileNode } from '../data/fileSystem';
import { ChevronRightIcon, ChevronDownIcon, FileIcon, FolderIcon } from './Icons';
import { Theme } from '../App';

interface FileExplorerProps {
  files: FileNode[];
  activeFileId: string | null;
  onFileClick: (file: FileNode) => void;
  onFolderToggle: (folderId: string) => void;
  onCreateNode: (parentId: string, type: 'file' | 'folder', name: string) => void;
  onDeleteNode: (nodeId: string) => void;
  theme: Theme;
}

interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string;
  nodeType: 'file' | 'folder';
  parentId: string | null;
}

const FileSystemItem: React.FC<{
  node: FileNode;
  level: number;
  activeFileId: string | null;
  onFileClick: (file: FileNode) => void;
  onFolderToggle: (folderId: string) => void;
  onContextMenu: (e: React.MouseEvent, node: FileNode, parentId: string | null) => void;
  theme: Theme;
  parentId: string | null;
}> = ({ node, level, activeFileId, onFileClick, onFolderToggle, onContextMenu, theme, parentId }) => {
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, node, parentId);
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer select-none text-sm transition-colors
          ${isActive ? activeClass : inactiveClass}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
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
              parentId={node.id} // Pass current node as parent for children
              level={level + 1}
              activeFileId={activeFileId}
              onFileClick={onFileClick}
              onFolderToggle={onFolderToggle}
              onContextMenu={onContextMenu}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
    files, 
    activeFileId, 
    onFileClick, 
    onFolderToggle, 
    onCreateNode,
    onDeleteNode,
    theme 
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#252526]' : 'bg-[#f3f3f3]';
  const headerTextClass = isDark ? 'text-neutral-500' : 'text-neutral-600';

  // Close context menu on click outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
              setContextMenu(null);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, node: FileNode, parentId: string | null) => {
      setContextMenu({
          x: e.clientX,
          y: e.clientY,
          nodeId: node.id,
          nodeType: node.type,
          parentId: parentId
      });
  };

  const handleAction = (action: 'newFile' | 'newFolder' | 'delete') => {
      if (!contextMenu) return;

      if (action === 'delete') {
          if (confirm('Are you sure you want to delete this item?')) {
              onDeleteNode(contextMenu.nodeId);
          }
      } else {
          // For creation, determine the target folder
          // If we clicked a folder, add inside it.
          // If we clicked a file, add to its parent.
          let targetFolderId = contextMenu.nodeId;
          
          if (contextMenu.nodeType === 'file') {
               if (!contextMenu.parentId) {
                   console.error("Cannot create sibling for root file without parent ID tracking");
                   setContextMenu(null);
                   return;
               }
               targetFolderId = contextMenu.parentId;
          }

          const name = prompt(`Enter ${action === 'newFile' ? 'file' : 'folder'} name:`);
          if (name) {
              onCreateNode(targetFolderId, action === 'newFile' ? 'file' : 'folder', name);
          }
      }
      setContextMenu(null);
  };

  return (
    <div className={`${bgClass} h-full w-full flex flex-col text-sm transition-colors duration-200 relative`}>
      <div className={`h-9 px-4 flex items-center text-xs font-bold ${headerTextClass} uppercase tracking-wider shrink-0`}>
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar" onContextMenu={(e) => e.preventDefault()}>
         <div className="pb-2">
            {files.map((node) => (
            <FileSystemItem
                key={node.id}
                node={node}
                parentId={null} // Root nodes have no parent ID in this context, or 'root' if we consider the wrapper
                level={0}
                activeFileId={activeFileId}
                onFileClick={onFileClick}
                onFolderToggle={onFolderToggle}
                onContextMenu={handleContextMenu}
                theme={theme}
            />
            ))}
         </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
          <div 
            ref={menuRef}
            className={`fixed z-50 w-40 shadow-xl rounded-md border py-1 text-sm ${
                isDark 
                ? 'bg-[#252526] border-[#454545] text-[#cccccc]' 
                : 'bg-white border-neutral-200 text-neutral-700'
            }`}
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
              <div 
                className={`px-3 py-1.5 cursor-pointer flex items-center ${isDark ? 'hover:bg-[#094771] hover:text-white' : 'hover:bg-[#0060c0] hover:text-white'}`}
                onClick={() => handleAction('newFile')}
              >
                  New File
              </div>
              <div 
                className={`px-3 py-1.5 cursor-pointer flex items-center ${isDark ? 'hover:bg-[#094771] hover:text-white' : 'hover:bg-[#0060c0] hover:text-white'}`}
                onClick={() => handleAction('newFolder')}
              >
                  New Folder
              </div>
              <div className={`h-[1px] my-1 ${isDark ? 'bg-[#454545]' : 'bg-neutral-200'}`}></div>
              <div 
                className={`px-3 py-1.5 cursor-pointer flex items-center ${isDark ? 'hover:bg-[#094771] hover:text-white' : 'hover:bg-[#0060c0] hover:text-white'}`}
                onClick={() => handleAction('delete')}
              >
                  Delete
              </div>
          </div>
      )}
    </div>
  );
};

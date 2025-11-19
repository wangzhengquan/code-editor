
import React, { useState, useCallback } from 'react';
import { ResizableSplitter } from './components/ResizableSplitter';
import { FileExplorer } from './components/FileExplorer';
import { Editor } from './components/MockEditor';
import { ActivityBar } from './components/ActivityBar';
import { initialFileSystem, FileNode } from './data/fileSystem';

export type Theme = 'light' | 'dark';

// Helper to recursively toggle folder state
const toggleFolderInTree = (nodes: FileNode[], folderId: string): FileNode[] => {
  return nodes.map(node => {
    if (node.id === folderId) {
      return { ...node, isOpen: !node.isOpen };
    }
    if (node.children) {
      return { ...node, children: toggleFolderInTree(node.children, folderId) };
    }
    return node;
  });
};

// Helper to recursively update file content
const updateFileContentInTree = (nodes: FileNode[], fileId: string, newContent: string): FileNode[] => {
  return nodes.map(node => {
    if (node.id === fileId) {
      return { ...node, content: newContent };
    }
    if (node.children) {
      return { ...node, children: updateFileContentInTree(node.children, fileId, newContent) };
    }
    return node;
  });
};

// Helper to add a node to a specific parent
const addNodeToTree = (nodes: FileNode[], parentId: string, newNode: FileNode): FileNode[] => {
  return nodes.map(node => {
    if (node.id === parentId && node.type === 'folder') {
      return { 
        ...node, 
        isOpen: true, // Auto open folder when adding content
        children: [...(node.children || []), newNode].sort((a, b) => {
            // Sort folders first, then files
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
        })
      };
    }
    if (node.children) {
      return { ...node, children: addNodeToTree(node.children, parentId, newNode) };
    }
    return node;
  });
};

// Helper to delete a node
const deleteNodeFromTree = (nodes: FileNode[], nodeId: string): FileNode[] => {
  return nodes
    .filter(node => node.id !== nodeId)
    .map(node => {
      if (node.children) {
        return { ...node, children: deleteNodeFromTree(node.children, nodeId) };
      }
      return node;
    });
};

const App: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>(initialFileSystem);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Handle clicking a file in explorer
  const handleFileClick = useCallback((file: FileNode) => {
    // Add to open files if not present
    if (!openFiles.find(f => f.id === file.id)) {
      setOpenFiles(prev => [...prev, file]);
    }
    setActiveFile(file);
  }, [openFiles]);

  // Handle toggling folder
  const handleFolderToggle = useCallback((folderId: string) => {
    setFiles(prev => toggleFolderInTree(prev, folderId));
  }, []);

  // Handle closing a tab
  const handleCloseFile = useCallback((e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    
    const newOpenFiles = openFiles.filter(f => f.id !== fileId);
    setOpenFiles(newOpenFiles);

    // If we closed the active file, switch to the last one, or null
    if (activeFile?.id === fileId) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  }, [openFiles, activeFile]);

  // Handle tab switch
  const handleSwitchFile = useCallback((fileId: string) => {
    const file = openFiles.find(f => f.id === fileId);
    if (file) setActiveFile(file);
  }, [openFiles]);

  // Handle content update
  const handleUpdateContent = useCallback((fileId: string, content: string) => {
      setFiles(prev => updateFileContentInTree(prev, fileId, content));
      setActiveFile(prev => prev && prev.id === fileId ? { ...prev, content } : prev);
  }, []);

  // Handle creating a new file/folder
  const handleCreateNode = useCallback((parentId: string, type: 'file' | 'folder', name: string) => {
      const newNode: FileNode = {
          id: `${name}-${Date.now()}`,
          name: name,
          type: type,
          children: type === 'folder' ? [] : undefined,
          content: type === 'file' ? '' : undefined,
          language: type === 'file' ? (name.split('.').pop() === 'ts' || name.split('.').pop() === 'tsx' ? 'typescript' : 'text') : undefined
      };
      setFiles(prev => addNodeToTree(prev, parentId, newNode));
  }, []);

  // Handle deleting a node
  const handleDeleteNode = useCallback((nodeId: string) => {
      setFiles(prev => deleteNodeFromTree(prev, nodeId));
      // Close if it was open
      setOpenFiles(prev => prev.filter(f => f.id !== nodeId));
      if (activeFile?.id === nodeId) {
          setActiveFile(null);
      }
  }, [activeFile]);

  const isDark = theme === 'dark';
  const mainBg = isDark ? 'bg-[#1e1e1e]' : 'bg-[#ffffff]';
  const textColor = isDark ? 'text-[#cccccc]' : 'text-[#333333]';
  const titleBarBg = isDark ? 'bg-[#3c3c3c]' : 'bg-[#dddddd]';
  const titleBarText = isDark ? 'text-[#cccccc]' : 'text-[#333333]';

  return (
    <div className={`h-screen w-full ${mainBg} ${textColor} flex flex-col overflow-hidden font-sans transition-colors duration-200`}>
      {/* Title Bar (Fake) */}
      <div className={`h-8 ${titleBarBg} ${titleBarText} flex items-center justify-center relative text-xs select-none shrink-0 transition-colors duration-200`}>
        <div className="absolute left-2 flex items-center gap-2">
           {/* Mac-style buttons */}
           <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80"></div>
           <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80"></div>
           <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80"></div>
        </div>
        <span className="opacity-80">{activeFile ? `${activeFile.name} - VSCode Clone` : 'VSCode Clone'}</span>
      </div>

      {/* Main Body: ActivityBar + Splitter */}
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar theme={theme} onToggleTheme={toggleTheme} />
        
        <div className="flex-1 relative">
            <ResizableSplitter
            initialLeftWidth={20}
            minLeftWidth={10}
            maxLeftWidth={40}
            className={mainBg}
            theme={theme}
            leftContent={
                <FileExplorer 
                    files={files} 
                    activeFileId={activeFile?.id || null}
                    onFileClick={handleFileClick}
                    onFolderToggle={handleFolderToggle}
                    onCreateNode={handleCreateNode}
                    onDeleteNode={handleDeleteNode}
                    theme={theme}
                />
            }
            rightContent={
                <Editor 
                    activeFile={activeFile}
                    openFiles={openFiles}
                    onCloseFile={handleCloseFile}
                    onSwitchFile={handleSwitchFile}
                    updateFileContent={handleUpdateContent}
                    theme={theme}
                />
            }
            />
        </div>
      </div>
      
      {/* Status Bar */}
      <footer className="h-6 bg-[#007acc] text-white text-[11px] flex items-center px-3 justify-between shrink-0 z-50 transition-colors duration-200">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
             <span>main*</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
            <span>0 errors</span>
            <span>0 warnings</span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {activeFile && (
             <span className="cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
                Ln {activeFile.content ? activeFile.content.split('\n').length : 1}, Col 1
             </span>
          )}
          <span className="cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">UTF-8</span>
          <span className="cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
              {activeFile?.language === 'typescript' ? 'TypeScript JSX' : 'Plain Text'}
          </span>
          <span className="cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">Prettier</span>
        </div>
      </footer>
    </div>
  );
};

export default App;

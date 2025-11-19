
import React, { useState, useCallback } from 'react';
import { ResizableSplitter } from './components/ResizableSplitter';
import { FileExplorer } from './components/FileExplorer';
import { Editor } from './components/MockEditor'; // Note: We renamed component in file but keeping filename for update consistency
import { ActivityBar } from './components/ActivityBar';
import { initialFileSystem, FileNode } from './data/fileSystem';

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

const App: React.FC = () => {
  const [files, setFiles] = useState<FileNode[]>(initialFileSystem);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);

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

  return (
    <div className="h-screen w-full bg-[#1e1e1e] text-[#cccccc] flex flex-col overflow-hidden font-sans">
      {/* Title Bar (Fake) */}
      <div className="h-8 bg-[#3c3c3c] flex items-center justify-center relative text-xs select-none shrink-0">
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
        <ActivityBar />
        
        <div className="flex-1 relative">
            <ResizableSplitter
            initialLeftWidth={20}
            minLeftWidth={10}
            maxLeftWidth={40}
            className="bg-[#1e1e1e]"
            leftContent={
                <FileExplorer 
                    files={files} 
                    activeFileId={activeFile?.id || null}
                    onFileClick={handleFileClick}
                    onFolderToggle={handleFolderToggle}
                />
            }
            rightContent={
                <Editor 
                    activeFile={activeFile}
                    openFiles={openFiles}
                    onCloseFile={handleCloseFile}
                    onSwitchFile={handleSwitchFile}
                />
            }
            />
        </div>
      </div>
      
      {/* Status Bar */}
      <footer className="h-6 bg-[#007acc] text-white text-[11px] flex items-center px-3 justify-between shrink-0 z-50">
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
                Ln 1, Col 1
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

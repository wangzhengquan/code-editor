import React from 'react';
import { ResizableSplitter } from './components/ResizableSplitter';
import { FileExplorer } from './components/FileExplorer';
import { MockEditor } from './components/MockEditor';

const App: React.FC = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-200 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="h-12 border-b border-neutral-800 flex items-center px-4 bg-neutral-900 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
        </div>
        <span className="ml-4 text-sm font-medium text-neutral-400">Project: Splitter Demo</span>
      </header>

      {/* Main Content with Splitter */}
      <div className="flex-1 overflow-hidden relative">
        <ResizableSplitter
          initialLeftWidth={20}
          minLeftWidth={10}
          maxLeftWidth={50}
          leftContent={<FileExplorer />}
          rightContent={<MockEditor />}
        />
      </div>
      
      {/* Status Bar */}
      <footer className="h-6 bg-neutral-800 border-t border-neutral-700 text-xs flex items-center px-3 text-neutral-400 justify-between shrink-0">
        <div className="flex gap-3">
          <span>main*</span>
          <span>0 errors</span>
          <span>0 warnings</span>
        </div>
        <div className="flex gap-3">
          <span>TypeScript React</span>
          <span>UTF-8</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
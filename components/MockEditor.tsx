import React from 'react';

const CodeLine = ({ num, content, indent = 0 }: { num: number; content: React.ReactNode; indent?: number }) => (
  <div className="flex hover:bg-neutral-800/50 leading-6">
    <div className="w-12 shrink-0 text-right pr-4 text-neutral-600 select-none text-xs py-1">{num}</div>
    <div className="font-mono text-sm py-1 text-neutral-300 whitespace-pre" style={{ paddingLeft: `${indent * 20}px` }}>
      {content}
    </div>
  </div>
);

export const MockEditor: React.FC = () => {
  return (
    <div className="bg-[#1e1e1e] h-full w-full flex flex-col">
      {/* Tabs */}
      <div className="flex bg-neutral-900 overflow-x-auto scrollbar-hide">
        <div className="px-4 py-2 bg-[#1e1e1e] border-t-2 border-blue-500 text-sm text-neutral-200 flex items-center gap-2 min-w-fit">
          <span className="text-blue-300">TSX</span>
          <span>Splitter.tsx</span>
          <span className="ml-2 text-neutral-500 hover:text-white cursor-pointer">×</span>
        </div>
        <div className="px-4 py-2 bg-neutral-900 border-t-2 border-transparent text-sm text-neutral-500 hover:bg-[#1e1e1e] cursor-pointer flex items-center gap-2 min-w-fit">
           <span className="text-sky-300">CSS</span>
          <span>index.css</span>
        </div>
        <div className="px-4 py-2 bg-neutral-900 border-t-2 border-transparent text-sm text-neutral-500 hover:bg-[#1e1e1e] cursor-pointer flex items-center gap-2 min-w-fit">
           <span className="text-blue-300">TSX</span>
          <span>App.tsx</span>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="h-6 bg-[#1e1e1e] border-b border-neutral-800 flex items-center px-4 text-xs text-neutral-500">
        src <span className="mx-1">›</span> components <span className="mx-1">›</span> Splitter.tsx
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto p-2 custom-scrollbar">
        <CodeLine num={1} content={<><span className="text-purple-400">import</span> React, {'{'} useState, useCallback {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;</>} />
        <CodeLine num={2} content="" />
        <CodeLine num={3} content={<><span className="text-purple-400">interface</span> <span className="text-yellow-300">SplitterProps</span> {'{'}</>} />
        <CodeLine num={4} indent={1} content={<>children: React.ReactNode;</>} />
        <CodeLine num={5} indent={1} content={<>initialWidth?: <span className="text-blue-400">number</span>;</>} />
        <CodeLine num={6} content={'}'} />
        <CodeLine num={7} content="" />
        <CodeLine num={8} content={<><span className="text-purple-400">export const</span> <span className="text-yellow-300">Splitter</span>: React.FC&lt;SplitterProps&gt; = ({'{'} children {'}'}) <span className="text-blue-400">=></span> {'{'}</>} />
        <CodeLine num={9} indent={1} content={<><span className="text-purple-400">const</span> [width, setWidth] = useState(<span className="text-blue-400">50</span>);</>} />
        <CodeLine num={10} indent={1} content={<><span className="text-purple-400">const</span> isResizing = useRef(<span className="text-blue-400">false</span>);</>} />
        <CodeLine num={11} content="" />
        <CodeLine num={12} indent={1} content={<><span className="text-gray-500">// Drag logic implementation</span></>} />
        <CodeLine num={13} indent={1} content={<><span className="text-purple-400">const</span> handleMouseDown = (e) <span className="text-blue-400">=></span> {'{'}</>} />
        <CodeLine num={14} indent={2} content={<>isResizing.current = <span className="text-blue-400">true</span>;</>} />
        <CodeLine num={15} indent={2} content={<>document.addEventListener(<span className="text-green-400">'mousemove'</span>, handleMouseMove);</>} />
        <CodeLine num={16} indent={1} content={'};'} />
        <CodeLine num={17} content="" />
        <CodeLine num={18} indent={1} content={<><span className="text-purple-400">return</span> (</>} />
        <CodeLine num={19} indent={2} content={<>&lt;<span className="text-blue-400">div</span> className=<span className="text-green-400">"flex w-full"</span>&gt;</>} />
        <CodeLine num={20} indent={3} content={<>{'{'}children{'}'}</>} />
        <CodeLine num={21} indent={2} content={<>&lt;/<span className="text-blue-400">div</span>&gt;</>} />
        <CodeLine num={22} indent={1} content={');'} />
        <CodeLine num={23} content={'};'} />
      </div>
    </div>
  );
};
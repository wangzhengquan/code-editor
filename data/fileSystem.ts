
export interface FileNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
    language?: string;
    isOpen?: boolean; // For folder expansion state
}

const DEFAULT_TSX_CONTENT = `import React, { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
};`;

const CSS_CONTENT = `.container {
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}`;

const JSON_CONTENT = `{
  "name": "vscode-clone",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}`;

export const initialFileSystem: FileNode[] = [
    {
        id: 'root',
        name: 'vscode-clone',
        type: 'folder',
        isOpen: true,
        children: [
            {
                id: 'src',
                name: 'src',
                type: 'folder',
                isOpen: true,
                children: [
                    {
                        id: 'components',
                        name: 'components',
                        type: 'folder',
                        isOpen: true,
                        children: [
                            { id: 'Header.tsx', name: 'Header.tsx', type: 'file', language: 'typescript', content: `export const Header = () => <header>Logo</header>;` },
                            { id: 'Sidebar.tsx', name: 'Sidebar.tsx', type: 'file', language: 'typescript', content: `export const Sidebar = () => <aside>Menu</aside>;` },
                        ]
                    },
                    { id: 'App.tsx', name: 'App.tsx', type: 'file', language: 'typescript', content: DEFAULT_TSX_CONTENT },
                    { id: 'index.css', name: 'index.css', type: 'file', language: 'css', content: CSS_CONTENT },
                    { id: 'utils.ts', name: 'utils.ts', type: 'file', language: 'typescript', content: `export const add = (a, b) => a + b;` },
                ]
            },
            { id: 'package.json', name: 'package.json', type: 'file', language: 'json', content: JSON_CONTENT },
            { id: 'tsconfig.json', name: 'tsconfig.json', type: 'file', language: 'json', content: `{ "compilerOptions": { "strict": true } }` },
            { id: 'readme.md', name: 'README.md', type: 'file', language: 'markdown', content: `# VS Code Clone\nA simple React-based editor.` },
        ]
    }
];

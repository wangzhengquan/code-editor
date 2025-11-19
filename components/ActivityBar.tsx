
import React from 'react';
import { FilesIcon, SearchIcon, GitIcon, SettingsIcon } from './Icons';

export const ActivityBar: React.FC = () => {
  return (
    <div className="w-12 bg-[#333333] flex flex-col items-center py-2 shrink-0 z-50 border-r border-black/20">
      <div className="flex flex-col gap-6 w-full items-center">
        <div className="text-white border-l-2 border-white w-full flex justify-center py-1 cursor-pointer opacity-100">
          <FilesIcon className="w-6 h-6 text-white" />
        </div>
        <div className="text-neutral-400 w-full flex justify-center hover:text-white cursor-pointer opacity-70 hover:opacity-100">
          <SearchIcon className="w-6 h-6" />
        </div>
        <div className="text-neutral-400 w-full flex justify-center hover:text-white cursor-pointer opacity-70 hover:opacity-100">
          <GitIcon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-auto pb-2">
         <div className="text-neutral-400 w-full flex justify-center hover:text-white cursor-pointer opacity-70 hover:opacity-100">
          <SettingsIcon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

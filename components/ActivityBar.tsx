
import React from 'react';
import { FilesIcon, SearchIcon, GitIcon, SettingsIcon, SunIcon, MoonIcon } from './Icons';
import { Theme } from '../App';

interface ActivityBarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#333333]' : 'bg-[#f0f0f0]';
  const borderColor = isDark ? 'border-black/20' : 'border-black/5';
  const activeIconColor = isDark ? 'text-white' : 'text-black';
  const inactiveIconColor = isDark ? 'text-neutral-400' : 'text-neutral-500';
  const activeBorderColor = isDark ? 'border-white' : 'border-black';

  const IconWrapper = ({ children, isActive = false }: { children: React.ReactNode, isActive?: boolean }) => (
    <div className={`w-full flex justify-center py-3 cursor-pointer hover:opacity-100 ${isActive ? `opacity-100 ${activeBorderColor} border-l-2` : `opacity-70 border-l-2 border-transparent ${inactiveIconColor} hover:${activeIconColor}`}`}>
       <div className={isActive ? activeIconColor : ''}>{children}</div>
    </div>
  );

  return (
    <div className={`w-12 ${bgColor} flex flex-col items-center py-2 shrink-0 z-50 border-r ${borderColor} transition-colors duration-200`}>
      <div className="flex flex-col w-full items-center">
        <IconWrapper isActive={true}>
          <FilesIcon className="w-6 h-6" />
        </IconWrapper>
        <IconWrapper>
          <SearchIcon className="w-6 h-6" />
        </IconWrapper>
        <IconWrapper>
          <GitIcon className="w-6 h-6" />
        </IconWrapper>
      </div>
      <div className="mt-auto w-full flex flex-col items-center">
         <div 
            onClick={onToggleTheme}
            className={`w-full flex justify-center py-3 cursor-pointer opacity-70 hover:opacity-100 ${inactiveIconColor} hover:${activeIconColor}`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
         >
            {isDark ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
         </div>
         <IconWrapper>
          <SettingsIcon className="w-6 h-6" />
        </IconWrapper>
      </div>
    </div>
  );
};

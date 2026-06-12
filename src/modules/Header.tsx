import React from 'react';
import { Search, Bell, Settings, Phone, Info, Plus, Hash, Lock } from 'lucide-react';
import { User, Channel } from '../types';

interface HeaderProps {
  currentView: 'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat';
  currentUser: User | null;
  activeChannel?: Channel;
  onToggleInfoPane?: () => void;
  infoPaneOpen?: boolean;
  onSearch: (query: string) => void;
  searchQuery: string;
  onOpenCreateModal?: () => void;
}

export default function Header({
  currentView,
  currentUser,
  activeChannel,
  onToggleInfoPane,
  infoPaneOpen = true,
  onSearch,
  searchQuery,
  onOpenCreateModal
}: HeaderProps) {
  // Determine search placeholder based on view
  const getSearchPlaceholder = () => {
    switch (currentView) {
      case 'chat':
        return `Search #${activeChannel?.name || 'frontend'}`;
      case 'projects':
        return 'Search projects...';
      case 'tasks':
        return 'Search tasks, projects...';
      case 'kanban':
        return 'Search tasks...';
      default:
        return 'Search tasks, people, or projects...';
    }
  };

  return (
    <header className="h-[64px] bg-white border-b border-border-subtle sticky top-0 z-40 flex items-center justify-between px-lg shrink-0 select-none">
      {/* Dynamic Left Area based on Chat or Dashboard */}
      {currentView === 'chat' && activeChannel ? (
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs">
            {activeChannel.isPrivate ? (
              <Lock className="w-[18px] h-[18px] text-outline shrink-0 font-bold" />
            ) : (
              <Hash className="w-[18px] h-[18px] text-outline shrink-0 font-bold" />
            )}
            <h2 className="font-headline font-bold text-on-surface text-base">{activeChannel.name}</h2>
          </div>
          
          <div className="h-4 w-[1px] bg-outline-variant mx-xs"></div>
          
          {/* Members Overlay Stack */}
          <div className="flex -space-x-2 select-none">
            <img 
              alt="Member 1" 
              className="w-6 h-6 rounded-full ring-2 ring-white object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvEXcZim6BudCSrUshiys7miszjrTrxgKi5e65CXkX0o4_odedjUgP-k7sEPtCNZBBsSBU7VoI4NAJqM4BgibiB_8hyMfnK7XT4Ss77oV8TryBes4G8En7mbbx8BLiLe9bkP-A05NShNe8V0t7OSsSmQmrQgjsEpYSmPb3OxyLX06_M4cSr3tWtjwq_MqtmfHC0IO_YRLV1-48Y52ciUZ5ukrmqVcsVWj4lK6q8499TPeEzreQyyjZX6rW9DFXzDMsNraBbVYVzow" 
            />
            <img 
              alt="Member 2" 
              className="w-6 h-6 rounded-full ring-2 ring-white object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKXwz7uI-HI7iKl6ywTYGEZzGE0uluGw6GkfJt6RSYdLG0kS7WbhI3C-3XvAhLSzQFAR5sjbxMfY2_VIXsaasE6pL-BmfCUC6-mMgMzF19U8r4EwFAMcT7c7PcbmwIwfIgD94sViE7u-OQMoYR0w9mHbC0-vpY30NweULiDPM61cea9tw45jhsrVWUry_7eykUcC25BFCmTBtQnimweEhQrfGY_sgxJTZfd3LyTCKnED9NFLJKEhhUG_KYxgIz8eA1E9VXtj8Y_RA" 
            />
            <img 
              alt="Member 3" 
              className="w-6 h-6 rounded-full ring-2 ring-white object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhK5iUfdgfjbucTcSMY7ogCl1_Hzhp-wPyVSyEuuJyQnFOAeoBgrQkU3k-AP9CemgVBJMbKV-LEILrwIE5zDMcVl1l-RcVrzkJaamSRwCYF1xjzT4zMriFSHRVnuy2K7iPYAsRPgfN3alITXAf5vKzSjHcoGTEvloUgD80ni8Njf19KyNtSyyYIHNtwtWnpwSoV8njbfqcGxYvF8_itYhm7V7XbFAOa_qbFRE2MfO7LZk1nV0FWtB72OoRegukLSqfr6EPTOsWEB4" 
            />
            <div className="w-6 h-6 rounded-full ring-2 ring-white bg-[#e5eeff] flex items-center justify-center text-[9px] font-bold text-primary font-sans border border-primary/10">+12</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-lg shrink-0">
          <span className="font-headline font-black text-primary hover:scale-105 transition-transform cursor-pointer hidden md:inline">CollabFlow</span>
        </div>
      )}

      {/* Dynamic Center/Utility Search Input */}
      <div className="flex items-center gap-lg flex-1 justify-end max-w-[512px] md:mx-lg lg:mx-xl">
        <div className="relative w-full max-w-[320px]">
          <Search className="w-4 h-4 absolute left-md top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-full pl-[40px] pr-md py-xs bg-bg-slate-50 border border-outline-variant rounded-full text-xs font-headline focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline"
          />
        </div>
      </div>

      {/* Right Icons Section */}
      <div className="flex items-center gap-md shrink-0">
        {/* Toggleable Chat info metrics */}
        {currentView === 'chat' ? (
          <>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eff4ff] text-secondary active:scale-95 transition-all">
              <Phone className="w-4 h-4" />
            </button>
            <button 
              onClick={onToggleInfoPane}
              className={`w-8 h-8 flex items-center justify-center rounded-lg active:scale-95 transition-all ${
                infoPaneOpen ? 'bg-primary-container text-white' : 'hover:bg-[#eff4ff] text-secondary'
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button className="p-1.5 text-secondary hover:text-primary hover:bg-[#eff4ff] transition-all rounded-full active:scale-95">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-secondary hover:text-primary hover:bg-[#eff4ff] transition-all rounded-full active:scale-95">
              <Settings className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="w-[1px] h-6 bg-border-subtle mx-[2px]"></div>

        {/* Create CTA Button (For Tasks/Kanban/Projects) */}
        {currentView !== 'chat' && currentView !== 'dashboard' && (
          <button 
            onClick={onOpenCreateModal}
            className="px-md py-1.5 bg-primary hover:bg-primary-container text-white rounded-lg font-headline text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1 active:scale-95 shadow-sm shadow-primary/15"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{currentView === 'projects' ? 'Create' : 'Create Task'}</span>
          </button>
        )}

        {/* Profile Dropdown avatar display */}
        {currentUser && (
          <div className="flex items-center gap-sm select-none">
            {currentView === 'dashboard' && (
              <div className="text-right hidden sm:block">
                <p className="font-headline text-[11px] font-bold text-on-surface truncate leading-tight">{currentUser.name}</p>
                <p className="text-[9px] text-secondary">{currentUser.role || 'Workspace User'}</p>
              </div>
            )}
            <div className="w-9 h-9 rounded-full border border-primary-container p-[2px] cursor-pointer hover:border-primary shrink-0 select-none">
              {currentUser.avatar ? (
                <img 
                  alt="My Profile" 
                  className="w-full h-full rounded-full object-cover" 
                  src={currentUser.avatar} 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.initials}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

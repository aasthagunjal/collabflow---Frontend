import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  ListTodo,
  Columns3,
  MessageSquare,
  FileText,
  Calendar,
  Settings,
  Plus,
  LogOut,
  Hash,
  Lock,
  UserCheck
} from 'lucide-react';
import { User, Channel } from '../types';
import { channels } from '../data';

interface SidebarProps {
  currentView: 'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat';
  onNavigate: (view: 'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat') => void;
  currentUser: User | null;
  onLogout: () => void;
  selectedChannelId?: string;
  onSelectChannel?: (id: string) => void;
  openNewProjectModal?: () => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  currentUser,
  onLogout,
  selectedChannelId = 'ch-frontend',
  onSelectChannel = () => { },
  openNewProjectModal = () => { }
}: SidebarProps) {
  return (
    <aside id="collabflow-sidebar" className="fixed left-0 top-0 h-screen w-[280px] bg-white/75 border-r border-border-subtle z-50 flex flex-col p-md glass-sidebar shrink-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-sm px-sm py-md select-none">
        <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm shadow-primary/20">
          <FolderGit2 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-headline font-extrabold text-lg text-on-surface leading-none tracking-tight">CollabFlow</h1>
          <p className="font-headline text-[10px] uppercase tracking-widest text-[#5a5c79] font-semibold mt-[2px]">Enterprise SaaS</p>
        </div>
      </div>

      {/* Main SaaS App Launcher Button */}
      <button
        id="new-project-btn-sidebar"
        onClick={openNewProjectModal}
        className="mt-md w-full bg-primary-container hover:bg-primary text-white font-semibold rounded-lg py-sm px-md flex items-center justify-center gap-xs active:scale-95 transition-all text-sm shadow-sm hover:shadow shadow-primary/10"
      >
        <Plus className="w-4 h-4" />
        <span className="font-headline text-xs font-semibold">New Project</span>
      </button>

      {/* Standard Navigation */}
      <nav className="mt-md flex flex-col gap-1">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-sm p-sm rounded-lg transition-all duration-200 text-left ${currentView === 'dashboard'
            ? 'bg-[#e5eeff] text-[#4744e5] font-semibold'
            : 'text-[#5a5c79] hover:bg-[#eff4ff]'
            }`}
        >
          <LayoutDashboard className="w-[18px] h-[18px] shrink-0" />
          <span className="font-headline text-xs">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('projects')}
          className={`flex items-center gap-sm p-sm rounded-lg transition-all duration-200 text-left ${currentView === 'projects'
            ? 'bg-[#e5eeff] text-[#4744e5] font-semibold'
            : 'text-[#5a5c79] hover:bg-[#eff4ff]'
            }`}
        >
          <FolderGit2 className="w-[18px] h-[18px] shrink-0" />
          <span className="font-headline text-xs">Projects</span>
        </button>

        <button
          onClick={() => onNavigate('tasks')}
          className={`flex items-center gap-sm p-sm rounded-lg transition-all duration-200 text-left ${currentView === 'tasks'
            ? 'bg-[#e5eeff] text-[#4744e5] font-semibold'
            : 'text-[#5a5c79] hover:bg-[#eff4ff]'
            }`}
        >
          <ListTodo className="w-[18px] h-[18px] shrink-0" />
          <span className="font-headline text-xs">Tasks</span>
        </button>

        {/* <button
          onClick={() => onNavigate('kanban')}
          className={`flex items-center gap-sm p-sm rounded-lg transition-all duration-200 text-left ${
            currentView === 'kanban'
              ? 'bg-[#e5eeff] text-[#4744e5] font-semibold'
              : 'text-[#5a5c79] hover:bg-[#eff4ff]'
          }`}
        >
          <Columns3 className="w-[18px] h-[18px] shrink-0" />
          <span className="font-headline text-xs">Kanban</span>
        </button> */}

        {/* <button
          onClick={() => onNavigate('chat')}
          className={`flex items-center gap-sm p-sm rounded-lg transition-all duration-200 text-left ${
            currentView === 'chat'
              ? 'bg-[#e5eeff] text-[#4744e5] font-semibold'
              : 'text-[#5a5c79] hover:bg-[#eff4ff]'
          }`}
        >
          <MessageSquare className="w-[18px] h-[18px] shrink-0" />
          <span className="font-headline text-xs">Chat</span>
        </button> */}
      </nav>

      {/* Dynamic Channels/DMs list (shown primarily in Chat context) */}
      <div className="flex-1 overflow-y-auto">
        {currentView === 'chat' && (
          <div className="mt-lg animate-fade-in">
            {/* Channels Header */}
            <div className="px-sm mb-xs flex items-center justify-between">
              <span className="font-headline text-[10px] font-bold uppercase tracking-wider text-outline">Channels</span>
              <button
                className="hover:text-primary transition-colors text-[#5a5c79] leading-none"
                onClick={() => alert("Add Channels feature under simulated enterprise deployment.")}
              >
                <Plus className="w-[14px] h-[14px]" />
              </button>
            </div>
            {/* Channels list */}
            <div className="flex flex-col gap-[2px] mb-lg">
              {channels.map((chan) => {
                const isActive = selectedChannelId === chan.id;
                return (
                  <button
                    key={chan.id}
                    onClick={() => onSelectChannel(chan.id)}
                    className={`flex items-center gap-2 px-sm py-xs rounded-lg transition-colors text-left w-full ${isActive
                      ? 'bg-surface-container-high text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                  >
                    {chan.isPrivate ? (
                      <Lock className={`w-[14px] h-[14px] shrink-0 ${isActive ? 'text-primary' : 'text-outline'}`} />
                    ) : (
                      <Hash className={`w-[14px] h-[14px] shrink-0 ${isActive ? 'text-primary' : 'text-outline'}`} />
                    )}
                    <span className="text-xs font-semibold">{chan.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Direct Messages Header */}
            <div className="px-sm mb-xs flex items-center justify-between">
              <span className="font-headline text-[10px] font-bold uppercase tracking-wider text-outline">Direct Messages</span>
              <button
                className="hover:text-primary transition-colors text-[#5a5c79] leading-none"
                onClick={() => alert("Add DM feature under simulated enterprise deployment.")}
              >
                <Plus className="w-[14px] h-[14px]" />
              </button>
            </div>
            {/* Direct Messages List */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-sm px-sm py-xs hover:bg-surface-container-low rounded-lg cursor-pointer group">
                <div className="relative">
                  <img
                    alt="Alex"
                    className="w-5 h-5 rounded-full border border-outline-variant object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYid7L3duy1tWGLKpRsaDjuHLPSrbYU18iBJh5UHaO5EDOsn5JQtcckR1lweM4l5fM9ZTOCd85OA8dal_V3uc_0HVE30CkpV5p3LtaG1MIn95U3vHKBHd4L_5X55RGqbjaWMd-aJrjNXfnd_eMFjSo9VRW73zuYe-8UIBaPW0Ig1aCref7O_1kq8vKlY3nvXWwEb18SvHFAHj445mM8QzorP5ZBd3kFo66TvRnbj8MxANA0Kc5R3d5pGCviNLPqO4LMPfYlbwUP_Q"
                  />
                  <span className="absolute bottom-0 right-0 w-[6px] h-[6px] bg-success-emerald border border-white rounded-full"></span>
                </div>
                <span className="text-[11px] font-medium text-on-surface-variant group-hover:text-primary transition-colors">Alex Rivera</span>
              </div>

              <div className="flex items-center gap-sm px-sm py-xs hover:bg-surface-container-low rounded-lg cursor-pointer group">
                <div className="relative">
                  <img
                    alt="Jordan"
                    className="w-5 h-5 rounded-full border border-outline-variant object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV6r5JEm4JwmySAXBaPcPM0Dp9a9cMNwr2ZcOUAGi-cRn7wN12FsCIhw246EnrC0MjV_wRVTN7-SmFpgWQQmwGjgFPLYNeoYv6cuGyBB-HPWLO5rDPpvibe4vJWgy2PkJ6lVDyirnWY95OyzziUwo5GdTRno-7Capo1COxK_eRFsvOScxt7p7WdUqZRXK2exrv8qJFFdgoFK44JAlfj1g-TCG-YrfcV79M2NkrXvwSim_86W9faDJVXNBn1MIyl6-FiBteZfAH5Pc"
                  />
                  <span className="absolute bottom-0 right-0 w-[6px] h-[6px] bg-outline border border-white rounded-full"></span>
                </div>
                <span className="text-[11px] font-medium text-on-surface-variant group-hover:text-primary transition-colors">Jordan Smith</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Utility Options */}
      <div className="pt-md border-t border-border-subtle mt-auto flex flex-col gap-1">
        {currentUser && (
          <div className="flex items-center gap-sm px-sm py-xs mb-2">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs select-none">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="Me" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{currentUser.initials}</span>
              )}
            </div>
            <div className="min-w-0 pr-1">
              <p className="text-[11px] font-bold text-on-surface truncate leading-tight">{currentUser.name}</p>
              <p className="text-[9px] text-on-surface-variant truncate">{currentUser.role || 'Workspace User'}</p>
            </div>
          </div>
        )}

        <button
          id="logout-btn"
          onClick={onLogout}
          className="flex items-center gap-sm p-sm text-[#5a5c79] hover:bg-[#ffdad6] hover:text-[#ba1a1a] rounded-lg transition-all duration-200 text-left w-full"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          <span className="font-headline text-xs">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

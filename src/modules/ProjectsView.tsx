import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  FolderGit2,
  Database,
  ShieldCheck,
  Rocket,
  Palette,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Project, ProjectStatus } from '../types';
import ProjectDetailModal from '../components/projects/ProjectDetailModal';

interface ProjectsViewProps {
  projects: Project[];
  onOpenCreateModal: () => void;
  onNavigate: (view: 'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat') => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ProjectsView({
  projects,
  onOpenCreateModal,
  onNavigate,
  isLoading = false,
  error = null,
}: ProjectsViewProps) {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed' | 'Archived'>('Active');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Filter projects relative to active tabs
  const filteredProjects = projects.filter((project) => {
    if (activeTab === 'Active') return project.status !== 'Completed' && project.status !== 'Archived';
    if (activeTab === 'Completed') return project.status === 'Completed';
    return project.status === 'Archived';
  });

  // Helper to resolve suitable category icons
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'database':
        return <Database className="w-5 h-5 text-primary" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-primary" />;
      case 'strategy':
        return <Rocket className="w-5 h-5 text-primary" />;
      case 'design':
        return <Palette className="w-5 h-5 text-primary" />;
      default:
        return <FolderGit2 className="w-5 h-5 text-primary" />;
    }
  };

  // Status badges color maps
  const getStatusStyle = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-success-emerald/10 text-success-emerald';
      case 'On Hold':
        return 'bg-warning-amber/10 text-warning-amber';
      case 'Priority Alpha':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-[#eff4ff] text-primary';
    }
  };

  return (
    <>
      <div className="space-y-lg animate-fade-in pb-xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div>
            <h2 className="font-headline font-semibold text-2xl text-on-surface">Projects</h2>
            <p className="font-sans text-xs text-secondary mt-[2px]">Manage and track your ongoing workspace initiatives.</p>
          </div>

          <div className="flex items-center gap-md shrink-0">
            {/* Tab filters — only show when there are projects */}
            {projects.length > 0 && (
              <div className="flex bg-[#eff4ff] p-1 rounded-full border border-border-subtle bg-opacity-70">
                {(['Active', 'Completed', 'Archived'] as const).map((tab) => {
                  const active = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-full font-headline text-xs font-semibold shrink-0 cursor-pointer transition-all ${active ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-[#4744e5]'
                        }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            )}

            {projects.length > 0 && (
              <button
                onClick={onOpenCreateModal}
                className="bg-[#4744e5] hover:bg-opacity-92 text-white px-lg py-2 rounded-xl flex items-center gap-sm font-headline text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>New Project</span>
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-[80px]">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
            <span className="ml-sm text-sm text-secondary font-headline">Loading projects...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-[80px] gap-sm text-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm font-semibold text-on-surface">Failed to load projects</p>
            <p className="text-xs text-secondary max-w-sm">{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px] gap-sm text-center">
            <FolderGit2 className="w-10 h-10 text-outline" />
            <p className="text-sm font-semibold text-on-surface">No projects yet</p>
            <p className="text-xs text-secondary">Create your first project to get started.</p>
            <button
              onClick={onOpenCreateModal}
              className="mt-sm bg-primary text-white px-lg py-2 rounded-xl text-xs font-headline font-bold flex items-center gap-xs hover:bg-opacity-90 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filteredProjects.map((proj) => {
              const isFeatured = proj.id === 'p-expansion';

              if (isFeatured) {
                return (
                  <div
                    key={proj.id}
                    className="md:col-span-2 group relative overflow-hidden bg-white border border-border-subtle rounded-xl p-lg shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row gap-lg"
                  >
                    <div className="flex-1 flex flex-col gap-lg z-10">
                      <div className="flex justify-between items-start">
                        <div className="p-sm bg-[#e5eeff] rounded-lg">
                          {getCategoryIcon(proj.category)}
                        </div>
                        <span className={`px-2.5 py-1 rounded font-headline text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(proj.status)}`}>
                          {proj.status}
                        </span>
                      </div>

                      <div>
                        <h3
                          onClick={() => setSelectedProjectId(proj.id)}
                          className="font-headline font-semibold text-lg text-on-surface group-hover:text-primary transition-colors cursor-pointer hover:underline"
                        >
                          {proj.name}
                        </h3>
                        <p className="font-sans text-xs text-on-surface-variant mt-sm leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="space-y-sm max-w-sm">
                        <div className="flex justify-between text-[11px] font-headline">
                          <span className="text-secondary">Progress</span>
                          <span className="text-on-surface font-extrabold">{proj.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-container rounded-full"
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-lg pt-md mt-auto">
                        <div className="flex -space-x-2">
                          {proj.team.map((user) => (
                            <div
                              key={user.id}
                              className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-[#eff4ff] flex items-center justify-center font-bold text-[9px]"
                              title={user.name}
                            >
                              {user.avatar ? (
                                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                              ) : (
                                <span>{user.initials}</span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="text-secondary flex items-center gap-xs font-sans text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {proj.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    {proj.image && (
                      <div className="w-full md:w-1/3 rounded-lg overflow-hidden relative min-h-[200px] bg-slate-950 shadow border border-outline-variant">
                        <img
                          className="absolute inset-0 w-full h-full object-cover opacity-80"
                          src={proj.image}
                          alt="Project illustration"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                      </div>
                    )}
                  </div>
                );
              }

              // Standard card
              return (
                <div
                  key={proj.id}
                  className="group bg-white border border-border-subtle rounded-xl p-lg shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col gap-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="p-sm bg-[#e5eeff] rounded-lg">
                      {getCategoryIcon(proj.category)}
                    </div>
                    <span className={`px-2.5 py-[3px] rounded font-headline text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(proj.status)}`}>
                      {proj.status}
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="font-headline font-semibold text-base text-on-surface group-hover:text-primary transition-colors cursor-pointer hover:underline"
                    >
                      {proj.name}
                    </h3>
                    <p className="font-sans text-xs text-on-surface-variant mt-sm line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="space-y-xs">
                    <div className="flex justify-between text-[10px] font-headline">
                      <span className="text-secondary">Progress</span>
                      <span className="text-on-surface font-extrabold">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${proj.status === 'On Hold' ? 'bg-[#ffb68c]' : 'bg-[#4744e5]'}`}
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-md border-t border-border-subtle mt-auto">
                    <div className="flex -space-x-2">
                      {proj.team.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-[#eff4ff] flex items-center justify-center font-bold text-[9px]"
                          title={user.name}
                        >
                          {user.avatar ? (
                            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                          ) : (
                            <span>{user.initials}</span>
                          )}
                        </div>
                      ))}
                      {proj.team.length > 3 && (
                        <div className="w-7 h-7 rounded-full bg-surface-container border-2 border-white flex items-center justify-center font-headline text-[9px] text-secondary">
                          +{proj.team.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-xs text-secondary font-sans text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{proj.dueDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProjectId && (
        <ProjectDetailModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </>
  );
}

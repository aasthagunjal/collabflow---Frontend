import React, { useState } from 'react';
import {
  Plus,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  Clock,
  CheckSquare,
  Filter,
  CheckSquare2,
  Calendar,
  User,
  Sparkles,
  ChevronRight,
  Share2,
  MoreVertical,
  X,
  PlusCircle,
  FileText
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, User as UserType } from '../types';

interface KanbanViewProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, completed: boolean) => void;
  onAddTaskComment: (taskId: string, comment: string) => void;
  onOpenCreateModal: () => void;
}

export default function KanbanView({
  tasks,
  onUpdateTaskStatus,
  onUpdateSubtask,
  onAddTaskComment,
  onOpenCreateModal
}: KanbanViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');

  // Kanban Column States
  const columns: { id: TaskStatus; label: string; dotColor: string }[] = [
    { id: 'Backlog', label: 'Backlog', dotColor: 'bg-[#767587]' },
    { id: 'Todo', label: 'Todo', dotColor: 'bg-[#3b82f6]' },
    { id: 'In Progress', label: 'In Progress', dotColor: 'bg-[#4744e5]' },
    { id: 'Review', label: 'Review', dotColor: 'bg-[#f59e0b]' },
    { id: 'Done', label: 'Done', dotColor: 'bg-[#10b981]' }
  ];

  // Helper styles for priority badges
  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'text-[#ef4444]';
      case 'Medium':
        return 'text-[#f59e0b]';
      default:
        return 'text-[#5a5c79]';
    }
  };

  // Helper category styles
  const getCategoryTheme = (title: string) => {
    if (title.toLowerCase().includes('auth') || title.toLowerCase().includes('security')) {
      return { bg: 'bg-[#eff4ff] text-primary', label: 'Security' };
    }
    if (title.toLowerCase().includes('design') || title.toLowerCase().includes('typography') || title.toLowerCase().includes('documentation')) {
      return { bg: 'bg-[#d3e4fe] text-on-surface-variant font-medium', label: 'Design' };
    }
    if (title.toLowerCase().includes('websocket') || title.toLowerCase().includes('infrastructure') || title.toLowerCase().includes('kubernetes')) {
      return { bg: 'bg-[#dcddff] text-primary', label: 'Infrastructure' };
    }
    return { bg: 'bg-[#eff4ff] text-[#5e617d]', label: 'Dev' };
  };

  const activeTaskComments = [
    { id: 'c-1', userImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxTKh9DWdstK9o_wZCxGH6EzXOiVVw32-IQ_fFSxfS84DDMg6ZVzH7tkCuXVq-rdSLbXPythRWGapDt-c219wnWNKyqJqJw0IPOSODKnxcWrxd0um-_Gm71ctYycoJe5UnSRLzxaWALk6OKDEBm0O3DPFvPV59LrJr4NiWQLvAQ1QoAAjUgYI8cOQNuNnYa1hL-gbgIgb0kGnxw66G8yyOcDi9_wnR0OavvVJxs4XsybplDLfYPxTHJAA7aTjF5iiOzZL6Q0l77DQ', content: 'Please ensure the JWT implementation covers refresh tokens as discussed.', timeAgo: '2 hours ago' }
  ];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDrawer = () => {
    setSelectedTask(null);
    setCommentText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden animate-fade-in relative select-none">
      {/* Kanban Board Title Section (Screen 3 Board Header) */}
      <section className="py-md flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-xs text-secondary mb-xs">
            <span className="font-headline text-[10px] font-semibold tracking-wider text-[#5a5c79] uppercase">Projects</span>
            <ChevronRight className="w-3 h-3 text-outline" />
            <span className="font-headline text-[10px] font-semibold tracking-wider text-primary uppercase">App Development</span>
          </div>
          <h2 className="font-headline font-extrabold text-[#0b1c30] text-xl select-all">Engineering Sprint</h2>
        </div>

        <div className="flex items-center gap-md shrink-0 select-none">
          {/* Members Overlay list */}
          <div className="flex -space-x-2">
            <img
              alt="Team member 1"
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk0PKvPZnGONYKzeMwejE_HjHR-JmJWlo7IJJayD6zMuRv8hXS50Uzv29hzqOxpP94YdO8nwfdK20isQqtzOJmCJegObL0uMLmbCI6WnLpPNG_pu6UQxspUpvFKpuikJB8yVWk6eosn71dLrEgRw7hRaE75L-EA_jVlhz2rdnpcphWzsQTiANVL7FGesxWZE57SkV9pJnd73uwnZ8vX1oCS99Mb1ZtfTEVCpyXSynaSYnaLeIuj0az5bsNoqNf0Xv5IYzOsruI6cw"
            />
            <img
              alt="Team member 2"
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSDrQoDs-y-OCKLCS8-423hPradWdF9RS8YG_k1D5EZ8YJ8NYxV-nn1IoeKkbyhcUMCoe7rL6e03Q8AGPjEgjRYmoqqypcHivuqZ7fcB9CszihhqJr2QghL4QY1GMzRh9JOATTdPRtU3ti22RGrjEdEgcyNLKve2aRxuqONmjNXHOlkFLXAQo_51vSLLV1voS1CptGsSg7Pgjj_bx7CnO6jEoVGzl7i3DLT2aO3m6bhBwukMrUbegDer1h_k3vMUkAUkp_upQLsEs"
            />
            <img
              alt="Team member 3"
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuByRFlpG_wqWE3ATa9-4Z9QeIkXANiI6nC9sBfu87nnKW0Uu1gQ8xH4b7s6dJNIrifxJMTFiHyS2uHxYGC36mviovhH4bvhXDjOxXdqbXGtUwiSmY1cqZWNB6VlYkiYJxDSUITs7uGq4s8Je-u6qYetPAuz_5OYgfbYfgX_5AN1dTm-yfeik4xYwkNHFGL2rXIN-Vc0GCjkpGcciOgZqI1MLwpgLwQLoJVZZqce7lNUh3dJHuBaguQif2VUtPFLwg7A57ugumtaDHs"
            />
            <div className="w-7 h-7 rounded-full border-2 border-white bg-[#d3e4fe] flex items-center justify-center font-headline text-[9px] text-[#464555] font-bold border border-primary/10">+4</div>
          </div>

          <button
            onClick={() => alert("Simulated enterprise filter settings activated.")}
            className="flex items-center gap-xs px-md py-1 border border-border-subtle rounded-lg text-[#0b1c30] hover:bg-[#eff4ff] active:scale-95 transition-all text-xs font-headline font-semibold cursor-pointer shadow-sm bg-white"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <button
            id="quick-add-kanban"
            onClick={onOpenCreateModal}
            className="flex items-center gap-xs px-md py-1 bg-primary text-white rounded-lg text-xs font-headline font-semibold hover:bg-primary-container active:scale-95 transition-all cursor-pointer shadow-md shadow-primary/25"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </section>

      {/* Kanban Board Scrollable columns container (Screen 3 Main Columns) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden py-md flex gap-lg bg-surface-container-low/30 relative select-none">
        {columns.map((col) => {
          // Columns specific tasks
          const columnTasks = tasks.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="w-[300px] shrink-0 flex flex-col h-full bg-[#eff4ff] bg-opacity-20 rounded-xl border border-border-subtle/50 p-sm select-all">
              {/* Column Title element */}
              <div className="flex items-center justify-between px-xs pb-sm select-none border-b border-border-subtle/30 mb-md shrink-0">
                <div className="flex items-center gap-sm">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <h3 className="font-headline font-semibold text-xs text-[#464555] uppercase tracking-wide">{col.label}</h3>
                  <span className="bg-[#e5eeff] text-[#5a5c79] px-2 py-[1px] rounded text-[10px] font-extrabold">{columnTasks.length}</span>
                </div>
                <button className="text-[#5a5c79] hover:text-primary transition-colors">
                  <MoreHorizontal className="w-4 h-4 shrink-0" />
                </button>
              </div>

              {/* Stacked list of Kanban project cards */}
              <div className="flex-1 overflow-y-auto pr-xs space-y-md flex flex-col custom-scrollbar pb-lg select-none">
                {columnTasks.map((task) => {
                  const cardTheme = getCategoryTheme(task.title);

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className="group bg-white border border-border-subtle rounded-xl p-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer duration-300 relative select-all flex flex-col gap-sm"
                    >
                      {/* Top elements */}
                      <div className="flex justify-between items-start">
                        <span className="font-headline text-[10px] font-bold text-outline uppercase">{task.id}</span>
                        <span className={`flex items-center ${getPriorityStyle(task.priority)} font-headline text-[9px] font-extrabold uppercase gap-xs`}>
                          <span className="material-symbols-outlined text-[12px]">priority_high</span>
                          <span>{task.priority}</span>
                        </span>
                      </div>

                      {/* Header */}
                      <h4 className="font-sans font-bold text-[#0b1c30] group-hover:text-primary leading-snug transition-colors text-xs select-all">
                        {task.title}
                      </h4>

                      {/* Category tag */}
                      <div className="flex flex-wrap gap-xs">
                        <span className={`px-2 py-0.5 rounded font-headline text-[9px] font-bold uppercase ${cardTheme.bg}`}>
                          {cardTheme.label}
                        </span>
                      </div>

                      {/* Footer elements */}
                      <div className="flex items-center justify-between border-t border-border-subtle/40 pt-sm mt-xs">
                        <div className="flex items-center gap-md select-none">
                          {task.commentsCount && task.commentsCount > 0 ? (
                            <div className="flex items-center gap-xs font-sans text-[10px] text-outline">
                              <MessageSquare className="w-3 h-3 text-outline shrink-0" />
                              <span>{task.commentsCount}</span>
                            </div>
                          ) : null}
                          {task.attachmentsCount && task.attachmentsCount > 0 ? (
                            <div className="flex items-center gap-xs font-sans text-[10px] text-outline">
                              <Paperclip className="w-3 h-3 text-outline shrink-0" />
                              <span>{task.attachmentsCount}</span>
                            </div>
                          ) : null}
                          {task.subtasks && task.subtasks.length > 0 ? (
                            <div className="flex items-center gap-xs font-sans text-[10px] text-outline">
                              <CheckSquare className="w-3 h-3 text-outline shrink-0" />
                              <span>
                                {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {/* Assignee Avatar */}
                        <div className="w-6 h-6 rounded-full border border-border-subtle bg-surface-container overflow-hidden flex items-center justify-center font-headline font-bold text-[9px]">
                          {task.assignee.avatar ? (
                            <img src={task.assignee.avatar} alt="User" />
                          ) : (
                            <span>{task.assignee.initials}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="flex-1 border-2 border-dashed border-border-subtle rounded-xl min-h-[120px] flex items-center justify-center p-md text-outline font-headline text-[10px] uppercase text-center select-none bg-white bg-opacity-20">
                    Empty column • drag items here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Drawer slide overlay (Screen 3 Right Slide-out Drawer Panel) */}
      {selectedTask && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={handleCloseDrawer}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] transition-opacity duration-300"
          />

          <div
            id="task-kanban-details-drawer"
            className="fixed right-0 top-0 h-screen w-[400px] bg-white shadow-2xl border-l border-border-subtle z-[60] overflow-y-auto flex flex-col justify-between custom-scrollbar"
          >
            {/* Drawer padded contents */}
            <div className="p-lg space-y-lg flex-1">
              <div className="flex items-center justify-between pb-sm border-b border-border-subtle select-none">
                <button
                  onClick={handleCloseDrawer}
                  className="p-1 px-[7px] bg-[#eff4ff] hover:bg-[#ffdad6] hover:text-[#ba1a1a] text-secondary rounded-full active:scale-90 transition-all font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-xs">
                  <button className="p-1.5 hover:bg-surface-container-low text-secondary rounded-lg active:scale-95 transition-all">
                    <Share2 className="w-[15px] h-[15px]" />
                  </button>
                  <button className="p-1.5 hover:bg-surface-container-low text-secondary rounded-lg active:scale-95 transition-all">
                    <MoreVertical className="w-[15px] h-[15px]" />
                  </button>
                </div>
              </div>

              {/* Task Details Info */}
              <div className="space-y-xs">
                <span className="font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider block">
                  TASK {selectedTask.id}
                </span>
                <h2 className="font-headline font-extrabold text-[18px] text-on-surface leading-tight select-text">
                  {selectedTask.title}
                </h2>
              </div>

              {/* Structured Metadata block layout (Screen 3 Info Grid) */}
              <div className="grid grid-cols-2 gap-md p-md bg-[#eff4ff] bg-opacity-70 rounded-xl border border-border-subtle select-none">
                <div>
                  <span className="font-headline text-[9px] font-bold text-secondary uppercase block mb-xs">Assignee</span>
                  <div className="flex items-center gap-sm">
                    <div className="shrink-0 w-8 h-8 rounded-full border border-border-subtle bg-white overflow-hidden flex items-center justify-center font-bold text-xs select-none">
                      {selectedTask.assignee.avatar ? (
                        <img src={selectedTask.assignee.avatar} alt="Me" className="w-[100%] h-[100%] object-cover shadow-sm" />
                      ) : (
                        <span>{selectedTask.assignee.initials}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-on-surface leading-none">{selectedTask.assignee.name}</span>
                  </div>
                </div>

                <div>
                  <span className="font-headline text-[9px] font-bold text-secondary uppercase block mb-xs">Status</span>
                  <div className="flex items-center gap-sm mt-1">
                    <span className="w-2.5 h-2.5 bg-[#4744e5] rounded-full" />
                    <select
                      value={selectedTask.status}
                      onChange={(e) => {
                        onUpdateTaskStatus(selectedTask.id, e.target.value as TaskStatus);
                        // update selectedTask state locally to reflect live state changes
                        setSelectedTask({ ...selectedTask, status: e.target.value as TaskStatus });
                      }}
                      className="text-xs font-bold text-on-surface bg-transparent border-none cursor-pointer outline-none hover:underline"
                    >
                      <option value="Backlog">Backlog</option>
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="font-headline text-[9px] font-bold text-secondary uppercase block mb-xs">Priority</span>
                  <div className="flex items-center gap-1 font-headline font-bold text-xs text-[#ef4444] mt-[2px]">
                    <span className="material-symbols-outlined text-[16px] text-error">priority_high</span>
                    <span>{selectedTask.priority} Priority</span>
                  </div>
                </div>

                <div>
                  <span className="font-headline text-[9px] font-bold text-secondary uppercase block mb-xs">Due Date</span>
                  <div className="flex items-center gap-sm text-[11px] font-sans font-semibold text-on-surface">
                    <Calendar className="w-4 h-4 text-outline" />
                    <span>{selectedTask.dueDate || 'No Due Date'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-xs">
                <h3 className="font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider block">Description</h3>
                <p className="text-xs font-sans text-on-surface-variant leading-relaxed select-text p-sm bg-bg-slate-50 border border-border-subtle rounded-lg">
                  {selectedTask.description || 'This task does not have a formal written description asset yet.'}
                </p>
              </div>

              {/* Subtasks (Interactive checkboxes checklist) */}
              <div className="space-y-sm">
                <h3 className="font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider block">Subtasks</h3>
                {selectedTask.subtasks && selectedTask.subtasks.length > 0 ? (
                  <div className="space-y-sm select-none">
                    {selectedTask.subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-sm p-sm border border-border-subtle rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors"
                        onClick={() => {
                          onUpdateSubtask(selectedTask.id, sub.id, !sub.completed);
                          // reflect changes in drawer live state
                          const updatedSubs = selectedTask.subtasks?.map(s =>
                            s.id === sub.id ? { ...s, completed: !s.completed } : s
                          );
                          setSelectedTask({ ...selectedTask, subtasks: updatedSubs });
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          readOnly
                          className="w-4 h-4 rounded border-outline-variant text-[#4744e5] focus:ring-[#4744e5] cursor-pointer"
                        />
                        <span className={`text-xs font-sans font-medium text-on-surface-variant ${sub.completed ? 'line-through text-outline' : ''}`}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-outline select-none pl-sm">No secondary tasks drafted.</p>
                )}
              </div>

              {/* Activity Section Commentators */}
              <div className="space-y-md border-t border-border-subtle pt-md">
                <h3 className="font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider block">Activity</h3>

                {activeTaskComments.map((comm) => (
                  <div key={comm.id} className="flex gap-md select-text">
                    <img className="w-8 h-8 rounded-full border border-border-subtle object-cover shrink-0" src={comm.userImg} alt="User" />
                    <div>
                      <div className="bg-[#eff4ff] p-md rounded-xl text-xs font-sans text-on-surface-variant leading-relaxed border border-border-subtle">
                        {comm.content}
                      </div>
                      <span className="font-headline text-[9px] text-outline mt-xs block text-right">{comm.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom New Comment input area */}
            <div className="p-md border-t border-border-subtle select-none block bg-bg-slate-50">
              <div className="relative">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-white border border-[#c7c4d8] rounded-xl p-md text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#4744e5]/20 focus:border-[#4744e5] min-h-[90px] resize-none"
                />
                <button
                  onClick={() => {
                    if (!commentText.trim()) return;
                    onAddTaskComment(selectedTask.id, commentText);
                    alert("Your comment asset was added live to the audit thread!");
                    setCommentText('');
                  }}
                  className="absolute bottom-md right-md bg-primary hover:bg-[#6161ff] text-white px-md py-1 rounded-lg text-[10px] font-headline font-bold active:scale-95 transition-all shadow-sm"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

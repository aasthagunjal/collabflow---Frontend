import React, { useState } from 'react';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Grid2X2, 
  List, 
  ArrowUpDown,
  Search,
  CheckCircle,
  Clock,
  Dot
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, User } from '../types';

interface TasksViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenCreateModal: () => void;
}

export default function TasksView({
  tasks,
  onSelectTask,
  onOpenCreateModal
}: TasksViewProps) {
  // Filters configuration
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<string>('All');
  
  // Filter core logic
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = selectedStatus === 'All' || task.status === selectedStatus;
    const priorityMatch = selectedPriority === 'All' || task.priority === selectedPriority;
    const projectMatch = selectedProject === 'All' || task.projectName.includes(selectedProject);
    return statusMatch && priorityMatch && projectMatch;
  });

  const handleClearFilters = () => {
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSelectedProject('All');
  };

  // Helper styles for priority badges
  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-[#ffdad6] text-[#93000a]';
      case 'Medium':
        return 'bg-[#dcddff] text-[#424560]';
      case 'Low':
        return 'bg-[#eff4ff] text-[#5e617d]';
      default:
        return 'bg-[#f8fafc] text-[#767587]';
    }
  };

  // Helper styles for status badges
  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case 'Done':
        return 'bg-[#10b981]/10 text-[#10b981]';
      case 'In Progress':
        return 'bg-[#e5eeff] text-[#4744e5]';
      case 'Review':
        return 'bg-[#ffdbc9] text-[#753400]';
      case 'Todo':
        return 'bg-white border border-border-subtle text-secondary';
      default:
        return 'bg-[#eff4ff] text-[#464555]';
    }
  };

  // Helper to draw project category dot color
  const getProjectColorDot = (projectName: string) => {
    if (projectName.includes('Vision')) return 'bg-info-sapphire';
    if (projectName.includes('Security')) return 'bg-primary-container';
    if (projectName.includes('System')) return 'bg-[#c05900]';
    if (projectName.includes('Data')) return 'bg-success-emerald';
    return 'bg-secondary';
  };

  return (
    <div className="space-y-lg animate-fade-in pb-xl">
      {/* Title Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline font-semibold text-2xl text-on-surface">Task Management</h2>
          <p className="text-secondary font-sans text-xs mt-[2px]">Track and manage your team's engineering workflows.</p>
        </div>
      </div>

      {/* Filter Bar (Screen 4 Layout) */}
      <div className="bg-white rounded-xl border border-border-subtle p-md flex flex-wrap items-center gap-md shadow-sm">
        <div className="flex items-center gap-xs font-headline font-semibold text-xs text-secondary border-r border-border-subtle pr-md py-1">
          <Filter className="w-4 h-4 text-outline shrink-0" />
          <span>Filters</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-sm">
          <div className="flex items-center">
            <span className="text-[11px] font-headline text-outline mr-2">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-surface-container-low border border-border-subtle hover:border-primary rounded-lg text-xs font-sans py-1 px-3 outline-none cursor-pointer text-on-surface-variant font-medium transition-colors"
            >
              <option value="All">All statuses</option>
              <option value="Backlog">Backlog</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center">
            <span className="text-[11px] font-headline text-outline mr-2">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-surface-container-low border border-border-subtle hover:border-primary rounded-lg text-xs font-sans py-1 px-3 outline-none cursor-pointer text-on-surface-variant font-medium transition-colors"
            >
              <option value="All">All priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Project Filter */}
          <div className="flex items-center">
            <span className="text-[11px] font-headline text-outline mr-2">Project:</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-surface-container-low border border-border-subtle hover:border-primary rounded-lg text-xs font-sans py-1 px-3 outline-none cursor-pointer text-on-surface-variant font-medium transition-colors"
            >
              <option value="All">All Projects</option>
              <option value="Vision">Vision Redesign</option>
              <option value="Security">Security Audit</option>
              <option value="Design">Design System</option>
              <option value="Migration">Data Migration</option>
            </select>
          </div>
        </div>

        {/* Clear Filters CTA */}
        <div className="ml-auto flex items-center gap-sm">
          <button className="p-1.5 bg-white border border-border-subtle rounded-lg text-secondary hover:bg-surface-container-low transition-colors active:scale-95">
            <List className="w-4 h-4 shrink-0" />
          </button>
          <button className="p-1.5 bg-white border border-border-subtle rounded-lg text-secondary hover:bg-surface-container-low transition-colors active:scale-95">
            <Grid2X2 className="w-4 h-4 shrink-0" />
          </button>
          
          <div className="h-6 w-px bg-border-subtle mx-xs"></div>
          
          <button 
            onClick={handleClearFilters}
            className="text-primary font-headline text-xs font-bold hover:underline cursor-pointer active:scale-95 transition-all"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Spreadsheet / High Fidelity Data Table */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8fafc] border-b border-border-subtle">
              <tr className="select-none">
                <th className="px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider w-32">Task ID</th>
                <th className="px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider">Title</th>
                <th className="px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider">Project</th>
                <th className="px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider">Assignee</th>
                <th className="px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider">Priority</th>
                <th className="px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider">Status</th>
                <th className="px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider">Due Date</th>
                <th className="px-lg py-md font-headline text-[10px] font-extrabold text-[#5a5c79] uppercase tracking-wider text-right w-16">Ac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-lg py-xl text-center text-secondary font-headline">
                    No tasks found matching your filter parameters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr 
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="hover:bg-[#6161ff]/[0.02] transition-colors group cursor-pointer"
                  >
                    {/* Task ID */}
                    <td className="px-lg py-md font-bold text-primary tnum font-headline shrink-0">{task.id}</td>
                    
                    {/* Title */}
                    <td className="px-lg py-md font-semibold text-on-surface font-sans max-w-[280px] truncate">{task.title}</td>
                    
                    {/* Project with color dot indicator */}
                    <td className="px-lg py-md font-sans text-on-surface-variant">
                      <div className="flex items-center gap-1.5 min-w-[120px]">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${getProjectColorDot(task.projectName)}`} />
                        <span className="truncate">{task.projectName}</span>
                      </div>
                    </td>

                    {/* Assignee item details */}
                    <td className="px-lg py-md font-sans">
                      <div className="flex items-center gap-sm">
                        <div className="w-6 h-6 rounded-full bg-surface-container overflow-hidden flex items-center justify-center border border-border-subtle font-headline font-bold text-[9px] shrink-0">
                          {task.assignee.avatar ? (
                            <img src={task.assignee.avatar} alt="Assignee Avatar" className="w-[100%] h-[100%] object-cover" />
                          ) : (
                            <span>{task.assignee.initials}</span>
                          )}
                        </div>
                        <span className="truncate max-w-[100px]">{task.assignee.name}</span>
                      </div>
                    </td>

                    {/* Priority badge representation */}
                    <td className="px-lg py-md">
                      <span className={`inline-flex items-center px-2.5 py-[3px] rounded-full text-[9px] font-bold ${getPriorityStyle(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-lg py-md">
                      <span className={`inline-flex items-center px-2.5 py-[3px] rounded-full text-[9px] font-bold ${getStatusStyle(task.status)}`}>
                        {task.status}
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="px-lg py-md tnum text-on-surface-variant font-sans whitespace-nowrap">{task.dueDate}</td>

                    {/* Quick Row Options Menu Trigger */}
                    <td className="px-lg py-md text-right whitespace-nowrap">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Managing task row action controller for ${task.id}`);
                        }}
                        className="p-1 hover:bg-[#eff4ff] text-[#5a5c79] hover:text-[#4744e5] rounded transition-all opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination elements (representing Screen 4 bottom bar) */}
        <div className="px-lg py-md bg-white border-t border-border-subtle flex items-center justify-between font-headline select-none">
          <p className="text-[11px] font-medium text-on-surface-variant">
            Showing <span className="font-bold">{filteredTasks.length}</span> of <span className="font-bold">{tasks.length}</span> tasks
          </p>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-[#eff4ff] text-secondary active:scale-90 transition-all">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 rounded bg-[#4744e5] text-white font-extrabold text-[10px] flex items-center justify-center shadow-sm shadow-[#4744e5]/20 shrink-0">1</button>
            <button className="w-6 h-6 rounded hover:bg-[#eff4ff] text-secondary font-extrabold text-[10px] flex items-center justify-center shrink-0">2</button>
            <button className="w-6 h-6 rounded hover:bg-[#eff4ff] text-secondary font-extrabold text-[10px] flex items-center justify-center shrink-0">3</button>
            <span className="px-1 text-secondary text-[10px]">...</span>
            <button className="w-6 h-6 rounded hover:bg-[#eff4ff] text-secondary font-extrabold text-[10px] flex items-center justify-center shrink-0">24</button>
            <button className="p-1 rounded hover:bg-[#eff4ff] text-secondary active:scale-90 transition-all">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

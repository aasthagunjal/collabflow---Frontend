import React, { useState } from 'react';
import { User, Project, Task, ChatMessage, TaskStatus, TaskPriority } from './types';
import { users, initialProjects, initialTasks, chatMessages as initialChatMessages, channels } from './data';
import Sidebar from './modules/Sidebar';
import Header from './modules/Header';
import DashboardView from './modules/DashboardView';
import ProjectsView from './modules/ProjectsView';
import TasksView from './modules/TasksView';
import KanbanView from './modules/KanbanView';
import ChatView from './modules/ChatView';
import LoginView from './modules/LoginView';
import RegisterView from './modules/RegisterView';
import { X, Check } from 'lucide-react';

export default function App() {
  // Authentication & Navigation Route States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authRoute, setAuthRoute] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat'>('dashboard');

  // Unified In-Memory Datasets
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [tasksList, setTasksList] = useState<Task[]>(initialTasks);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [selectedChannelId, setSelectedChannelId] = useState('ch-frontend');
  const [searchQuery, setSearchQuery] = useState('');

  // UI Drawer & Modal State Variables
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState<'task' | 'project'>('task');
  const [infoPaneOpen, setInfoPaneOpen] = useState(true);

  // New Project Fields State
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjCat, setNewProjCat] = useState('Mobile');
  const [newProjDate, setNewProjDate] = useState('Dec 20, 2023');

  // New Task Fields State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskProjId, setNewTaskProjId] = useState('p-vision');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('u-david');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDate, setNewTaskDate] = useState('Oct 28, 2023');

  // Reset helper
  const resetFormFields = () => {
    setNewProjName('');
    setNewProjDesc('');
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  // Auth Action Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthRoute('login');
  };

  // Dynamic Content Filtering based on Search Box (Header)
  const getFilteredTasks = () => {
    if (!searchQuery.trim()) return tasksList;
    return tasksList.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredProjects = () => {
    if (!searchQuery.trim()) return projectsList;
    return projectsList.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Chat Message Action Handlers
  const handleSendChatMessage = (content: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
      reactions: []
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleSendCodeSnippet = (filename: string, code: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `Pushed code snippet for ${filename}:`,
      reactions: [],
      codeSnippet: { filename, code }
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  // Kanban Action Handlers
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasksList(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  const handleUpdateSubtask = (taskId: string, subtaskId: string, completed: boolean) => {
    setTasksList(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const updatedSubtasks = t.subtasks?.map(s =>
        s.id === subtaskId ? { ...s, completed } : s
      );
      return { ...t, subtasks: updatedSubtasks };
    }));
  };

  const handleAddTaskComment = (taskId: string, comment: string) => {
    setTasksList(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, commentsCount: (t.commentsCount || 0) + 1 };
    }));
  };

  // Modal Creator Submission Handlers
  const handleCreateProject = () => {
    if (!newProjName.trim()) return;
    const newProject: Project = {
      id: `p-${Date.now()}`,
      name: newProjName.trim(),
      description: newProjDesc.trim() || 'No project summary details provided.',
      progress: 0,
      status: 'In Progress',
      dueDate: newProjDate,
      category: newProjCat,
      team: [currentUser || users.alex]
    };

    setProjectsList(prev => [newProject, ...prev]);
    setShowCreateModal(false);
    resetFormFields();
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    const selectedProjectObj = projectsList.find(p => p.id === newTaskProjId);
    const selectedAssigneeObj = Object.values(users).find(u => u.id === newTaskAssigneeId);

    const newTaskItem: Task = {
      id: `CF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTaskTitle.trim(),
      projectId: newTaskProjId,
      projectName: selectedProjectObj ? selectedProjectObj.name : 'Workspace General',
      assignee: selectedAssigneeObj || users.alex,
      priority: newTaskPriority,
      status: 'Todo',
      dueDate: newTaskDate,
      description: newTaskDesc.trim() || 'No primary description registered.',
      subtasks: [],
      commentsCount: 0,
      attachmentsCount: 0
    };

    setTasksList(prev => [newTaskItem, ...prev]);
    setShowCreateModal(false);
    resetFormFields();
  };

  // Navigation callbacks directed from cards
  const handleSelectTaskFromOuter = (task: Task) => {
    // Navigate straight to Kanban board and trigger select drawer
    setCurrentView('kanban');
  };

  // Find active channel info
  const activeChannel = channels.find(c => c.id === selectedChannelId) || channels[1];

  // Auth view branch gates
  if (!currentUser) {
    if (authRoute === 'register') {
      return (
        <RegisterView
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setAuthRoute('login')}
        />
      );
    }
    return (
      <LoginView
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthRoute('register')}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface select-none text-on-surface">

      {/* Smart adaptative navigation column header left (Screen 1-7 Left margin) */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setSearchQuery('');
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        selectedChannelId={selectedChannelId}
        onSelectChannel={setSelectedChannelId}
        openNewProjectModal={() => {
          setModalType('project');
          setShowCreateModal(true);
        }}
      />

      {/* Main viewport column panel */}
      <main className="flex-1 flex flex-col pl-[280px] overflow-hidden">

        {/* Dynamic header tracker top */}
        <Header
          currentView={currentView}
          currentUser={currentUser}
          activeChannel={activeChannel}
          onToggleInfoPane={() => setInfoPaneOpen(!infoPaneOpen)}
          infoPaneOpen={infoPaneOpen}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onOpenCreateModal={() => {
            setModalType(currentView === 'projects' ? 'project' : 'task');
            setShowCreateModal(true);
          }}
        />

        {/* Content Views Stage space */}
        <div className="flex-1 overflow-y-auto px-lg py-md custom-scrollbar bg-[#f8f9ff]">
          {currentView === 'dashboard' && (
            <DashboardView
              projects={projectsList}
              tasks={tasksList}
              onNavigate={setCurrentView}
              onSelectTask={handleSelectTaskFromOuter}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsView
              projects={getFilteredProjects()}
              onOpenCreateModal={() => {
                setModalType('project');
                setShowCreateModal(true);
              }}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView
              tasks={getFilteredTasks()}
              onSelectTask={handleSelectTaskFromOuter}
              onOpenCreateModal={() => {
                setModalType('task');
                setShowCreateModal(true);
              }}
            />
          )}

          {/* {currentView === 'kanban' && (
            <KanbanView
              tasks={getFilteredTasks()}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateSubtask={handleUpdateSubtask}
              onAddTaskComment={handleAddTaskComment}
              onOpenCreateModal={() => {
                setModalType('task');
                setShowCreateModal(true);
              }}
            />
          )} */}

          {/* {currentView === 'chat' && (
            <ChatView
              channel={activeChannel}
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              onSendCodeSnippet={handleSendCodeSnippet}
              infoPaneOpen={infoPaneOpen}
              onToggleInfoPane={() => setInfoPaneOpen(!infoPaneOpen)}
            />
          )} */}
        </div>

      </main>

      {/* Shared Interactive Creator Dialog Modal overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-md">
          <div className="bg-white border border-border-subtle rounded-2xl w-full max-w-[500px] p-lg shadow-2xl animate-scale-up flex flex-col gap-md">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-xs">
              <div className="flex items-center gap-sm">
                <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                <h3 className="font-headline font-bold text-sm text-on-surface">
                  {modalType === 'project' ? 'Initiate New Project' : 'Draft New Sprint Task'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetFormFields();
                }}
                className="p-1 rounded-full text-secondary hover:bg-surface-container active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type selector toggle */}
            <div className="flex justify-center bg-bg-slate-50 border border-border-subtle p-px rounded-xl">
              <button
                type="button"
                onClick={() => setModalType('task')}
                className={`flex-1 py-1 px-3 text-xs font-headline font-semibold rounded-lg transition-colors ${modalType === 'task' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'
                  }`}
              >
                Sprint Task
              </button>
              <button
                type="button"
                onClick={() => setModalType('project')}
                className={`flex-1 py-1 px-3 text-xs font-headline font-semibold rounded-lg transition-colors ${modalType === 'project' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'
                  }`}
              >
                Workspace Project
              </button>
            </div>

            {/* Dynamic fields */}
            {modalType === 'project' ? (
              <div className="space-y-sm text-xs text-on-surface-variant font-sans select-text">
                <div>
                  <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Project Name</label>
                  <input
                    type="text"
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    placeholder="e.g. Vision Mobile App Redesign"
                    className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-md text-xs focus:border-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Summary details</label>
                  <textarea
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    placeholder="Overhaul layout grids, responsive columns, and illustrations..."
                    className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl p-md text-xs min-h-[80px] resize-none outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-sm">
                  <div>
                    <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Category</label>
                    <select
                      value={newProjCat}
                      onChange={(e) => setNewProjCat(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-3 text-xs"
                    >
                      <option value="Mobile">Mobile</option>
                      <option value="Database">Database</option>
                      <option value="Security">Security</option>
                      <option value="Strategy">Strategy</option>
                      <option value="Design">Design System</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Due Date</label>
                    <input
                      type="text"
                      value={newProjDate}
                      onChange={(e) => setNewProjDate(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-md text-xs text-center"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCreateProject}
                  disabled={!newProjName.trim()}
                  className="w-full bg-primary hover:bg-[#6161ff] text-white py-2 px-4 rounded-xl text-xs font-headline font-bold mt-sm transition-all shadow-lg select-none disabled:opacity-50"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="space-y-sm text-xs text-on-surface-variant font-sans select-text">
                <div>
                  <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Task Title</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Integration of WebSocket Client"
                    className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-md text-xs focus:border-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Description</label>
                  <textarea
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Provide developer-centric goals..."
                    className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl p-md text-xs min-h-[60px] resize-none outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Associate Project</label>
                  <select
                    value={newTaskProjId}
                    onChange={(e) => setNewTaskProjId(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-3 text-xs"
                  >
                    {projectsList.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-sm">
                  <div>
                    <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Assignee</label>
                    <select
                      value={newTaskAssigneeId}
                      onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-3 text-xs"
                    >
                      {Object.values(users).map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                      className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-3 text-xs"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">Due Timeline</label>
                  <input
                    type="text"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-md text-xs text-center"
                  />
                </div>

                <button
                  onClick={handleCreateTask}
                  disabled={!newTaskTitle.trim()}
                  className="w-full bg-primary hover:bg-[#6161ff] text-white py-2 px-4 rounded-xl text-xs font-headline font-bold mt-sm transition-all shadow-lg select-none disabled:opacity-50"
                >
                  Create Task Chores
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

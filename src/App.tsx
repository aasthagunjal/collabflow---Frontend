import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Project,
  Task,
  ChatMessage,
  TaskStatus,
  TaskPriority,
} from "./types";
import { users, chatMessages as initialChatMessages, channels } from "./data";
import Sidebar from "./modules/Sidebar";
import Header from "./modules/Header";
import DashboardView from "./modules/DashboardView";
import ProjectsView from "./modules/ProjectsView";
import TasksView from "./modules/TasksView";
import KanbanView from "./modules/KanbanView";
import ChatView from "./modules/ChatView";
import LoginView from "./modules/LoginView";
import RegisterView from "./modules/RegisterView";
import { X, Loader2 } from "lucide-react";
import {
  createProject,
  getAllProjects,
  mapApiProjectToLocal,
  resolveProjectError,
} from "./services/projects/projectService";
import {
  getAllTasks,
  mapApiTaskToLocal,
  resolveTaskError,
  mapApiTaskProjectToLocal,
} from "./services/tasks/taskService";
import { STORAGE_KEYS } from "./constants/storageKeys";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication & Navigation Route States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  const currentView = (() => {
    const path = location.pathname;
    if (path.startsWith("/projects")) return "projects";
    if (path.startsWith("/tasks")) return "tasks";
    if (path.startsWith("/kanban")) return "kanban";
    if (path.startsWith("/chat")) return "chat";
    return "dashboard";
  })();

  // Unified In-Memory Datasets
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialChatMessages);
  const [selectedChannelId, setSelectedChannelId] = useState("ch-frontend");
  const [searchQuery, setSearchQuery] = useState("");

  // UI Drawer & Modal State Variables
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState<"task" | "project">("task");
  const [infoPaneOpen, setInfoPaneOpen] = useState(true);

  // New Project Fields State
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjStartDate, setNewProjStartDate] = useState("");
  const [newProjEndDate, setNewProjEndDate] = useState("");
  const [newProjStatus, setNewProjStatus] = useState<
    "active" | "on-hold" | "completed"
  >("active");
  const [projCreateLoading, setProjCreateLoading] = useState(false);
  const [projCreateError, setProjCreateError] = useState<string | null>(null);

  // New Task Fields State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskProjId, setNewTaskProjId] = useState("p-vision");
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState("u-david");
  const [newTaskPriority, setNewTaskPriority] =
    useState<TaskPriority>("Medium");
  const [newTaskDate, setNewTaskDate] = useState("Oct 28, 2023");

  // Helper function to fetch projects
  const fetchProjects = async () => {
    if (!currentUser) return;
    setProjectsLoading(true);
    setProjectsError(null);
    try {
      const apiProjects = await getAllProjects();
      setProjectsList(apiProjects.map(mapApiProjectToLocal));
    } catch (err: any) {
      setProjectsError(resolveProjectError(err));
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch projects from API whenever a user session is active
  useEffect(() => {
    fetchProjects();
  }, [currentUser]);

  // Fetch projects when navigating to Projects view (only if user is logged in)
  useEffect(() => {
    if (!currentUser || currentView !== "projects") return;
    fetchProjects();
  }, [currentView]);

  // Helper function to fetch/refresh tasks and projects
  const fetchTasksAndProjects = async () => {
    if (!currentUser) return;

    setTasksLoading(true);
    setTasksError(null);
    try {
      const response = await getAllTasks();
      // console.log('Fetched tasks and projects:', response);
      // Create a lookup map of projectId -> projectName for task mapping
      const projectNameMap: Record<string, string> = {};
      if (response.projects && response.projects.length > 0) {
        response.projects.forEach((p) => {
          projectNameMap[p._id] = p.name;
        });
        setProjectsList(response.projects.map(mapApiTaskProjectToLocal));
      }

      // Map tasks with correct project names
      setTasksList(
        response.tasks.map((t) =>
          mapApiTaskToLocal(
            t,
            projectNameMap[t.projectId] || "Unknown Project",
          ),
        ),
      );
    } catch (err: any) {
      setTasksError(resolveTaskError(err));
    } finally {
      setTasksLoading(false);
    }
  };

  // Fetch tasks when user logs in
  useEffect(() => {
    if (!currentUser) return;
    fetchTasksAndProjects();
  }, [currentUser]);

  // Fetch tasks when navigating to Tasks view (only if user is logged in)
  useEffect(() => {
    if (!currentUser || currentView !== "tasks") return;
    fetchTasksAndProjects();
  }, [currentView]);

  // Reset helper
  const resetFormFields = () => {
    setNewProjName("");
    setNewProjDesc("");
    setNewProjStartDate("");
    setNewProjEndDate("");
    setNewProjStatus("active");
    setProjCreateError(null);
    setNewTaskTitle("");
    setNewTaskDesc("");
  };

  // Unified navigation helper that resets the search query when switching views
  const handleNavigate = (
    view: "dashboard" | "projects" | "tasks" | "kanban" | "chat"
  ) => {
    navigate("/" + view);
    setSearchQuery("");
  };

  // Auth Action Handlers
  const handleLoginSuccess = (user: User) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    setCurrentUser(user);
    handleNavigate("dashboard");
  };

  const handleRegisterSuccess = (user: User) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    setCurrentUser(user);
    handleNavigate("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setCurrentUser(null);
    navigate("/login");
  };

  // Dynamic Content Filtering based on Search Box (Header)
  const getFilteredTasks = () => {
    if (!searchQuery.trim()) return tasksList;
    return tasksList.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const getFilteredProjects = () => {
    if (!searchQuery.trim()) return projectsList;
    return projectsList.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  // Chat Message Action Handlers
  const handleSendChatMessage = (content: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content,
      reactions: [],
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const handleSendCodeSnippet = (filename: string, code: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: `Pushed code snippet for ${filename}:`,
      reactions: [],
      codeSnippet: { filename, code },
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  // Kanban Action Handlers
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasksList((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );
  };

  const handleUpdateSubtask = (
    taskId: string,
    subtaskId: string,
    completed: boolean,
  ) => {
    setTasksList((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks?.map((s) =>
          s.id === subtaskId ? { ...s, completed } : s,
        );
        return { ...t, subtasks: updatedSubtasks };
      }),
    );
  };

  const handleAddTaskComment = (taskId: string, comment: string) => {
    setTasksList((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, commentsCount: (t.commentsCount || 0) + 1 };
      }),
    );
  };

  // Modal Creator Submission Handlers
  const handleCreateProject = async () => {
    if (!newProjName.trim() || !newProjStartDate || !newProjEndDate) return;

    // Get workspaceId from stored user data or token payload
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const workspaceId =
      parsedUser?.workspaceId ??
      parsedUser?.organization ??
      "507f1f77bcf86cd799439011";

    setProjCreateLoading(true);
    setProjCreateError(null);

    try {
      const created = await createProject({
        ...(workspaceId ? { workspaceId } : {}),
        name: newProjName.trim(),
        description: newProjDesc.trim() || "No project summary provided.",
        status: newProjStatus,
        startDate: new Date(newProjStartDate).toISOString(),
        endDate: new Date(newProjEndDate).toISOString(),
      });

      // Map API response to local Project shape
      const newProject: Project = {
        id: created._id,
        name: created.name,
        description: created.description,
        progress: created.progress,
        status: "In Progress",
        dueDate: new Date(created.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        category: "Mobile",
        team: [currentUser!],
      };

      setProjectsList((prev) => [newProject, ...prev]);
      setShowCreateModal(false);
      resetFormFields();
    } catch (err: any) {
      setProjCreateError(resolveProjectError(err));
    } finally {
      setProjCreateLoading(false);
    }
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    const selectedProjectObj = projectsList.find((p) => p.id === newTaskProjId);
    const selectedAssigneeObj = Object.values(users).find(
      (u) => u.id === newTaskAssigneeId,
    );

    const newTaskItem: Task = {
      id: `CF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTaskTitle.trim(),
      projectId: newTaskProjId,
      projectName: selectedProjectObj
        ? selectedProjectObj.name
        : "Workspace General",
      assignee: selectedAssigneeObj || users.alex,
      priority: newTaskPriority,
      status: "Todo",
      dueDate: newTaskDate,
      description: newTaskDesc.trim() || "No primary description registered.",
      subtasks: [],
      commentsCount: 0,
      attachmentsCount: 0,
    };

    setTasksList((prev) => [newTaskItem, ...prev]);
    setShowCreateModal(false);
    resetFormFields();
  };

  // Navigation callbacks directed from cards
  const handleSelectTaskFromOuter = (task: Task) => {
    // Navigate straight to Kanban board and trigger select drawer
    handleNavigate("kanban");
  };

  // Find active channel info
  const activeChannel =
    channels.find((c) => c.id === selectedChannelId) || channels[1];

  // Auth view branch gates & Routes setup
  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginView
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => navigate("/register")}
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <RegisterView
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => navigate("/login")}
            />
          )
        }
      />
      <Route
        path="/*"
        element={
          !currentUser ? (
            <Navigate to="/login" replace />
          ) : (
            <div className="flex h-screen overflow-hidden bg-surface select-none text-on-surface">
              {/* Smart adaptative navigation column header left (Screen 1-7 Left margin) */}
              <Sidebar
                currentView={currentView}
                onNavigate={handleNavigate}
                currentUser={currentUser}
                onLogout={handleLogout}
                selectedChannelId={selectedChannelId}
                onSelectChannel={setSelectedChannelId}
                openNewProjectModal={() => {
                  setModalType("project");
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
                    setModalType(currentView === "projects" ? "project" : "task");
                    setShowCreateModal(true);
                  }}
                />

                {/* Content Views Stage space */}
                <div className="flex-1 overflow-y-auto px-lg py-md custom-scrollbar bg-[#f8f9ff]">
                  <Routes>
                    <Route path="/dashboard" element={<DashboardView onNavigate={handleNavigate} />} />
                    <Route
                      path="/projects"
                      element={
                        <ProjectsView
                          projects={getFilteredProjects()}
                          onOpenCreateModal={() => {
                            setModalType("project");
                            setShowCreateModal(true);
                          }}
                          onNavigate={handleNavigate}
                          isLoading={projectsLoading}
                          error={projectsError}
                        />
                      }
                    />
                    <Route
                      path="/tasks"
                      element={
                        <TasksView
                          tasks={getFilteredTasks()}
                          projects={projectsList}
                          onSelectTask={handleSelectTaskFromOuter}
                          isLoading={tasksLoading}
                          error={tasksError}
                          onTaskCreated={() => {
                            // Refetch tasks and projects after successful task creation
                            fetchTasksAndProjects();
                          }}
                        />
                      }
                    />
                    <Route path="/kanban" element={<KanbanView tasks={getFilteredTasks()} onUpdateTaskStatus={handleUpdateTaskStatus} onUpdateSubtask={handleUpdateSubtask} onAddTaskComment={handleAddTaskComment} onOpenCreateModal={() => { }}
                    />} />
                    <Route path="/chat" element={<ChatView channel={activeChannel} messages={chatMessages} onSendMessage={handleSendChatMessage} onSendCodeSnippet={handleSendCodeSnippet} infoPaneOpen={infoPaneOpen} onToggleInfoPane={() => setInfoPaneOpen(!infoPaneOpen)} />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
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
                          Initiate New Project
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

                    {/* Project Form */}
                    <div className="space-y-sm text-xs text-on-surface-variant font-sans select-text">
                      <div>
                        <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">
                          Project Name *
                        </label>
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
                        <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">
                          Description
                        </label>
                        <textarea
                          value={newProjDesc}
                          onChange={(e) => setNewProjDesc(e.target.value)}
                          placeholder="Describe the project goals and scope..."
                          className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl p-md text-xs min-h-[80px] resize-none outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">
                          Status
                        </label>
                        <select
                          value={newProjStatus}
                          onChange={(e) =>
                            setNewProjStatus(
                              e.target.value as "active" | "on-hold" | "completed",
                            )
                          }
                          className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-3 text-xs outline-none focus:border-primary"
                        >
                          <option value="active">Active</option>
                          <option value="on-hold">On Hold</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-sm">
                        <div>
                          <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={newProjStartDate}
                            onChange={(e) => setNewProjStartDate(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-md text-xs outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs">
                            End Date *
                          </label>
                          <input
                            type="date"
                            value={newProjEndDate}
                            onChange={(e) => setNewProjEndDate(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-md text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Error message */}
                      {projCreateError && (
                        <p className="text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-lg px-sm py-xs">
                          {projCreateError}
                        </p>
                      )}

                      <button
                        onClick={handleCreateProject}
                        disabled={
                          !newProjName.trim() ||
                          !newProjStartDate ||
                          !newProjEndDate ||
                          projCreateLoading
                        }
                        className="w-full bg-primary hover:bg-[#6161ff] text-white py-2 px-4 rounded-xl text-xs font-headline font-bold mt-sm transition-all shadow-lg select-none disabled:opacity-50 flex items-center justify-center gap-xs"
                      >
                        {projCreateLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Creating...</span>
                          </>
                        ) : (
                          "Create Project"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }
      />
    </Routes>
  );
}

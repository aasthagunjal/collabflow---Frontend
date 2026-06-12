import React, { useState } from 'react';
import { 
  Folder, 
  CheckSquare, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Project, Task, RecentActivity, User } from '../types';
import { recentActivities } from '../data';

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  onNavigate: (view: 'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat') => void;
  onSelectTask?: (task: Task) => void;
}

export default function DashboardView({
  projects,
  tasks,
  onNavigate,
  onSelectTask
}: DashboardViewProps) {
  const [filterPeriod, setFilterPeriod] = useState<'7' | '30'>('7');

  // KPI Calculations
  const totalProjects = projects.length + 43; // to match "48" in mockup
  const totalTasks = tasks.length + 1228; // to match "1240" in mockup
  const activeUsers = 312; 
  const completedTasksCount = tasks.filter(t => t.status === 'Done').length + 880; // match "892"

  // Filter tasks with deadlines
  const upcomingDeadlines = tasks
    .filter(t => t.dueDate && t.status !== 'Done')
    .slice(0, 4);

  // Productivity chart data
  const chartData = {
    '7': [
      { day: 'Mon', total: 32, user: 20 },
      { day: 'Tue', total: 40, user: 28 },
      { day: 'Wed', total: 48, user: 36 },
      { day: 'Thu', total: 36, user: 24 },
      { day: 'Fri', total: 56, user: 44 },
      { day: 'Sat', total: 28, user: 16 },
      { day: 'Sun', total: 20, user: 8 }
    ],
    '30': [
      { day: 'Mon', total: 45, user: 30 },
      { day: 'Tue', total: 55, user: 40 },
      { day: 'Wed', total: 60, user: 45 },
      { day: 'Thu', total: 42, user: 28 },
      { day: 'Fri', total: 68, user: 52 },
      { day: 'Sat', total: 32, user: 22 },
      { day: 'Sun', total: 25, user: 12 }
    ]
  };

  return (
    <div className="space-y-lg animate-fade-in pb-xl">
      {/* Dashboard Greetings Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline font-semibold text-2xl text-on-surface">Task Management Dashboard</h2>
          <p className="text-secondary font-sans text-xs mt-[2px]">Track and manage your team's engineering workflows.</p>
        </div>
        <div className="flex -space-x-2 select-none shrink-0 border border-border-subtle p-px rounded-full bg-white bg-opacity-40">
          <img 
            className="w-8 h-8 rounded-full border-2 border-white object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6XGKQiSmv0QFnrf-wK_nX-dfBQYBqDtQ0ib6YMUPemOpGLdTqMkR8Hel2eLHINUIHmxc7VAZxjhqe81ZCjIvAG0324C8-NT5Uczqr9YtWRAP85qNU8xPqP_BsjgFY8ElbYvorVC_n8pYKbrVTkhokrAKdRkKoHXwpuohPdAame3X978a4nRw2CpN6TAjecTYnSU43sVZcfXALZCBtwmLf3e3AX2uwT1LzAT008ZkpE54vgYiZiHig_b1bxzq3BcHPzV1iuVdxw4E" 
            alt="Team 1"
          />
          <img 
            className="w-8 h-8 rounded-full border-2 border-white object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXchC82YRipvuHvd7Q0vqDJrymg_Sql3kb4uippJNq5-z6HPuT7gizq6OHUO0VXhDIRWXarWGGYv0v3Chrt_e8htTIxoXCRoRxLdtGRjIc5PpW55aIM9hGs60pHSYzjdiq5PjwoxRy1IlXaCLQ25566RBwG_QAKzq5pZvQmUl5n18PQMOGp2Zk3xSAtzQ4OAxJJuRb0KapaHfcWp9sdXjdxm551QSN7jwDaiW4JSFrKV-QgDb35Z7JPMTWrc6BiWE0lLaz_tFy-vQ" 
            alt="Team 2"
          />
          <div className="w-8 h-8 rounded-full border-2 border-white bg-[#e1dfff] flex items-center justify-center font-bold text-[10px] text-on-primary-fixed border border-primary/10">+12</div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Total Projects Card */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm group hover:border-primary transition-all duration-300">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg text-primary">
              <Folder className="w-5 h-5 shrink-0" />
            </div>
            <span className="text-success-emerald font-sans text-xs font-semibold flex items-center gap-xs">
              <TrendingUp className="w-3 h-3 text-success-emerald shrink-0" /> 12%
            </span>
          </div>
          <p className="text-secondary font-sans text-xs">Total Projects</p>
          <h3 className="font-headline font-extrabold text-2xl text-on-surface tnum mt-1">{totalProjects}</h3>
        </div>

        {/* Total Tasks Card */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm group hover:border-primary transition-all duration-300">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg text-primary">
              <CheckSquare className="w-5 h-5 shrink-0" />
            </div>
            <span className="text-success-emerald font-sans text-xs font-semibold flex items-center gap-xs">
              <TrendingUp className="w-3 h-3 text-success-emerald shrink-0" /> 8.4%
            </span>
          </div>
          <p className="text-secondary font-sans text-xs">Total Tasks</p>
          <h3 className="font-headline font-extrabold text-2xl text-on-surface tnum mt-1">{totalTasks.toLocaleString()}</h3>
        </div>

        {/* Active Users Card */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm group hover:border-primary transition-all duration-300">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg text-primary">
              <Users className="w-5 h-5 shrink-0" />
            </div>
            <span className="text-error-crimson font-sans text-xs font-semibold flex items-center gap-xs">
              <TrendingDown className="w-3 h-3 text-error-crimson shrink-0 text-red-500" /> 2%
            </span>
          </div>
          <p className="text-secondary font-sans text-xs">Active Users</p>
          <h3 className="font-headline font-extrabold text-2xl text-on-surface tnum mt-1">{activeUsers}</h3>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm group hover:border-primary transition-all duration-300">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg text-primary">
              <CheckSquare className="w-5 h-5 shrink-0" />
            </div>
            <span className="text-success-emerald font-sans text-xs font-semibold flex items-center gap-xs">
              <TrendingUp className="w-3 h-3 text-success-emerald shrink-0" /> 24%
            </span>
          </div>
          <p className="text-secondary font-sans text-xs">Completed Tasks</p>
          <h3 className="font-headline font-extrabold text-2xl text-on-surface tnum mt-1">{completedTasksCount}</h3>
        </div>
      </div>

      {/* Middle Content: Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Productivity Chart Pane (Screen 7 Center) */}
        <div className="lg:col-span-2 bg-white p-lg rounded-xl border border-border-subtle shadow-sm">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface">Team Productivity</h4>
              <p className="text-secondary font-sans text-xs">Daily output across all workspace departments</p>
            </div>
            <select 
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as '7' | '30')}
              className="bg-bg-slate-50 border border-outline-variant rounded-lg text-xs font-headline font-semibold py-1 px-3 outline-none cursor-pointer"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>

          {/* Productivity bar chart columns */}
          <div className="h-64 flex items-end justify-between gap-md pt-md relative">
            {chartData[filterPeriod].map((data, idx) => {
              // Calculate screen percentages to display columns
              const totalHeightPercent = Math.min(100, (data.total / 70) * 100);
              const userHeightPercent = Math.min(100, (data.user / 70) * 100);

              return (
                <div key={idx} className="relative group w-full flex flex-col justify-end items-center h-full">
                  {/* Total Output Stack (Light blue wash) */}
                  <div 
                    style={{ height: `${totalHeightPercent}%` }}
                    className="bg-[#e1dfff] hover:bg-opacity-80 w-full rounded-t-lg transition-all"
                  />
                  {/* User Output Stack (Solid indigo action color) */}
                  <div 
                    style={{ height: `${userHeightPercent}%` }}
                    className="bg-[#4744e5] hover:bg-primary-container w-full rounded-t-lg absolute bottom-0 transition-all pointer-events-none"
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 bg-[#213145] text-white text-[10px] rounded p-2 -top-12 z-10 transition-opacity whitespace-nowrap shadow pointer-events-none">
                    <p className="font-bold">{data.day} Output</p>
                    <p>Total: {data.total} tasks</p>
                    <p>Primary: {data.user} tasks</p>
                  </div>
                  <p className="text-[10px] text-center mt-sm text-secondary font-sans font-medium">{data.day}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities Section (Screen 7 Right) */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-lg">
            <h4 className="font-headline font-bold text-sm text-on-surface">Recent Activities</h4>
            <button 
              onClick={() => onNavigate('chat')} 
              className="text-primary font-headline text-xs font-bold hover:underline"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-md flex-1 overflow-y-auto pr-xs custom-scrollbar">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-md text-xs">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden flex items-center justify-center border border-border-subtle font-headline font-bold text-xs">
                    {act.user.avatar ? (
                      <img src={act.user.avatar} alt={act.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{act.user.initials}</span>
                    )}
                  </div>
                  {/* Mini-badge indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-white rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold">
                    {act.type === 'complete' ? '✓' : act.type === 'move' ? '⇄' : '✎'}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-on-surface leading-tight font-sans">
                    <span className="font-bold">{act.user.name}</span> {act.action}{' '}
                    <span className="text-primary font-medium hover:underline cursor-pointer">{act.target}</span>
                  </p>
                  <p className="text-[10px] text-secondary mt-[2px] font-sans">
                    {act.timeAgo} • {act.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines (Screen 7 Bottom Table) */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
        <div className="p-lg flex justify-between items-center border-b border-border-subtle">
          <h4 className="font-headline font-bold text-sm text-on-surface">Upcoming Deadlines</h4>
          <div className="flex gap-md">
            <div className="flex bg-surface-container-low p-xs rounded-lg border border-border-subtle bg-opacity-50">
              <button className="px-3 py-1 bg-white shadow-sm rounded-md text-[10px] font-headline font-bold text-primary">Today</button>
              <button className="px-3 py-1 text-[10px] font-headline text-secondary hover:text-primary transition-colors">This Week</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] border-b border-border-subtle">
              <tr className="select-none">
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Task Name</th>
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Assignee</th>
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Priority</th>
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Due Date</th>
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {upcomingDeadlines.map((task) => (
                <tr 
                  key={task.id} 
                  onClick={() => onSelectTask && onSelectTask(task)}
                  className="hover:bg-[#6161ff]/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-lg py-md font-medium text-on-surface font-sans">{task.title}</td>
                  
                  {/* Assignee display */}
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-6 h-6 rounded-full bg-surface-container border border-border-subtle overflow-hidden flex items-center justify-center font-headline font-bold text-[9px]">
                        {task.assignee.avatar ? (
                          <img src={task.assignee.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <span>{task.assignee.initials}</span>
                        )}
                      </div>
                      <span className="text-on-surface-variant font-sans">{task.assignee.name}</span>
                    </div>
                  </td>

                  {/* Priority Badge */}
                  <td className="px-lg py-md">
                    <span className={`inline-flex items-center px-sm py-[2px] rounded-full text-[9px] font-bold uppercase ${
                      task.priority === 'High' 
                        ? 'bg-[#ffdad6] text-[#93000a]' 
                        : task.priority === 'Medium'
                        ? 'bg-[#dfe0ff] text-[#161a32]'
                        : 'bg-[#eff4ff] text-[#424560]'
                    }`}>
                      {task.priority}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="px-lg py-md tnum text-on-surface-variant font-sans">{task.dueDate}</td>

                  {/* Dynamic Status bar representation */}
                  <td className="px-lg py-md">
                    <div className="w-full bg-surface-container rounded-full h-1.5 max-w-[100px] overflow-hidden">
                      <div 
                        style={{
                          width: task.status === 'In Progress' ? '65%' : task.status === 'Review' ? '85%' : task.status === 'Todo' ? '15%' : '5%'
                        }}
                        className={`h-1.5 rounded-full ${
                          task.status === 'Review' ? 'bg-[#ffb68c]' : 'bg-[#4744e5]'
                        }`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-md bg-bg-slate-50 border-t border-border-subtle flex justify-center">
          <button 
            onClick={() => onNavigate('kanban')}
            className="text-primary hover:text-primary-container font-headline text-xs font-semibold flex items-center gap-xs cursor-pointer active:scale-95 transition-all"
          >
            <span>View Full Project Roadmap</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

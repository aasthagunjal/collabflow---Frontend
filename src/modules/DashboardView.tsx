import React, { useEffect, useState } from 'react';
import {
  Folder,
  CheckSquare,
  Users,
  Clock,
  TrendingUp,
  CalendarDays,
  AlertCircle,
} from 'lucide-react';
import { getDashboard, DashboardData } from '../services/dashboard/dashboardService';

interface DashboardViewProps {
  onNavigate: (view: 'dashboard' | 'projects' | 'tasks' | 'kanban' | 'chat') => void;
}

/** Reusable shimmer block */
const Shimmer = ({ className }: { className: string }) => (
  <div className={`shimmer rounded-lg ${className}`} />
);

const PRIORITY_STYLE: Record<string, string> = {
  high: 'bg-[#ffdad6] text-[#93000a]',
  medium: 'bg-[#dfe0ff] text-[#161a32]',
  low: 'bg-[#eff4ff] text-[#424560]',
  critical: 'bg-red-100 text-red-700',
};

const STATUS_STYLE: Record<string, string> = {
  open: 'bg-[#eff4ff] text-primary',
  'in-progress': 'bg-[#e5eeff] text-[#4744e5]',
  review: 'bg-[#ffdbc9] text-[#753400]',
  done: 'bg-emerald-50 text-emerald-600',
};

const formatDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getDashboard();
        setData(result);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const summary = data?.summary;
  const productivity = data?.teamProductivity;
  const activities = data?.recentActivities ?? [];
  const deadlines = data?.upcomingDeadlines ?? [];
  const projectProgress = data?.projectProgress?.projects ?? [];

  // Chart: normalise series values to percentages
  const maxVal = Math.max(1, ...(productivity?.series.map(s => s.value) ?? [1]));

  return (
    <div className="space-y-lg animate-fade-in pb-xl">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline font-semibold text-2xl text-on-surface">Dashboard</h2>
          <p className="text-secondary font-sans text-xs mt-[2px]">Track and manage your team's engineering workflows.</p>
        </div>
      </div>

      {/* Error banner */}
      {!loading && error && (
        <div className="flex items-center gap-sm bg-red-50 border border-red-200 rounded-xl px-lg py-md">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Total Projects */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm hover:border-primary transition-all duration-300">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg text-primary">
              <Folder className="w-5 h-5 shrink-0" />
            </div>
          </div>
          <p className="text-on-surface font-sans text-xs font-bold">Total Projects</p>
          {loading ? (
            <Shimmer className="h-8 w-16 mt-1" />
          ) : (
            <h3 className="font-headline font-semibold text-2xl text-on-surface tnum mt-1">
              {summary?.totalProjects ?? 0}
            </h3>
          )}
        </div>

        {/* Total Tasks */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm hover:border-primary transition-all duration-300">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg text-primary">
              <CheckSquare className="w-5 h-5 shrink-0" />
            </div>
          </div>
          <p className="text-on-surface font-sans text-xs font-bold">Total Tasks</p>
          {loading ? (
            <Shimmer className="h-8 w-16 mt-1" />
          ) : (
            <h3 className="font-headline font-semibold text-2xl text-on-surface tnum mt-1">
              {summary?.totalTasks ?? 0}
            </h3>
          )}
        </div>

        {/* Active Users */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm hover:border-primary transition-all duration-300">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg text-primary">
              <Users className="w-5 h-5 shrink-0" />
            </div>
          </div>
          <p className="text-on-surface font-sans text-xs font-bold">Active Users</p>
          {loading ? (
            <Shimmer className="h-8 w-16 mt-1" />
          ) : (
            <h3 className="font-headline font-semibold text-2xl text-on-surface tnum mt-1">
              {summary?.activeUsers ?? 0}
            </h3>
          )}
        </div>

        {/* Completed Tasks */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm hover:border-primary transition-all duration-300">
          <div className="flex justify-between items-start mb-sm">
            <div className="p-sm bg-surface-container rounded-lg text-primary">
              <Clock className="w-5 h-5 shrink-0" />
            </div>
          </div>
          <p className="text-on-surface font-sans text-xs font-bold">Completed Tasks</p>
          {loading ? (
            <Shimmer className="h-8 w-16 mt-1" />
          ) : (
            <h3 className="font-headline font-semibold text-2xl text-on-surface tnum mt-1">
              {summary?.completedTasks ?? 0}
            </h3>
          )}
        </div>
      </div>

      {/* Middle: Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

        {/* Team Productivity Chart */}
        <div className="lg:col-span-2 bg-white p-lg rounded-xl border border-border-subtle shadow-sm">
          <div className="flex justify-between items-center mb-xl">
            <div>
              <h4 className="font-headline font-bold text-sm text-on-surface">Team Productivity</h4>
              <p className="text-secondary font-sans text-xs">
                {productivity?.label ?? 'Last 7 Days'} — tasks completed per day
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-end justify-between gap-md pt-md">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center h-full gap-sm">
                  <Shimmer
                    className="w-full"
                    {...({
                      style: { height: `${30 + Math.random() * 50}%` },
                    } as any)}
                  />

                  <Shimmer className="h-3 w-8" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-md pt-md relative">
              {(productivity?.series ?? []).map((point, idx) => {
                const heightPercent = Math.max(4, (point.value / maxVal) * 100);
                const label = new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={idx} className="relative group w-full flex flex-col justify-end items-center h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="bg-[#4744e5] hover:bg-primary-container w-full rounded-t-lg transition-all"
                    />
                    <div className="absolute opacity-0 group-hover:opacity-100 bg-[#213145] text-white text-[10px] rounded p-2 -top-12 z-10 transition-opacity whitespace-nowrap shadow pointer-events-none">
                      <p className="font-bold">{point.date}</p>
                      <p>Tasks: {point.value}</p>
                    </div>
                    <p className="text-[10px] text-center mt-sm text-secondary font-sans font-medium">{label}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-lg rounded-xl border border-border-subtle shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-lg">
            <h4 className="font-headline font-bold text-sm text-on-surface">Recent Activities</h4>
          </div>

          <div className="space-y-md flex-1 overflow-y-auto pr-xs custom-scrollbar">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-md">
                  <Shimmer className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-xs">
                    <Shimmer className="h-3 w-full" />
                    <Shimmer className="h-2.5 w-2/3" />
                  </div>
                </div>
              ))
            ) : activities.length === 0 ? (
              <p className="text-xs text-secondary italic text-center py-lg">No recent activity</p>
            ) : (
              activities.map((act) => {
                const initials = act.actor.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <div key={act.activityId} className="flex gap-md text-xs">
                    <div className="w-8 h-8 rounded-full bg-[#e5eeff] text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-on-surface leading-tight font-sans">
                        <span className="font-bold">{act.actor}</span>{' '}
                        <span className="text-secondary">{act.action}</span>{' '}
                        <span className="text-primary font-medium">{act.target}</span>
                      </p>
                      <p className="text-[10px] text-secondary mt-[2px] font-sans">
                        {formatDate(act.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Project Progress */}
      {(loading || projectProgress.length > 0) && (
        <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="p-lg border-b border-border-subtle flex items-center justify-between">
            <h4 className="font-headline font-bold text-sm text-on-surface">Project Progress</h4>
            {data?.projectProgress?.overallProgress !== undefined && (
              <span className="text-xs text-secondary font-headline">
                Overall: <span className="font-bold text-primary">{data.projectProgress.overallProgress}%</span>
              </span>
            )}
          </div>
          <div className="p-lg space-y-md">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-xs">
                  <div className="flex justify-between">
                    <Shimmer className="h-3 w-40" />
                    <Shimmer className="h-3 w-10" />
                  </div>
                  <Shimmer className="h-2 w-full" />
                </div>
              ))
            ) : (
              projectProgress.map(proj => (
                <div key={proj.projectId} className="space-y-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                      <span
                        className="font-sans text-xs font-semibold text-on-surface cursor-pointer hover:text-primary hover:underline transition-colors"
                        onClick={() => onNavigate('projects')}
                      >
                        {proj.name}
                      </span>
                      <span className={`px-2 py-[2px] rounded text-[9px] font-bold uppercase tracking-wider ${STATUS_STYLE[proj.status] ?? 'bg-[#eff4ff] text-primary'}`}>
                        {proj.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-md text-[10px] text-secondary font-headline shrink-0">
                      <span>{proj.completedTasks}/{proj.totalTasks} tasks</span>
                      <span className="font-extrabold text-on-surface">{proj.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  {proj.dueDate && (
                    <p className="text-[10px] text-secondary flex items-center gap-xs">
                      <CalendarDays className="w-3 h-3" />
                      Due {formatDate(proj.dueDate)}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-xl border border-border-subtle shadow-sm overflow-hidden">
        <div className="p-lg flex justify-between items-center border-b border-border-subtle">
          <h4 className="font-headline font-bold text-sm text-on-surface">Upcoming Deadlines</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] border-b border-border-subtle">
              <tr className="select-none">
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Task</th>
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Assignee</th>
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Priority</th>
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Due Date</th>
                <th className="px-lg py-md font-headline text-[10px] font-semibold text-secondary uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-lg py-md"><Shimmer className="h-3 w-40" /></td>
                    <td className="px-lg py-md"><Shimmer className="h-3 w-24" /></td>
                    <td className="px-lg py-md"><Shimmer className="h-5 w-16 rounded-full" /></td>
                    <td className="px-lg py-md"><Shimmer className="h-3 w-24" /></td>
                    <td className="px-lg py-md"><Shimmer className="h-5 w-20 rounded-full" /></td>
                  </tr>
                ))
              ) : deadlines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-lg py-xl text-center text-secondary font-headline text-xs">
                    No upcoming deadlines
                  </td>
                </tr>
              ) : (
                deadlines.map((item) => (
                  <tr key={item.taskId} className="transition-colors hover:bg-[#f8f9ff]">
                    <td className="px-lg py-md font-medium text-on-surface font-sans">{item.name}</td>
                    <td className="px-lg py-md text-on-surface-variant font-sans">
                      {item.assignee ?? <span className="italic text-secondary">Unassigned</span>}
                    </td>
                    <td className="px-lg py-md">
                      <span className={`inline-flex items-center px-sm py-[2px] rounded-full text-[9px] font-bold uppercase ${PRIORITY_STYLE[item.priority?.toLowerCase()] ?? 'bg-[#eff4ff] text-secondary'}`}>
                        {cap(item.priority)}
                      </span>
                    </td>
                    <td className="px-lg py-md tnum text-on-surface-variant font-sans whitespace-nowrap">
                      {formatDate(item.dueDate)}
                    </td>
                    <td className="px-lg py-md">
                      <span className={`inline-flex items-center px-sm py-[2px] rounded-full text-[9px] font-bold uppercase ${STATUS_STYLE[item.status?.toLowerCase()] ?? 'bg-[#eff4ff] text-secondary'}`}>
                        {cap(item.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Loader2, ListTodo } from 'lucide-react';
import { createTask, resolveTaskError } from '../../services/tasks/taskService';
import { Project } from '../../types';

interface CreateTaskModalProps {
    projects: Project[];
    onClose: () => void;
    onCreated: (task: {
        id: string;
        title: string;
        projectId: string;
        projectName: string;
        priority: string;
        status: string;
        dueDate: string;
        description: string;
    }) => void;
}

/**
 * ⚠️ TEMPORARY: Hardcoded assignee IDs for Create Task API
 * This is a temporary workaround until user/developer management is integrated.
 * Will be replaced with dynamic assignee selection once available.
 */
const TEMPORARY_ASSIGNEE_IDS = [
    'user-101',
    'user-102',
    'user-103',
    'user-104',
    'user-105',
    'user-106',
    'user-107',
];

/**
 * ⚠️ TEMPORARY: Utility to randomly select an assignee ID
 * This is a temporary workaround until user/developer management is integrated.
 */
const getRandomAssigneeId = (): string => {
    const randomIndex = Math.floor(Math.random() * TEMPORARY_ASSIGNEE_IDS.length);
    return TEMPORARY_ASSIGNEE_IDS[randomIndex];
};

const LABEL = 'text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block mb-xs';
const INPUT = 'w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-md text-xs outline-none focus:border-primary transition-colors';
const SELECT = 'w-full bg-[#f8fafc] border border-[#c7c4d8] rounded-xl py-sm px-3 text-xs outline-none focus:border-primary transition-colors';

export default function CreateTaskModal({ projects, onClose, onCreated }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
    const [taskType, setTaskType] = useState('task');
    const [statusId, setStatusId] = useState('open');
    const [dueDate, setDueDate] = useState('');
    const [storyPoints, setStoryPoints] = useState('');
    const [timeEstimate, setTimeEstimate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!title.trim() || !projectId) return;
        setLoading(true);
        setError(null);

        try {
            // ⚠️ TEMPORARY: Get random assignee ID for Create Task API
            const assigneeId = getRandomAssigneeId();

            const created = await createTask({
                projectId,
                title: title.trim(),
                description: description.trim() || undefined,
                taskType,
                statusId,
                priority,
                assigneeId, // ⚠️ TEMPORARY: Randomly assigned until user management is integrated
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                storyPoints: storyPoints ? parseInt(storyPoints) : undefined,
                timeEstimateHours: timeEstimate ? parseFloat(timeEstimate) : undefined,
            });

            const selectedProject = projects.find(p => (p as any)._id === projectId || p.id === projectId);

            onCreated({
                id: created.key || created._id,
                title: created.title,
                projectId: created.projectId,
                projectName: selectedProject?.name ?? 'Unknown Project',
                priority: created.priority,
                status: created.statusId,
                dueDate: created.dueDate
                    ? new Date(created.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—',
                description: created.description ?? '',
            });

            onClose();
        } catch (err: any) {
            setError(resolveTaskError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-md">
            <div className="bg-white border border-border-subtle rounded-2xl w-full max-w-[520px] shadow-2xl animate-scale-up flex flex-col gap-md p-lg max-h-[90vh] overflow-y-auto custom-scrollbar">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-border-subtle pb-xs">
                    <div className="flex items-center gap-sm">
                        <div className="p-sm bg-[#e5eeff] rounded-lg">
                            <ListTodo className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">New Task</p>
                            <h3 className="font-headline font-bold text-sm text-on-surface leading-tight">Create Task</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-secondary hover:bg-surface-container active:scale-90 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-sm">

                    {/* Title */}
                    <div>
                        <label className={LABEL}>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Implement dashboard card"
                            className={INPUT}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={LABEL}>Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe the task goals..."
                            className={`${INPUT} min-h-[72px] resize-none py-sm`}
                        />
                    </div>

                    {/* Project */}
                    <div>
                        <label className={LABEL}>Project *</label>
                        <select value={projectId} onChange={e => setProjectId(e.target.value)} className={SELECT}>
                            {projects.length === 0 && (
                                <option value="">No projects available</option>
                            )}
                            {projects.map(p => (
                                <option key={(p as any)._id ?? p.id} value={(p as any)._id ?? p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Task Type + Status */}
                    <div className="grid grid-cols-2 gap-sm">
                        <div>
                            <label className={LABEL}>Task Type</label>
                            <select value={taskType} onChange={e => setTaskType(e.target.value)} className={SELECT}>
                                <option value="task">Task</option>
                                <option value="bug">Bug</option>
                                <option value="story">Story</option>
                                <option value="epic">Epic</option>
                            </select>
                        </div>
                        <div>
                            <label className={LABEL}>Status</label>
                            <select value={statusId} onChange={e => setStatusId(e.target.value)} className={SELECT}>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    {/* Priority + Due Date */}
                    <div className="grid grid-cols-2 gap-sm">
                        <div>
                            <label className={LABEL}>Priority</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as typeof priority)}
                                className={SELECT}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className={LABEL}>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                className={INPUT}
                            />
                        </div>
                    </div>

                    {/* Story Points + Time Estimate */}
                    <div className="grid grid-cols-2 gap-sm">
                        <div>
                            <label className={LABEL}>Story Points</label>
                            <input
                                type="number"
                                min="0"
                                value={storyPoints}
                                onChange={e => setStoryPoints(e.target.value)}
                                placeholder="e.g. 3"
                                className={INPUT}
                            />
                        </div>
                        <div>
                            <label className={LABEL}>Time Estimate (hrs)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={timeEstimate}
                                onChange={e => setTimeEstimate(e.target.value)}
                                placeholder="e.g. 8"
                                className={INPUT}
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-lg px-sm py-xs">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!title.trim() || !projectId || loading}
                        className="w-full bg-primary hover:bg-[#6161ff] text-white py-2 px-4 rounded-xl text-xs font-headline font-bold mt-xs transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-xs"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            'Create Task'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}

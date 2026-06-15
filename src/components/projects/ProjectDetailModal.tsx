import React, { useEffect, useState } from 'react';
import {
    X,
    Calendar,
    User,
    Users,
    FolderGit2,
    AlertCircle,
    TrendingUp,
} from 'lucide-react';
import { viewProject, ViewProjectResponse } from '../../services/projects/projectService';

interface ProjectDetailModalProps {
    projectId: string;
    onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    'on-hold': 'bg-amber-50 text-amber-600 border border-amber-200',
    completed: 'bg-blue-50 text-blue-600 border border-blue-200',
    archived: 'bg-gray-100 text-gray-500 border border-gray-200',
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

/** Reusable shimmer block */
const Shimmer = ({ className }: { className: string }) => (
    <div className={`shimmer rounded-lg ${className}`} />
);

/** Skeleton that mirrors the real content layout */
function ProjectDetailSkeleton() {
    return (
        <div className="space-y-md">
            {/* Status + progress row */}
            <div className="flex items-center gap-md">
                <Shimmer className="h-6 w-20" />
                <div className="flex-1 flex items-center gap-sm">
                    <Shimmer className="h-2 flex-1" />
                    <Shimmer className="h-4 w-8" />
                </div>
            </div>

            {/* Description block */}
            <div>
                <Shimmer className="h-3 w-24 mb-xs" />
                <Shimmer className="h-16 w-full" />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-sm">
                <div className="bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm space-y-xs">
                    <Shimmer className="h-3 w-16" />
                    <Shimmer className="h-4 w-24" />
                </div>
                <div className="bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm space-y-xs">
                    <Shimmer className="h-3 w-16" />
                    <Shimmer className="h-4 w-24" />
                </div>
            </div>

            {/* Manager */}
            <div>
                <Shimmer className="h-3 w-28 mb-sm" />
                <div className="flex items-center gap-sm bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm">
                    <Shimmer className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-xs">
                        <Shimmer className="h-3 w-32" />
                        <Shimmer className="h-2.5 w-44" />
                    </div>
                </div>
            </div>

            {/* Members */}
            <div>
                <Shimmer className="h-3 w-20 mb-sm" />
                <div className="flex items-center gap-sm bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm">
                    <Shimmer className="h-7 w-7 rounded-full shrink-0" />
                    <div className="flex-1 space-y-xs">
                        <Shimmer className="h-3 w-28" />
                        <Shimmer className="h-2.5 w-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProjectDetailModal({ projectId, onClose }: ProjectDetailModalProps) {
    const [data, setData] = useState<ViewProjectResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await viewProject(projectId);
                setData(result);
            } catch (err: any) {
                setError(err.message ?? 'Failed to load project details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [projectId]);

    const project = data?.project;
    const manager = data?.manager;
    const members = data?.members ?? [];
    const statusLabel = project?.status ?? '';
    const statusStyle = STATUS_STYLES[statusLabel] ?? 'bg-[#eff4ff] text-primary border border-[#c7c4d8]';

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-md">
            <div className="bg-white border border-border-subtle rounded-2xl w-full max-w-[560px] shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-lg pt-lg pb-md border-b border-border-subtle shrink-0">
                    <div className="flex items-center gap-sm">
                        <div className="p-sm bg-[#e5eeff] rounded-lg">
                            <FolderGit2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">Project Details</p>
                            {loading ? (
                                <Shimmer className="h-4 w-40 mt-[3px]" />
                            ) : (
                                <h3 className="font-headline font-bold text-sm text-on-surface leading-tight mt-[1px]">
                                    {project?.name}
                                </h3>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-secondary hover:bg-surface-container active:scale-90 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body — fixed height keeps the popup size steady during loading */}
                <div className="overflow-y-auto px-lg py-md custom-scrollbar h-[420px]">

                    {/* Shimmer skeleton while loading */}
                    {loading && <ProjectDetailSkeleton />}

                    {/* Error state */}
                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center py-[60px] gap-sm text-center">
                            <AlertCircle className="w-7 h-7 text-red-400" />
                            <p className="text-sm font-semibold text-on-surface">Could not load project</p>
                            <p className="text-xs text-secondary">{error}</p>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && project && (
                        <div className="space-y-md">

                            {/* Status + Progress */}
                            <div className="flex items-center gap-md">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle}`}>
                                    {statusLabel}
                                </span>
                                <div className="flex-1 flex items-center gap-sm">
                                    <TrendingUp className="w-3.5 h-3.5 text-secondary shrink-0" />
                                    <div className="flex-1 h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-extrabold text-on-surface font-headline w-8 text-right">
                                        {project.progress}%
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {project.description && (
                                <div>
                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-xs">
                                        Description
                                    </label>
                                    <p className="text-xs text-on-surface-variant leading-relaxed bg-[#f8fafc] rounded-xl px-md py-sm border border-border-subtle">
                                        {project.description}
                                    </p>
                                </div>
                            )}

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-sm">
                                <div className="bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm">
                                    <div className="flex items-center gap-xs mb-xs">
                                        <Calendar className="w-3 h-3 text-secondary" />
                                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                                            Start Date
                                        </label>
                                    </div>
                                    <p className="text-xs font-semibold text-on-surface">{formatDate(project.startDate)}</p>
                                </div>
                                <div className="bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm">
                                    <div className="flex items-center gap-xs mb-xs">
                                        <Calendar className="w-3 h-3 text-secondary" />
                                        <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                                            End Date
                                        </label>
                                    </div>
                                    <p className="text-xs font-semibold text-on-surface">{formatDate(project.endDate)}</p>
                                </div>
                            </div>

                            {/* Manager */}
                            <div>
                                <div className="flex items-center gap-xs mb-sm">
                                    <User className="w-3.5 h-3.5 text-secondary" />
                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                                        Project Manager
                                    </label>
                                </div>
                                {manager ? (
                                    <div className="flex items-center gap-sm bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm">
                                        <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                            {getInitials(manager.firstName, manager.lastName)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-on-surface">
                                                {manager.firstName} {manager.lastName}
                                            </p>
                                            <p className="text-[10px] text-secondary">{manager.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-secondary italic">No manager assigned</p>
                                )}
                            </div>

                            {/* Members */}
                            <div>
                                <div className="flex items-center gap-xs mb-sm">
                                    <Users className="w-3.5 h-3.5 text-secondary" />
                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                                        Members {members.length > 0 && `(${members.length})`}
                                    </label>
                                </div>
                                {members.length > 0 ? (
                                    <div className="flex flex-col gap-xs">
                                        {members.map((m) => (
                                            <div
                                                key={m._id}
                                                className="flex items-center gap-sm bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-[#e5eeff] text-primary flex items-center justify-center font-bold text-[9px] shrink-0">
                                                    {getInitials(m.firstName, m.lastName)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-on-surface">
                                                        {m.firstName} {m.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-secondary">{m.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-secondary italic bg-[#f8fafc] border border-border-subtle rounded-xl px-md py-sm">
                                        No members added yet
                                    </p>
                                )}
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-lg py-md border-t border-border-subtle shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2 rounded-xl text-xs font-headline font-semibold text-secondary border border-border-subtle hover:bg-surface-container transition-all"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

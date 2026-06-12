import { TaskPriority, TaskStatus } from '../types/common';

export const getPriorityTheme = (priority: TaskPriority) => {
  switch (priority) {
    case 'High':
      return { bg: 'bg-[#ffdad6] text-[#93000a]', text: 'High' };
    case 'Medium':
      return { bg: 'bg-[#dfe0ff] text-[#161a32]', text: 'Medium' };
    default:
      return { bg: 'bg-[#eff4ff] text-[#424560]', text: 'Low' };
  }
};

export const getStatusTheme = (status: TaskStatus) => {
  switch (status) {
    case 'Done':
      return { bg: 'bg-[#10b981]/10 text-[#10b981]', text: 'Done' };
    case 'In Progress':
      return { bg: 'bg-[#e5eeff] text-[#4744e5]', text: 'In Progress' };
    case 'Review':
      return { bg: 'bg-[#ffdbc9] text-[#753400]', text: 'Review' };
    case 'Todo':
      return { bg: 'bg-white border border-border-subtle text-[#5a5c79]', text: 'Todo' };
    default:
      return { bg: 'bg-[#eff4ff] text-[#464555]', text: 'Backlog' };
  }
};

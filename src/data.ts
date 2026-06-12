import { User, Project, Task, ChatMessage, Channel, RecentActivity } from './types';

// Standard Users
export const users: Record<string, User> = {
  alex: {
    id: 'u-alex',
    name: 'Alex Rivera',
    email: 'alex@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYid7L3duy1tWGLKpRsaDjuHLPSrbYU18iBJh5UHaO5EDOsn5JQtcckR1lweM4l5fM9ZTOCd85OA8dal_V3uc_0HVE30CkpV5p3LtaG1MIn95U3vHKBHd4L_5X55RGqbjaWMd-aJrjNXfnd_eMFjSo9VRW73zuYe-8UIBaPW0Ig1aCref7O_1kq8vKlY3nvXWwEb18SvHFAHj445mM8QzorP5ZBd3kFo66TvRnbj8MxANA0Kc5R3d5pGCviNLPqO4LMPfYlbwUP_Q',
    role: 'Workspace Admin',
    organization: 'CollabFlow Enterprise',
    initials: 'AR'
  },
  jordan: {
    id: 'u-jordan',
    name: 'Jordan Smith',
    email: 'jordan@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV6r5JEm4JwmySAXBaPcPM0Dp9a9cMNwr2ZcOUAGi-cRn7wN12FsCIhw246EnrC0MjV_wRVTN7-SmFpgWQQmwGjgFPLYNeoYv6cuGyBB-HPWLO5rDPpvibe4vJWgy2PkJ6lVDyirnWY95OyzziUwo5GdTRno-7Capo1COxK_eRFsvOScxt7p7WdUqZRXK2exrv8qJFFdgoFK44JAlfj1g-TCG-YrfcV79M2NkrXvwSim_86W9faDJVXNBn1MIyl6-FiBteZfAH5Pc',
    role: 'Lead Frontend Developer',
    organization: 'CollabFlow Enterprise',
    initials: 'JS'
  },
  david: {
    id: 'u-david',
    name: 'David Chen',
    email: 'david@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpEGS8DWpeLAICqL0PkPNklOH5jX2cT_40nrLrl0BMn1DlSzEsKBHefwfxQl9p8xaz9RmC7qKMe4ZX2PANJfZ-MQKziCe26jluZKxCEJhHHeWbA8qEiZgoBCfJxbMib7ae3AOOI7d_EfJjdEHuETI8RUcv0dAuuBbDA18BmvOIG5OvbvAa-TpGoDGzGsx_Cf-05BiQhFcS8LYZ4rb90YqqRMlBnLA8w1bpcJ0padvCzfh0mduvwpXy2oesX5Uqfv7e84TUA8yj4UU',
    role: 'Principal Backend Architect',
    organization: 'CollabFlow Enterprise',
    initials: 'DC'
  },
  sarahChen: {
    id: 'u-sarahc',
    name: 'Sarah Chen',
    email: 'sarah.c@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPPdFcnThsORuC5oyzhcgqHayXuslrUTuZFyhu3q-uxuu_C4yq2hKM3QQa7K__eTfIrrGCuUbTyfCf5ZL60cOnA6GmMQdzdFlaiAhnaHF9cpxnCpjOXj0zhVwXoe_Uvgj8_etaU5Wncsl2nCeUYUG8jWRMj4S5v0xkgiQ--Dzx9lpxWp00NQr6r3wQUgCGw_2iDt5i7sUts_SxHrMzOfhM21zJEeW6_Ty6leSwJUo0AFOhxiuNjg3jCVJSsstWZx2tz6v-FPUMQhw',
    role: 'UI Designer',
    organization: 'CollabFlow Enterprise',
    initials: 'SC'
  },
  casey: {
    id: 'u-casey',
    name: 'Casey Jones',
    email: 'casey@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALNSjSSilyt4LBMOId7MAvm83SMjEafQ-Sx2QS9g121fViIHD4c8Cork7v_mSLIfIyeCWwd_qDQ6sXV__Uc-2qLSYYZGFTL1HzCNwND8p3xtlxlWH3eb8oaHGqiuZms_F55hVosLTDjApQK449JjaHo25BRBHzVQx0oBkVYQX3PPWP3yAhtCybCu7HEa_d2Aig_pRaWJBfCT-GMlc6pC6LuFRHCqgbrdvmy0b_HaJaqG0641EhGxN6CVO0XW-w7oGYCGYVOLA9DOE',
    role: 'Lead QA Engineer',
    organization: 'CollabFlow Enterprise',
    initials: 'CJ'
  },
  elena: {
    id: 'u-elena',
    name: 'Elena Vance',
    email: 'elena@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuxyeZtaVCMxH7sPQ0VMqGS3g2Uj8MWbmnCwyUXyKDJ2gWobyLGFuFQ-52A3IYZp8RBGxIuef-FNTGo5be2FAhy5xD3vV7gz7rMYKUa1hRU56VRyA_fh0yzOaPUjl0ZhFHsB9bsZBfVFl88TmJHDfGr1mtMrcISOibWQWOM1vjc6ju0kEqIu1gzRUNsR1lKdsf5Z3v0nsK9nZs-JlOBpMwhSXhn7nbmTdZpVBxRXLj27SOb6Xif7jJBBFl63Aznjdw_i9KdxspKp4',
    role: 'Technical Writer',
    organization: 'CollabFlow Enterprise',
    initials: 'EV'
  },
  marcus: {
    id: 'u-marcus',
    name: 'Marcus Wright',
    email: 'marcus@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA93TV2esgHPbwgR9qVlKCXvDsg_cJ9zPSWo_LIQk46Ezwd_U5S0SCp2LrWWLQ2uGCS2G2cAQtR9ofnPfhzxu1B8KMxVxCT560T1ZAPl2awovKNEupwnSff7kGizkK4vCuXAhe0O65K15AFl4DiB-skh-AaIKEhQpGIwW1mjjkJbi1z1GEhAXcv7FSB3j63zTO9JpIOiclFhhSKec2ss7mYkPkfzzWAMfRLkhd6VNh2t1ns1ZcJ9V94UcKNEoJNkXk2fhs_6lqoJac',
    role: 'Senior Project Manager',
    organization: 'CollabFlow Enterprise',
    initials: 'MW'
  },
  jessica: {
    id: 'u-jessica',
    name: 'Jessica Park',
    email: 'jessica@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbRtxKYTaijV2CeImVst1agAr_fyUZS9YVXAQ5GO4Q_O6V3SIk28tnfPBcIOMMkt0C-oWi3DcjKpz0IPWg5c5wN9qhl3p8cwZrpV0WAEcsHnjGx2KBReXuRXj97-ICaWyH9kQ7eEtckM3WGVd1IJO_38SIvVJF_6X4c2vzJmEhD34mnanO4dMZUknHgDpKrZvP_Oa9BDotFmMJTDWdYoAXizbZTyftlKg3c4t0o_zIQARw1nAHCZKJ3C6NhGy564V3G9Kg1qpe92c',
    role: 'QA Analyst',
    organization: 'CollabFlow Enterprise',
    initials: 'JP'
  },
  johnDoe: {
    id: 'u-john',
    name: 'John Doe',
    email: 'john@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjL9duZCFEcPEsJ8e33XhPIeeYy4eaP0X1jfBu531iY9pNtOcFVclYzhlfUBnw7l7EwUkpFPI2xuar4u1PRpAIvv7mvQU2VzxYY05q51Mhi64h8K2GqrMqBJCdTdWL3i4-zSwDpUYJxmu4CA56FDCRLPKlIeTa77pnLRH8AQiNhya3dIXtuPitbCRW62WNawKve4NUAHF6I8R7b9jtGNC8Ld-71mc1JmCFhj6WbTwRojorDTPYIoWeE-exa1OiQeTxlKk-q5J0SNg',
    role: 'Workspace Member',
    organization: 'CollabFlow Enterprise',
    initials: 'JD'
  },
  johnSmith: {
    id: 'u-jsmith',
    name: 'John Smith',
    email: 'john.smith@collabflow.com',
    avatar: '', // Initial fallback
    role: 'SysOps Administrator',
    organization: 'CollabFlow Enterprise',
    initials: 'JS'
  },
  elizaThorne: {
    id: 'u-eliza',
    name: 'Eliza Thorne',
    email: 'eliza.t@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8JZXq9vT4Ra174nyk8vQRTUMzxWObX_aqbOuKnzPmGjghNLLtcNeE0QVbmtVjMPU_XiYxO7sFBS6xnS-3yoUWSshYkoUJVi_FApplpjTZ4sStwovI9CvztjrtZ1U9bF1Ook1-oLYxdjhsWxxXhmPH7Hz5QrySPmM8DcszhoLLcJtQi4idcZ4W5i7anNskshQMjPxSK0xCKtFCpskCO_vJY5BpLCYZoQlmpJkaK8AYgC_s9x_1YXGtwXTVglCpyR5Vl9r0o72Dcvo',
    role: 'Principal UX Writer',
    organization: 'CollabFlow Enterprise',
    initials: 'ET'
  },
  markFoster: {
    id: 'u-mark',
    name: 'Mark Foster',
    email: 'mark@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVpQLJDvpUYdQcTHr6YANSLkQ_7jEtgg4gm1F6PPfn7b1tP189CvhXj01FWmbDwjZt6xJoW0eqJYl4TA3DU9onmgJUVSpCQUBATC1VCdPT2cKOVBX4UUVCCjOSux8Q0cSPuNPqxoWK1o2M0A5myorSeTrDd3tJh3dJfWQfnNf2IWUuhHMR6xTuKwdbl3ovHWhOGM4GKmXepLlUVfpnx7MtwM-YVVLDgA9ykLTBq0W6mR7xhv95p4CaEgvYPTWhkrCvqyoD3XETox4',
    role: 'Frontend Architect',
    organization: 'CollabFlow Enterprise',
    initials: 'MF'
  },
  anaLopez: {
    id: 'u-ana',
    name: 'Ana Lopez',
    email: 'ana@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbsn3ulsH3yMdP4mTYp471j4ZYBtOEo0284hgZe8-W-etHB7xOs4MTgfjAdKoEWBfhd3ZN8X-tN0NZ9_oY8FJk4MiUiZoeP3npZ8Ku2Z0FpuJfHeS5qtOG1M1wGylEuLjJUxHozZq1T3Z58fHSwsZt1fIh4pmM5e3bliao20hxJoRzGl8nnhg9V3cWgy6LiTK4oKb8qLnDr0JGjQaFwRDBEY16xY3nh_hlHh8UI6Mxw0J8_xC9nQ4o9LTACU0G7LElv5z5YdPLe-A',
    role: 'Cloud Engineer',
    organization: 'CollabFlow Enterprise',
    initials: 'AL'
  },
  sarahMiller: {
    id: 'u-sarahm',
    name: 'Sarah Miller',
    email: 'sarah.m@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWac3S81S8InWqZTDrXMqv3ycDg9IaJWRCKter6bgoLc_DiLBCL4_fCzFnA5UePTGMLhDB3Rh1JUzWqk-K8uY3VPMEPm9_g8kQeXZzrS36EwLgJ-3tBFOyyB5gN9RkWnS2NCFstx4rNy-bAgbVqtftxaqeBKSw0r8KPih-cCxi98-vh6gmiX4UFtZ9IAxa1MWSkQqsejrCFeuGBnLM2W_ssju2dz-h9KcTwoPsKgDCReO7_Eynk3NeptSbnxVjyAFhnZ8c2rdW8kM',
    role: 'Marketing Specialst',
    organization: 'CollabFlow Enterprise',
    initials: 'SM'
  },
  mikeChen: {
    id: 'u-mike',
    name: 'Mike Chen',
    email: 'mike.c@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqXJnq4dCz0YUZqCHp8qurvwbp4GCy2mWy7w7w43B9ubFGPNUWZd_DhfG6AxQYkwLL5p7urZGUtd6HSDwJv-dncqRreE-PqxuOATinM-7zneU6Tbgwgcp9_7ITmU1wqkFaidKC2Livzo0Z3UgMJFeTbaNSF5ojFQJSY2ByvQjRKMMUhcU98gndfz2jUp2KeuuXYsdpVghvJrQb61lAl-Rgvq7SAc8ZDp89xFSc3Htj1w8RHoviK36J-zohNQVaGuaNJcXPA1oHhCM',
    role: 'Backend Developer',
    organization: 'CollabFlow Enterprise',
    initials: 'MC'
  },
  chrisEvans: {
    id: 'u-chris',
    name: 'Chris Evans',
    email: 'chris@collabflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRzrGuTmDGuRwlU4vbbx_vu1rKzMgCtvkoq_lWLAtZmnI_2e9mrIa6ptKVCvYTc48E9w0AGmrqB_WG7NGPUPGgMymTSO5VKhsBuFv1V-VkTQoLhGMMOI9OE4yF7yIguH04UQfcnnwaIhiN4_7sFwkPIfKMPdhFAJH2YdaOND5Wx2un0LCvNkGdPVFgZ-G7vgmcSOQ9B44oU-S9SvzBlzMu6IXX5WzcxnY8XNGSiDGYNd5JfWRurtSQmXvUBJOtAlIZ3n7un5597CI',
    role: 'Financial Lead',
    organization: 'CollabFlow Enterprise',
    initials: 'CE'
  }
};

// Simulated Projects
export const initialProjects: Project[] = [
  {
    id: 'p-vision',
    name: 'Vision Mobile App Redesign',
    description: 'Complete overhaul of the core mobile experience focused on accessibility and dark mode.',
    progress: 64,
    status: 'In Progress',
    dueDate: 'Oct 12, 2023',
    team: [users.alex, users.jordan, users.sarahChen],
    category: 'Mobile'
  },
  {
    id: 'p-data',
    name: 'Data Migration Tier 2',
    description: 'Legacy SQL database migration to the new cloud-native architectural stack.',
    progress: 12,
    status: 'On Hold',
    dueDate: 'Nov 04, 2023',
    team: [users.david, users.johnDoe],
    category: 'Database'
  },
  {
    id: 'p-security',
    name: 'Enterprise Security Audit',
    description: 'Quarterly security review and SOC2 compliance validation for global regions.',
    progress: 88,
    status: 'In Progress',
    dueDate: 'Sept 30, 2023',
    team: [users.david, users.casey],
    category: 'Security'
  },
  {
    id: 'p-expansion',
    name: 'Global Expansion Q4',
    description: 'Strategy and operational logistics for entering the APAC market. This is a top-level initiative involving cross-functional leads from Sales, Tech, and Marketing.',
    progress: 42,
    status: 'Priority Alpha',
    dueDate: 'Dec 15, 2023',
    team: [users.alex, users.david, users.elena, users.marcus],
    category: 'Strategy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHQKuMSIsmcP-sI6FyYxqqtyjaGXzZcATBKuTxcvGPQqmG2Xy6wjcAW8UWCzNVzi4Mg7b3UO7NOGSlMOmS-U_CyelCYKGfOhOfOMtjLie4jJigXcEQC2_1yB_8NGC9oytFQ1laGgUOdyplM5FJHBh4GwgDh1Fe6I8mxEzGDrbcjeq7R0h06X7b0eD4Gauis34px0c2IuiJGu5zApkBUioQIHTSvX2A6345GiDUtsoZMBgMiD27jxUjK92IIy6q7UXg-HDzm53BZsw'
  },
  {
    id: 'p-design',
    name: 'Design System v2.1',
    description: 'Standardizing component libraries and token systems across all product suites.',
    progress: 95,
    status: 'In Progress',
    dueDate: 'Today',
    team: [users.sarahChen, users.markFoster],
    category: 'Design'
  }
];

// Tasks List (comprising Kanban elements + table elements)
export const initialTasks: Task[] = [
  {
    id: 'CF-1021',
    title: 'Integration of WebSocket Client',
    projectId: 'p-vision',
    projectName: 'Vision Mobile App Redesign',
    assignee: users.david,
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Nov 24, 2023',
    description: 'Establish secure WebSocket connections for live notifications, sync events, and messaging backplanes between mobile endpoints.',
    subtasks: [
      { id: 'sub-1', title: 'Implement socket pooling', completed: true },
      { id: 'sub-2', title: 'Test reconnect backoff algorithm', completed: false }
    ],
    commentsCount: 2,
    attachmentsCount: 1
  },
  {
    id: 'CF-1024',
    title: 'Refactor Authentication Middleware',
    projectId: 'p-security',
    projectName: 'Enterprise Security Audit',
    assignee: users.david,
    priority: 'High',
    status: 'Backlog',
    dueDate: 'Nov 24, 2023',
    description: 'Currently, the authentication middleware is coupled with the session store, making it difficult to implement JWT-based auth for mobile clients. We need to decouple the core validation logic and create a flexible interface for multiple authentication strategies.',
    subtasks: [
      { id: 'sub-3', title: 'Identify coupling points in existing middleware', completed: false },
      { id: 'sub-4', title: 'Draft AuthInterface blueprint', completed: false }
    ],
    commentsCount: 4,
    attachmentsCount: 1
  },
  {
    id: 'CF-1025',
    title: 'Update Documentation Assets',
    projectId: 'p-design',
    projectName: 'Design System v2.1',
    assignee: users.elena,
    priority: 'Low',
    status: 'Backlog',
    dueDate: 'Oct 29, 2023',
    description: 'Verify component illustration scales align with high-dpi device renders. Compile developer specification manuals.',
    subtasks: [
      { id: 'sub-5', title: 'Regenerate shadow assets', completed: true }
    ],
    commentsCount: 0,
    attachmentsCount: 2
  },
  {
    id: 'CF-1026',
    title: 'Design System Audit - Typography',
    projectId: 'p-design',
    projectName: 'Design System v2.1',
    assignee: users.sarahChen,
    priority: 'Medium',
    status: 'Todo',
    dueDate: 'Oct 25, 2023',
    description: 'Review responsive type hierarchies across major display widths. Verify font-weight mappings are robust.',
    subtasks: [
      { id: 'sub-6', title: 'Scan Geist integrations', completed: true },
      { id: 'sub-7', title: 'Map tabular number layouts', completed: true }
    ],
    commentsCount: 1,
    attachmentsCount: 0
  },
  {
    id: 'CF-1019',
    title: 'Global Search Logic Optimization',
    projectId: 'p-vision',
    projectName: 'Vision Mobile App Redesign',
    assignee: users.jordan,
    priority: 'Low',
    status: 'Review',
    dueDate: 'Oct 23, 2023',
    description: 'Optimize indexing intervals for unified global querying. Pre-fetch localized search keywords.',
    subtasks: [],
    commentsCount: 3,
    attachmentsCount: 0
  },
  {
    id: 'CF-1004',
    title: 'Finalize Sprint 12 Assets',
    projectId: 'p-vision',
    projectName: 'Vision Mobile App Redesign',
    assignee: users.sarahChen,
    priority: 'Low',
    status: 'Done',
    dueDate: 'Completed Nov 12',
    description: 'Package design assets for handover. Export components as clean SVG/React specifications.',
    subtasks: [],
    commentsCount: 1,
    attachmentsCount: 5
  },
  {
    id: 'CF-101',
    title: 'Refactor authentication middleware',
    projectId: 'p-security',
    projectName: 'Enterprise Security Audit',
    assignee: users.alex,
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Oct 24, 2023',
    description: 'General system refactoring for auth controllers.',
    commentsCount: 1
  },
  {
    id: 'CF-102',
    title: 'Design System: Button Tokens',
    projectId: 'p-design',
    projectName: 'Design System v2.1',
    assignee: users.sarahChen,
    priority: 'Medium',
    status: 'Review',
    dueDate: 'Oct 25, 2023',
    description: 'Incorporate new variables for state definitions.'
  },
  {
    id: 'CF-103',
    title: 'Setup Kubernetes Cluster autoscaling',
    projectId: 'p-data',
    projectName: 'Data Migration Tier 2',
    assignee: users.johnSmith,
    priority: 'High',
    status: 'Todo',
    dueDate: 'Oct 28, 2023',
    description: 'Set up cluster metric APIs to scale cluster nodes dynamically.'
  },
  {
    id: 'CF-104',
    title: 'Update security documentation',
    projectId: 'p-security',
    projectName: 'Enterprise Security Audit',
    assignee: users.elena,
    priority: 'Low',
    status: 'Todo', // originally listed as "Blocked", we can map to Todo or In Progress
    dueDate: 'Nov 02, 2023',
    description: 'Validate document flows with respect to safety guidelines.'
  },
  {
    id: 'CF-105',
    title: 'Fix dashboard mobile overflow',
    projectId: 'p-vision',
    projectName: 'Vision Mobile App Redesign',
    assignee: users.marcus,
    priority: 'High',
    status: 'Review',
    dueDate: 'Oct 30, 2023'
  },
  {
    id: 'CF-106',
    title: 'QA for release v2.4.0',
    projectId: 'p-expansion',
    projectName: 'Global Expansion Q4',
    assignee: users.jessica,
    priority: 'Medium',
    status: 'Done',
    dueDate: 'Oct 20, 2023'
  }
];

// Channels
export const channels: Channel[] = [
  { id: 'ch-general', name: 'general', isPrivate: false },
  { id: 'ch-frontend', name: 'frontend', isPrivate: false },
  { id: 'ch-backend', name: 'backend', isPrivate: false },
  { id: 'ch-strategy', name: 'strategy-h1', isPrivate: true }
];

// Chat Messages Thread configuration representing Screen 2
export const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: users.alex,
    timestamp: '10:42 AM',
    content: "Hey team, I've pushed the new Tailwind configuration for the design system components. Can someone from the frontend take a look at the PR?",
    reactions: [
      { emoji: '🚀', count: 3 },
      { emoji: '🙌', count: 1 }
    ]
  },
  {
    id: 'msg-2',
    sender: users.jordan,
    timestamp: '10:45 AM',
    content: "Sure Alex! I noticed a small issue with the fluid grid calculation. Here's what I'm thinking for the fix:",
    codeSnippet: {
      filename: 'tailwind.config.js',
      code: `extend: {\n  spacing: {\n    'gutter': 'clamp(1rem, 2vw, 2rem)',\n    'container-max': '1440px'\n  }\n}`
    }
  },
  {
    id: 'msg-3',
    sender: users.alex,
    timestamp: '11:02 AM',
    content: 'Updated the hero section with the glassmorphic sidebar effect. Looks much cleaner now!',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu27z-Rm7u0BE08bGf-hOA3zKHlAW8Wa_d3PwwnW9E-uc1wnhZyG2IjZrUoJtvRBb5-5NaI8bKhFUlzI6jzXS73_tmBbjnIh737LOk5UVcpqDqPESNCgim6EEgA35WlhWWpdDVM44a3VRhY3ZJdikhpGYSsWwlkJUjQokpFbl8YYlIn4MiTvclLbxYnpeahMFo96EHL2XcfelQ8iTdNqRRs1D2UrsergtDgqgRoTTZZBEw-ByRR5ZPnscuJ29HPG69IxJFBkxX3t0'
  }
];

// Simulated Recent Activities (Screen 7 sidebar)
export const recentActivities: RecentActivity[] = [
  {
    id: 'act-1',
    user: users.johnDoe,
    action: 'moved',
    target: 'Task #102',
    timeAgo: '2 minutes ago',
    category: 'Kanban Board',
    type: 'move'
  },
  {
    id: 'act-2',
    user: users.sarahMiller,
    action: 'completed',
    target: 'Marketing Strategy Review',
    timeAgo: '15 minutes ago',
    category: 'Marketing Q4',
    type: 'complete'
  },
  {
    id: 'act-3',
    user: {
      id: 'bot',
      name: 'Team Bot',
      email: 'bot@collabflow.com',
      avatar: '',
      role: 'System Bot',
      initials: 'TB'
    },
    action: 'added 4 new members to',
    target: 'Project Delta',
    timeAgo: '1 hour ago',
    category: 'System',
    type: 'system'
  },
  {
    id: 'act-4',
    user: users.mikeChen,
    action: 'updated the deadline for',
    target: 'API Integration',
    timeAgo: '3 hours ago',
    category: 'Backend API',
    type: 'update'
  }
];

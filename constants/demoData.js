/**
 * Demo/fallback data for offline mode and error states
 * Provides realistic placeholder data when API calls fail
 */

export const DEMO_COLLABS_ADMIN = [
  {
    id: "demo-admin-1",
    name: "CollabHub Sample Project",
    description:
      "A sample collaboration workspace (Demo Data - Viewing Offline)",
    role: "ADMIN",
    members: [
      {
        userId: "demo-user-1",
        username: "demo_user",
        role: "ADMIN",
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_COLLABS_MEMBER = [
  {
    id: "demo-member-1",
    name: "Team Collaboration Demo",
    description: "Example team project (Demo Data - Viewing Offline)",
    role: "MEMBER",
    members: [
      {
        userId: "demo-user-1",
        username: "demo_user",
        role: "MEMBER",
      },
      {
        userId: "demo-user-2",
        username: "team_lead",
        role: "ADMIN",
      },
    ],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_TASK_STATS = {
  totalProjects: 2,
  totalTasks: 12,
  completedTasks: 7,
  highPriorityTasks: 3,
  tasksDueSoon: 2,
};

/**
 * Returns demo data based on session state
 */
export function getDemoData(sessionExpired = false) {
  return {
    adminCollabs: sessionExpired ? DEMO_COLLABS_ADMIN : DEMO_COLLABS_ADMIN,
    memberCollabs: sessionExpired ? [] : DEMO_COLLABS_MEMBER,
    taskStats: DEMO_TASK_STATS,
  };
}

/**
 * Permission constants for the roles and permissions system
 */

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  ENTERPRISE_ADD: "enterprise.add",
  ENTERPRISE_VIEW: "enterprise.view",
  ENTERPRISE_UPDATE: "enterprise.update",
  ENTERPRISE_DELETE: "enterprise.delete",
  SPECIALISTS_VIEW: "specialists.view",
  SPECIALISTS_ADD: "specialists.add",
  SPECIALISTS_BLOCK_UNBLOCK: "specialists.block_unblock",
  SPECIALISTS_ACCEPT_REJECT: "specialists.accept_reject",
  USERS_VIEW: "users.view",
  SESSIONS_VIEW: "sessions.view",
  USER_INQUIRIES_VIEW: "user_inquiries.view",
  USER_INQUIRIES_DELETE: "user_inquiries.delete",
  SETTINGS_VIEW: "settings.view",
} as const

export const PERMISSION_GROUPS = {
  Dashboard: [PERMISSIONS.DASHBOARD_VIEW],
  Enterprise: [
    PERMISSIONS.ENTERPRISE_ADD,
    PERMISSIONS.ENTERPRISE_VIEW,
    PERMISSIONS.ENTERPRISE_UPDATE,
    PERMISSIONS.ENTERPRISE_DELETE,
  ],
  Specialists: [
    PERMISSIONS.SPECIALISTS_VIEW,
    PERMISSIONS.SPECIALISTS_ADD,
    PERMISSIONS.SPECIALISTS_BLOCK_UNBLOCK,
    PERMISSIONS.SPECIALISTS_ACCEPT_REJECT,
  ],
  Users: [PERMISSIONS.USERS_VIEW],
  Sessions: [PERMISSIONS.SESSIONS_VIEW],
  Inquiries: [
    PERMISSIONS.USER_INQUIRIES_VIEW,
    PERMISSIONS.USER_INQUIRIES_DELETE,
  ],
  Settings: [PERMISSIONS.SETTINGS_VIEW],
} as const

export type PermissionSlug = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]


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

function titleCaseFromSlugPrefix(prefix: string) {
  return prefix
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Build groups for UI.
 *
 * - Uses `PERMISSION_GROUPS` for known/core groups (in that order)
 * - Auto-adds any ungrouped permissions into dynamic groups based on slug prefix
 *   e.g. `notifications.view_all` -> "Notifications"
 */
export function buildPermissionGroups(permissionSlugs: string[]) {
  const allSlugs = Array.from(new Set(permissionSlugs))
  const available = new Set(allSlugs)
  const grouped = new Set<string>()

  const result: Record<string, string[]> = {}

  // Known groups first (preserve insertion order)
  for (const [groupName, groupSlugs] of Object.entries(PERMISSION_GROUPS)) {
    const slugs = (Array.from(groupSlugs) as string[]).filter((s) =>
      available.has(s)
    )
    if (slugs.length > 0) {
      result[groupName] = slugs
      slugs.forEach((s) => grouped.add(s))
    }
  }

  // Dynamic groups for any new/unknown permissions
  const dynamic: Record<string, string[]> = {}
  for (const slug of allSlugs) {
    if (grouped.has(slug)) continue
    const prefix = slug.split(".")[0] || "other"
    const groupName = titleCaseFromSlugPrefix(prefix)
    if (!dynamic[groupName]) dynamic[groupName] = []
    dynamic[groupName].push(slug)
  }

  for (const [groupName, slugs] of Object.entries(dynamic).sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    result[groupName] = slugs.sort((a, b) => a.localeCompare(b))
  }

  return result
}


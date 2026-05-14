export const roles = ["admin", "maintainer"] as const;

export type AdminRole = (typeof roles)[number];

export interface AdminProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: AdminRole;
}

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && roles.includes(value as AdminRole);
}

export function canManageUsers(role: AdminRole) {
  return role === "admin";
}

export function canManageSettings(role: AdminRole) {
  return role === "admin";
}

export function canManageContent(role: AdminRole) {
  return role === "admin" || role === "maintainer";
}

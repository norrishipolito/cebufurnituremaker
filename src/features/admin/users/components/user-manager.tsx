"use client";

import { Save, Trash2, UserPlus } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminRole } from "@/lib/auth/roles";

export interface AdminUser {
  id: string;
  email: string;
  display_name: string | null;
  role: AdminRole;
  created_at: string | Date;
}

interface UserDraft {
  email: string;
  display_name: string;
  role: AdminRole;
  password: string;
}

interface UserManagerProps {
  currentUserId: string;
  initialUsers: AdminUser[];
}

const roleOptions: Array<{ value: AdminRole; label: string }> = [
  { value: "admin", label: "Admin" },
  { value: "maintainer", label: "Maintainer" },
];

function toDraft(user: AdminUser): UserDraft {
  return {
    email: user.email,
    display_name: user.display_name ?? "",
    role: user.role,
    password: "",
  };
}

async function parseJsonResponse(response: Response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const issue = payload?.issues?.[0]?.message;
    const detail = payload?.detail ?? payload?.details ?? payload?.hint ?? issue;
    throw new Error(
      detail
        ? `${payload?.error ?? "Request failed."} ${detail}`
        : payload?.error ?? "Request failed."
    );
  }

  return payload;
}

function sortUsers(users: AdminUser[]) {
  return [...users].sort((a, b) => {
    const first = new Date(b.created_at).getTime();
    const second = new Date(a.created_at).getTime();
    return first - second;
  });
}

export function UserManager({ currentUserId, initialUsers }: UserManagerProps) {
  const [users, setUsers] = useState(() => sortUsers(initialUsers));
  const [drafts, setDrafts] = useState<Record<string, UserDraft>>(() =>
    Object.fromEntries(initialUsers.map((user) => [user.id, toDraft(user)]))
  );
  const [status, setStatus] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function updateDraft(id: string, patch: Partial<UserDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }));
  }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    setBusyId("new");
    setStatus("Creating user...");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: String(form.get("display_name") ?? ""),
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
          role: String(form.get("role") ?? "maintainer"),
        }),
      });
      const payload = await parseJsonResponse(response);
      const user = payload.user as AdminUser;

      setUsers((current) => sortUsers([user, ...current]));
      setDrafts((current) => ({ ...current, [user.id]: toDraft(user) }));
      formElement.reset();
      setStatus("User created");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create user.");
    } finally {
      setBusyId(null);
    }
  }

  async function saveUser(userId: string) {
    const draft = drafts[userId];

    if (!draft) {
      return;
    }

    setBusyId(userId);
    setStatus("Saving user...");

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: draft.display_name,
          email: draft.email,
          password: draft.password,
          role: draft.role,
        }),
      });
      const payload = await parseJsonResponse(response);
      const user = payload.user as AdminUser;

      setUsers((current) =>
        sortUsers(current.map((item) => (item.id === userId ? user : item)))
      );
      setDrafts((current) => ({ ...current, [user.id]: toDraft(user) }));
      setStatus("User saved");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save user.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(user: AdminUser) {
    if (user.id === currentUserId) {
      setStatus("You cannot delete your own admin user.");
      return;
    }

    if (!window.confirm(`Delete "${user.email}"?`)) {
      return;
    }

    setBusyId(user.id);
    setStatus("Deleting user...");

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      await parseJsonResponse(response);

      setUsers((current) => current.filter((item) => item.id !== user.id));
      setDrafts((current) => {
        const next = { ...current };
        delete next[user.id];
        return next;
      });
      setStatus("User deleted");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete user.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form
        aria-label="Create user"
        onSubmit={createUser}
        className="grid gap-3 rounded-lg border bg-white p-4 dark:bg-gray-900 md:grid-cols-2"
      >
        <Input
          name="display_name"
          placeholder="Display name (ex. Admin Assistant)"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email (ex. maintainer@cebufurnituremaker.com)"
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Temporary password (ex. Password1.)"
          required
        />
        <label className="grid gap-1 text-sm">
          Role
          <select
            name="role"
            defaultValue="maintainer"
            className="h-9 rounded-md border bg-transparent px-3 text-sm"
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <Button type="submit" disabled={busyId === "new"}>
            <UserPlus />
            Create User
          </Button>
          {status ? <p className="text-sm text-gray-600">{status}</p> : null}
        </div>
      </form>

      <div className="rounded-lg border bg-white dark:bg-gray-900">
        <div className="border-b p-4 text-sm text-gray-600">
          Admins can create users, edit profile details, reset passwords, assign
          roles, and delete users.
        </div>
        <div className="divide-y">
          {users.length ? (
            users.map((user) => {
              const draft = drafts[user.id] ?? toDraft(user);
              const isCurrentUser = user.id === currentUserId;

              return (
                <section
                  key={user.id}
                  data-user-email={user.email}
                  className="grid gap-4 p-4 xl:grid-cols-[1fr_auto]"
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      aria-label={`Display name for ${user.email}`}
                      value={draft.display_name}
                      onChange={(event) =>
                        updateDraft(user.id, {
                          display_name: event.target.value,
                        })
                      }
                      placeholder="Display name (ex. Admin Assistant)"
                    />
                    <Input
                      aria-label={`Email for ${user.email}`}
                      type="email"
                      value={draft.email}
                      onChange={(event) =>
                        updateDraft(user.id, { email: event.target.value })
                      }
                      placeholder="Email (ex. maintainer@cebufurnituremaker.com)"
                    />
                    <Input
                      aria-label={`New password for ${user.email}`}
                      type="password"
                      value={draft.password}
                      onChange={(event) =>
                        updateDraft(user.id, { password: event.target.value })
                      }
                      placeholder="New password (optional)"
                    />
                    <label className="grid gap-1 text-sm">
                      Role for {user.email}
                      <select
                        aria-label={`Role for ${user.email}`}
                        value={draft.role}
                        onChange={(event) =>
                          updateDraft(user.id, {
                            role: event.target.value as AdminRole,
                          })
                        }
                        disabled={isCurrentUser}
                        className="h-9 rounded-md border bg-transparent px-3 text-sm disabled:opacity-60"
                      >
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    {isCurrentUser ? (
                      <p className="text-sm text-gray-500 md:col-span-2">
                        Current signed-in admin. Role changes and deletion are
                        locked to prevent accidental lockout.
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-row gap-2 xl:flex-col">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => saveUser(user.id)}
                      disabled={busyId === user.id}
                    >
                      <Save />
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(user)}
                      disabled={isCurrentUser || busyId === user.id}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                </section>
              );
            })
          ) : (
            <p className="p-4 text-sm text-gray-600">
              No users found. Create the first admin with the setup script.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

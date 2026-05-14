"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type FocusEvent,
  useContext,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type AdminNavigationContextValue = {
  pendingHref: string | null;
  startNavigation: (href: string) => void;
};

const AdminNavigationContext =
  createContext<AdminNavigationContextValue | null>(null);

function useAdminNavigation() {
  return (
    useContext(AdminNavigationContext) ?? {
      pendingHref: null,
      startNavigation: () => {},
    }
  );
}

function getPathnameFromHref(href: string) {
  try {
    return new URL(href, "https://admin.local").pathname;
  } catch {
    return href.split("?")[0]?.split("#")[0] ?? href;
  }
}

function shouldIgnoreNavigationClick(
  event: MouseEvent<HTMLAnchorElement>,
  target?: string
) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (target ? target !== "_self" : false)
  );
}

export function AdminNavigationProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      pendingHref,
      startNavigation: setPendingHref,
    }),
    [pendingHref]
  );

  return (
    <AdminNavigationContext.Provider value={value}>
      {pendingHref ? (
        <div
          role="status"
          aria-label="Loading admin page"
          className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-gray-200/80 dark:bg-gray-800/80"
        >
          <span className="block h-full w-full animate-pulse bg-gray-950 dark:bg-white" />
          <span className="sr-only">Loading admin page</span>
        </div>
      ) : null}
      {children}
    </AdminNavigationContext.Provider>
  );
}

type AdminNavLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> & {
  href: string;
};

export function AdminNavLink({
  href,
  className,
  children,
  onFocus,
  onClick,
  onMouseEnter,
  prefetch,
  target,
  ...props
}: AdminNavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { pendingHref, startNavigation } = useAdminNavigation();
  const isPending =
    pendingHref !== null &&
    getPathnameFromHref(pendingHref) === getPathnameFromHref(href);

  function prefetchRoute() {
    if (prefetch === false) {
      return;
    }

    if (window.navigator.webdriver) {
      return;
    }

    const nextUrl = new URL(href, window.location.href);

    if (
      nextUrl.origin !== window.location.origin ||
      nextUrl.pathname === pathname
    ) {
      return;
    }

    router.prefetch(href);
  }

  function handleFocus(event: FocusEvent<HTMLAnchorElement>) {
    onFocus?.(event);

    if (!event.defaultPrevented) {
      prefetchRoute();
    }
  }

  function handleMouseEnter(event: MouseEvent<HTMLAnchorElement>) {
    onMouseEnter?.(event);

    if (!event.defaultPrevented) {
      prefetchRoute();
    }
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (shouldIgnoreNavigationClick(event, target)) {
      return;
    }

    const nextUrl = new URL(href, window.location.href);

    if (
      nextUrl.origin !== window.location.origin ||
      nextUrl.pathname === pathname
    ) {
      return;
    }

    startNavigation(href);
  }

  return (
    <Link
      href={href}
      target={target}
      aria-busy={isPending || undefined}
      data-pending={isPending ? "true" : undefined}
      className={cn(
        "data-[pending=true]:cursor-wait data-[pending=true]:bg-gray-100 data-[pending=true]:text-gray-950 dark:data-[pending=true]:bg-gray-900 dark:data-[pending=true]:text-white",
        className
      )}
      onFocus={handleFocus}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
}

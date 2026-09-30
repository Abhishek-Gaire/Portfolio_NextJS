"use client";

import { Grid, List } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ViewMode = "grid" | "list";

function normalizeView(value: string | null | undefined): ViewMode {
  return value === "list" ? "list" : "grid";
}

/*
 * localStorage is a fallback, never the source of truth. The whole component
 * is built so the server always renders from getServerSnapshot() === null, the
 * URL param wins on the first client pass, and the stored preference is only
 * consulted when the URL is silent. Anything that makes getSnapshot return a
 * value while getServerSnapshot returns null produces a hydration mismatch.
 */
function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  // The native storage event only fires in *other* tabs, so a write in this tab
  // is picked up via router navigation instead. Filtering on the key keeps
  // unrelated localStorage writes from re-rendering this component.
  const handler = (event: StorageEvent) => {
    if (event.key === "blogViewPreference") {
      callback();
    }
  };

  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getSnapshot(): ViewMode | null {
  if (typeof window === "undefined") {
    return null;
  }
  const stored = localStorage.getItem("blogViewPreference");
  return stored === "grid" || stored === "list" ? stored : null;
}

function getServerSnapshot(): ViewMode | null {
  return null;
}

export default function BlogsViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storedView = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const viewParam = searchParams.get("view");
  const currentView = normalizeView(viewParam ?? storedView ?? "grid");
  const searchParamsString = searchParams.toString();

  // Depends on searchParamsString, the primitive, and not on the
  // ReadonlyURLSearchParams object: that object is a new identity on every
  // render, which would re-run this effect on every render.
  useEffect(() => {
    if (viewParam) {
      const normalized = normalizeView(viewParam);
      localStorage.setItem("blogViewPreference", normalized);
      return;
    }

    if (storedView) {
      const params = new URLSearchParams(searchParamsString);
      params.set("view", storedView);
      // replace, not push: restoring a stored preference is not a navigation
      // the user asked for, so it must not add a back-button entry.
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, router, searchParamsString, storedView, viewParam]);

  const buildHref = (nextView: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const handleViewChange = (nextView: ViewMode) => {
    localStorage.setItem("blogViewPreference", nextView);
    router.push(buildHref(nextView));
  };

  const buttonClass = (active: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-control border transition-colors duration-200 ${
      active
        ? "border-accent-line bg-accent-soft text-accent"
        : "border-line text-low hover:border-line-hi hover:text-hi"
    }`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleViewChange("grid")}
        className={buttonClass(currentView === "grid")}
        aria-label="Grid view"
        aria-pressed={currentView === "grid"}
      >
        <Grid size={18} />
      </button>
      <button
        type="button"
        onClick={() => handleViewChange("list")}
        className={buttonClass(currentView === "list")}
        aria-label="List view"
        aria-pressed={currentView === "list"}
      >
        <List size={18} />
      </button>
    </div>
  );
}

"use client";

import { Grid, List } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ViewMode = "grid" | "list";

function normalizeView(value: string | null | undefined): ViewMode {
  return value === "list" ? "list" : "grid";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

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
  const storedView = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const viewParam = searchParams.get("view");
  const currentView = normalizeView(viewParam ?? storedView ?? "grid");
  const searchParamsString = searchParams.toString();

  useEffect(() => {
    if (viewParam) {
      const normalized = normalizeView(viewParam);
      localStorage.setItem("blogViewPreference", normalized);
      return;
    }

    if (storedView) {
      const params = new URLSearchParams(searchParamsString);
      params.set("view", storedView);
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

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={() => handleViewChange("grid")}
        className={`p-3 rounded-xl transition-all duration-300 ${currentView === "grid"
          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-700/50"
          }`}
        aria-label="Grid view"
      >
        <Grid size={20} />
      </button>
      <button
        type="button"
        onClick={() => handleViewChange("list")}
        className={`p-3 rounded-xl transition-all duration-300 ${currentView === "list"
          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          : "text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-700/50"
          }`}
        aria-label="List view"
      >
        <List size={20} />
      </button>
    </div>
  );
}

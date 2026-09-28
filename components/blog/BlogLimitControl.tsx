"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type BlogLimitControlProps = {
  options?: number[];
  defaultLimit?: number;
};

const FALLBACK_OPTIONS = [5, 10, 20, 50];

export default function BlogLimitControl({
  options = FALLBACK_OPTIONS,
  defaultLimit = 10,
}: BlogLimitControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const limitParam = searchParams.get("limit");
  const parsedLimit = Number.parseInt(limitParam ?? "", 10);
  const currentLimit = Number.isNaN(parsedLimit) ? defaultLimit : parsedLimit;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", event.target.value);
    // page=1 alongside the new limit: otherwise a higher page number can point
    // past the end of the shorter result set and render an empty grid.
    params.set("page", "1");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="font-mono text-[11.5px] text-low">PER PAGE</span>
      <select
        value={currentLimit}
        onChange={handleChange}
        aria-label="Posts per page"
        className="rounded-control border border-line bg-code-bg px-3 py-2 text-[13.5px] text-mid transition-colors duration-200 hover:border-line-hi focus:border-accent-line"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

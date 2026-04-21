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
    params.set("page", "1");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-300">Show</span>
      <select
        value={currentLimit}
        onChange={handleChange}
        className="bg-gray-800/50 border border-gray-600/50 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-300">per page</span>
    </div>
  );
}


"use client";

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc";

type SortDropdownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export default function SortDropdown({
  value,
  onChange,
}: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="category-sort"
        className="text-[12px] font-medium text-[#68756b]"
      >
        সাজান
      </label>

      <div className="relative">
        <select
          id="category-sort"
          value={value}
          onChange={(event) =>
            onChange(event.target.value as SortOption)
          }
          className="min-w-[110px] cursor-pointer appearance-none rounded-[9px] border border-[#dce6de] bg-[#fbfdfb] py-2 pl-3 pr-8 text-[12px] font-medium text-[#253328] outline-none transition-colors hover:border-[#a8c9b0] focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/15"
        >
          <option value="default">
            ডিফল্ট
          </option>

          <option value="price-asc">
            দাম: কম থেকে বেশি
          </option>

          <option value="price-desc">
            দাম: বেশি থেকে কম
          </option>
        </select>

        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#68756b]"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

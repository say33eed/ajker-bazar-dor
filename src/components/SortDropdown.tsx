
"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc";

type SortDropdownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const sortOptions: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "default",
    label: "ডিফল্ট",
  },
  {
    value: "price-asc",
    label: "দাম: কম থেকে বেশি",
  },
  {
    value: "price-desc",
    label: "দাম: বেশি থেকে কম",
  },
];

export default function SortDropdown({
  value,
  onChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const optionRefs = useRef<
    (HTMLButtonElement | null)[]
  >([]);

  const selectedOption =
    sortOptions.find(
      (option) => option.value === value
    ) ?? sortOptions[0];

  const selectedIndex = sortOptions.findIndex(
    (option) => option.value === value
  );

  // Close when clicking outside
  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, []);

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function openMenu(focusIndex?: number) {
    setIsOpen(true);

    if (focusIndex !== undefined) {
      requestAnimationFrame(() => {
        focusOption(focusIndex);
      });
    }
  }

  function selectOption(option: SortOption) {
    onChange(option);
    setIsOpen(false);

    requestAnimationFrame(() => {
      buttonRef.current?.focus();
    });
  }

  function handleTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      openMenu(
        selectedIndex >= 0 ? selectedIndex : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      openMenu(
        selectedIndex >= 0
          ? selectedIndex
          : sortOptions.length - 1
      );
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      focusOption(
        (index + 1) % sortOptions.length
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      focusOption(
        (index - 1 + sortOptions.length) %
          sortOptions.length
      );
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusOption(sortOptions.length - 1);
    }

    if (event.key === "Escape") {
      event.preventDefault();

      setIsOpen(false);
      buttonRef.current?.focus();
    }

    if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="relative z-30 flex items-center gap-3"
    >
      {/* Sort label */}
      <span
        id="category-sort-label"
        className="shrink-0 text-[12px] font-medium text-[#68756b]"
      >
        সাজান
      </span>

      <div className="relative">
        {/* Dropdown trigger */}
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby="category-sort-label category-sort-value"
          onClick={() =>
            setIsOpen((previous) => !previous)
          }
          onKeyDown={handleTriggerKeyDown}
          className={`
            flex min-h-[40px] min-w-[145px]
            cursor-pointer items-center
            justify-between gap-3
            rounded-[11px] border
            bg-[#fbfdfb] px-3.5 py-2.5
            text-left text-[12px]
            font-semibold text-[#26352a]
            outline-none
            transition-all duration-200
            hover:border-[#93c9a5]
            hover:bg-[#f2f8f3]
            focus-visible:border-[#008b45]
            focus-visible:ring-2
            focus-visible:ring-[#008b45]/20
            ${
              isOpen
                ? "border-[#008b45] bg-[#f2f8f3] ring-2 ring-[#008b45]/10"
                : "border-[#dce6de]"
            }
          `}
        >
          <span
            id="category-sort-value"
            className="whitespace-nowrap"
          >
            {selectedOption.label}
          </span>

          {/* Chevron */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`shrink-0 text-[#688071] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown options */}
        {isOpen && (
          <div
            role="listbox"
            aria-labelledby="category-sort-label"
            className="
              absolute right-0
              top-[calc(100%+8px)]
              z-50
              flex w-[220px] flex-col
              gap-2
              overflow-hidden
              rounded-[14px]
              border border-[#dce6de]
              bg-[#fbfdfb]
              p-2
              shadow-[0_10px_30px_rgba(20,60,35,0.12)]
            "
          >
            {sortOptions.map((option, index) => {
              const isSelected =
                option.value === value;

              return (
                <button
                  key={option.value}
                  ref={(element) => {
                    optionRefs.current[index] =
                      element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() =>
                    selectOption(option.value)
                  }
                  onKeyDown={(event) =>
                    handleOptionKeyDown(
                      event,
                      index
                    )
                  }
                  className={`
                    flex w-full
                    cursor-pointer
                    items-center
                    justify-between
                    gap-3
                    rounded-[10px]
                    px-3.5 py-3
                    text-left
                    text-[12px]
                    transition-colors
                    duration-150
                    outline-none
                    focus-visible:bg-[#e9f5ec]
                    ${
                      isSelected
                        ? "bg-[#e9f5ec] font-bold text-[#008b45]"
                        : "bg-transparent font-medium text-[#344239] hover:bg-[#f0f6f1]"
                    }
                  `}
                >
                  <span className="whitespace-nowrap">
                    {option.label}
                  </span>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0 text-[#008b45]"
                    >
                      <path d="m20 6-11 11-5-5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

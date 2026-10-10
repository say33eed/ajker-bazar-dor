
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate, type Category } from "@/lib/utils";
import toast from "react-hot-toast";
import PriceTicker from "./PriceTicker";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all duration-200 hover:bg-[#007e3e] hover:shadow-[0_8px_14px_rgba(0,139,69,0.38)] active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008b45]";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Categories could not load");
        }

        return res.json();
      })
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Category error:", error);
      });
  }, []);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সাইন আউট সফল হয়েছে!");
          setMobileMenuOpen(false);
          router.push("/");
          router.refresh();
        },

        onError: () => {
          toast.error("সাইন আউট করা যায়নি");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-[#f9fbf9]">
      {/* First row: brand and authentication */}
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#008b45] text-lg text-white">
            🛒
          </span>

          <span className="flex flex-col">
            <span className="text-[18px] font-bold leading-tight text-[#18261d]">
              বাজার দর
            </span>

            <span className="text-[11px] leading-4 text-gray-500">
              {getBanglaDate()}
            </span>
          </span>
        </Link>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : session ? (
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-gray-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-800">
                  {session.user.name?.charAt(0) || "U"}
                </span>

                <span className="max-w-32 truncate">
                  {session.user.name}
                </span>

                <span aria-hidden="true">⌄</span>
              </button>

              <ul
                tabIndex={0}
                className="dropdown-content menu z-50 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
              >
                <li>
                  <Link href="/profile">
                    আমার প্রোফাইল
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                  >
                    সাইন আউট
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#17251c] transition-colors hover:bg-gray-200"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className={primaryButtonClass}
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="rounded-lg border border-gray-200 p-2 text-[#17251c] transition-colors hover:bg-gray-100 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={
            mobileMenuOpen
              ? "মেনু বন্ধ করুন"
              : "মেনু খুলুন"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-category-navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            {mobileMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Second row: product categories */}
      <div className="border-t border-gray-100">
        <nav
          id="mobile-category-navigation"
          aria-label="পণ্যের ক্যাটাগরি"
          className={`mx-auto max-w-[1120px] px-4 ${
            mobileMenuOpen
              ? "block"
              : "hidden md:block"
          }`}
        >
          <ul className="flex flex-wrap items-center gap-1 py-2 md:gap-2">
            {categories.map((category) => {
              const active =
                pathname === `/category/${category.slug}`;

              return (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    aria-current={
                      active ? "page" : undefined
                    }
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                      active
                        ? "bg-[#008b45] text-white"
                        : "text-[#26352a] hover:bg-[#e6f3e9] hover:text-[#007438]"
                    }`}
                  >
                    <span aria-hidden="true">
                      {category.icon}
                    </span>

                    {category.nameBn}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile authentication controls */}
          {mobileMenuOpen && (
            <div className="flex gap-2 border-t border-gray-100 py-3 md:hidden">
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex-1 rounded-lg border border-green-700 px-3 py-2 text-center text-sm text-green-800"
                  >
                    প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex-1 rounded-lg bg-[#008b45] px-3 py-2 text-sm text-white"
                  >
                    সাইন আউট
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-semibold"
                  >
                    সাইন ইন
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className={`${primaryButtonClass} flex-1`}
                  >
                    সাইন আপ
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Price ticker */}
      <PriceTicker />
    </header>
  );
}


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { getBanglaDate, type Category } from "@/lib/utils";
import toast from "react-hot-toast";
import PriceTicker from "./PriceTicker";
import UserMenu from "@/components/UserMenu";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all duration-200 hover:bg-[#007e3e] hover:shadow-[0_8px_14px_rgba(0,139,69,0.38)] active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008b45]";

type AvatarProps = {
  name: string;
  image?: string | null;
  size?: "small" | "medium";
};

function Avatar({
  name,
  image,
  size = "small",
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const initial =
    name.trim().charAt(0).toUpperCase() || "U";

  const sizeClass =
    size === "medium" ? "h-11 w-11" : "h-9 w-9";

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#eef2ee]`}
    >
      {image && !imageFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={`${name} এর প্রোফাইল ছবি`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="text-base font-bold text-[#008b45]">
          {initial}
        </span>
      )}
    </div>
  );
}

export default function Navbar() {
  const { data: session, isPending } = useSession();

  const pathname = usePathname();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user;

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories",
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Categories could not load");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected categories response");
        }

        if (!controller.signal.aborted) {
          setCategories(data as Category[]);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Category error:", error);
      }
    }

    void loadCategories();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await signOut();

      if (result.error) {
        toast.error(
          result.error.message || "সাইন আউট করা যায়নি"
        );
        return;
      }

      toast.success("সাইন আউট সফল হয়েছে!");

      setMobileMenuOpen(false);

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-[#f9fbf9]">
      {/* FIRST ROW: BRAND AND AUTHENTICATION */}
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5"
        >
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
            <span
              className="loading loading-spinner loading-sm"
              aria-label="অ্যাকাউন্ট লোড হচ্ছে"
            />
          ) : user ? (
            <UserMenu
              key={user.id}
              name={user.name || "User"}
              email={user.email}
              image={user.image}
            />
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#17251c] transition-colors hover:bg-gray-200"
              >
                সাইন ইন
              </Link>

              <Link href="/signup" className={primaryButtonClass}>
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="rounded-lg border border-gray-200 p-2 text-[#17251c] transition-colors hover:bg-gray-100 md:hidden"
          onClick={() =>
            setMobileMenuOpen((previous) => !previous)
          }
          aria-label={
            mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"
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
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {mobileMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* SECOND ROW: CENTERED CATEGORIES */}
      <div className="border-t border-gray-100">
        <nav
          id="mobile-category-navigation"
          aria-label="পণ্যের ক্যাটাগরি"
          className={`mx-auto max-w-[1120px] px-4 ${
            mobileMenuOpen ? "block" : "hidden md:block"
          }`}
        >
          {/* Category links */}
          <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 py-2 md:gap-x-3">
            {categories.map((category) => {
              const active =
                pathname === `/category/${category.slug}`;

              return (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
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

          {/* MOBILE AUTHENTICATION */}
          {mobileMenuOpen && (
            <div className="border-t border-gray-100 py-4 md:hidden">
              {isPending ? (
                <span
                  className="loading loading-spinner loading-sm"
                  aria-label="অ্যাকাউন্ট লোড হচ্ছে"
                />
              ) : user ? (
                <div className="space-y-3">
                  {/* Mobile user identity */}
                  <div className="flex items-center gap-3 rounded-xl border border-[#dce6de] bg-white p-3">
                    <Avatar
                      key={`${user.id}-${user.image || ""}`}
                      name={user.name || "User"}
                      image={user.image}
                      size="medium"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold text-[#263027]">
                        {user.name}
                      </p>

                      <p className="truncate text-[12px] text-[#758078]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile profile and sign out */}
                  <div className="flex gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#008b45] px-3 py-2.5 text-center text-sm font-semibold text-[#008b45] transition-colors hover:bg-[#e6f3e9]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="7" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>

                      আমার প্রোফাইল
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#e53e3e] px-3 py-2.5 text-sm font-semibold text-[#e53e3e] transition-colors hover:bg-[#fff0f0] disabled:opacity-60"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>

                      {signingOut ? "অপেক্ষা..." : "সাইন আউট"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-semibold text-[#17251c]"
                  >
                    সাইন ইন
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${primaryButtonClass} flex-1`}
                  >
                    সাইন আপ
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* THIRD ROW: PRICE TICKER */}
      <PriceTicker />
    </header>
  );
}

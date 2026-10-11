
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

type UserMenuProps = {
  name: string;
  email: string;
  image?: string | null;
};

export default function UserMenu({
  name,
  email,
  image,
}: UserMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const initial = name.trim().charAt(0).toUpperCase() || "U";
  const shortName = name.trim().split(/\s+/)[0] || "User";

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(
          result.error.message || "সাইন আউট করা যায়নি"
        );
        return;
      }

      setOpen(false);
      toast.success("সাইন আউট হয়েছে");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Navbar profile button */}
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="প্রোফাইল মেনু"
        className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-[#f0f5f0]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#eef1ee] sm:h-11 sm:w-11">
          {image && !imageFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={`${name} এর প্রোফাইল ছবি`}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span className="text-base font-bold text-[#008e43]">
              {initial}
            </span>
          )}
        </div>

        <span className="max-w-[120px] truncate text-[15px] font-semibold text-[#243027] sm:text-[17px]">
          {shortName}
        </span>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={`text-[#758078] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m7 10 5 6 5-6H7Z" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="প্রোফাইল মেনু"
          className="absolute right-0 top-[calc(100%+12px)] z-[100] w-[min(350px,calc(100vw-24px))] rounded-[20px] border border-[#dce6de] bg-[#fbfdfb] px-6 py-6 shadow-[0_12px_24px_rgba(25,45,30,0.18)] sm:px-7"
        >
          {/* Full name and email */}
          <div className="mb-6">
            <p className="break-words text-[20px] font-bold leading-tight text-[#263027]">
              {name}
            </p>

            <p className="mt-1 break-all text-[14px] text-[#68756b]">
              {email}
            </p>
          </div>

          {/* Profile link */}
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mb-4 flex items-center gap-3 rounded-lg py-2 text-[18px] text-[#263027] transition-colors hover:text-[#008e43]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-[#6896b9]"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>

            আমার প্রোফাইল
          </Link>

          {/* Sign out */}
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-lg py-2 text-left text-[18px] text-[#e53e3e] transition-colors hover:text-[#bd2020] disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
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

            {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
          </button>
        </div>
      )}
    </div>
  );
}

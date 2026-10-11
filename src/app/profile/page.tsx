
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin?callbackUrl=/profile");
    }
  }, [isPending, session, router]);

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

      toast.success("সাইন আউট হয়েছে");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    } finally {
      setSigningOut(false);
    }
  }

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#f0f5f0] px-4 py-12">
        <div className="mx-auto max-w-[595px] animate-pulse">
          <div className="mb-3 h-7 w-40 rounded bg-gray-200" />
          <div className="mb-6 h-4 w-60 rounded bg-gray-200" />
          <div className="mb-5 h-24 rounded-2xl bg-gray-200" />
          <div className="h-52 rounded-2xl bg-gray-200" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f0f5f0] px-4 py-12">
        <p className="text-center text-[#6e7a70]">
          সাইন ইন পেজে নিয়ে যাওয়া হচ্ছে...
        </p>
      </main>
    );
  }

  return (
    <ProfileContent
      key={user.id}
      currentName={user.name}
      email={user.email}
      image={user.image}
      signingOut={signingOut}
      onSignOut={handleSignOut}
    />
  );
}

type ProfileContentProps = {
  currentName: string;
  email: string;
  image?: string | null;
  signingOut: boolean;
  onSignOut: () => Promise<void>;
};

function ProfileContent({
  currentName,
  email,
  image,
  signingOut,
  onSignOut,
}: ProfileContentProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const initial =
    currentName.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 pb-20 pt-10">
      <div className="mx-auto w-full max-w-[595px]">

        {/* Page heading */}
        <header className="mb-5">
          <h1 className="text-[22px] font-extrabold leading-tight text-[#263027]">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-[12px] text-[#78847b]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </header>

        {/* User identity card */}
        <section className="mb-5 flex items-center justify-between gap-4 rounded-[15px] border border-[#dfe7df] bg-[#fbfdfb] px-[19px] py-[19px]">
          <div className="flex min-w-0 items-center gap-[14px]">

            {/* Google / GitHub profile picture */}
            <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#e7eee8]">
              {image && !imageFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={`${currentName} এর প্রোফাইল ছবি`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span className="text-[26px] font-bold text-[#008d45]">
                  {initial}
                </span>
              )}
            </div>

            {/* Name and email */}
            <div className="min-w-0">
              <h2 className="truncate text-[17px] font-bold text-[#263027]">
                {currentName}
              </h2>

              <p className="break-all text-[13px] text-[#758078]">
                {email}
              </p>
            </div>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={onSignOut}
            disabled={signingOut}
            className="flex h-[34px] shrink-0 items-center justify-center gap-1 rounded-[8px] border border-[#ed5454] bg-transparent px-3 text-[12px] font-semibold text-[#e63e3e] transition-colors hover:bg-[#fff0f0] disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
        </section>

        {/* Information card */}
        <section className="rounded-[15px] border border-[#dfe7df] bg-[#fbfdfb] px-[16px] pb-[34px] pt-[19px]">
          <h3 className="mb-[30px] text-[15px] font-bold text-[#263027]">
            তথ্য
          </h3>

          {/* Name display and update navigation */}
          <div className="px-[19px]">
            <label
              htmlFor="profile-name"
              className="mb-[6px] block text-[12px] font-medium text-[#263027]"
            >
              নাম
            </label>

            <input
              id="profile-name"
              type="text"
              value={currentName}
              readOnly
              className="mb-[13px] h-[34px] w-full rounded-[8px] border border-[#dfe7df] bg-transparent px-3 text-[13px] text-[#263027] outline-none transition-colors focus:border-[#008e43] focus:ring-1 focus:ring-[#008e43]"
            />

            {/* Same design; now navigates to update route */}
            <Link
              href="/profile/update"
              className="flex h-[34px] w-full items-center justify-center rounded-[7px] bg-[#008e43] text-[13px] font-bold text-white shadow-[0_3px_3px_rgba(0,100,40,0.25)] transition-colors hover:bg-[#007a39] disabled:cursor-not-allowed disabled:opacity-60"
            >
              আপডেট
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

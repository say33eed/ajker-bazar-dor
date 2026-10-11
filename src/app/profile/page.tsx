
"use client";

import Link from "next/link";
import LinkGitHubButton from "@/components/LinkGitHubButton";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="min-h-[70vh] bg-[#eff5f0] px-4 py-12">
        <div className="mx-auto max-w-[700px]">
          <div className="skeleton mb-6 h-9 w-48" />
          <div className="skeleton h-72 rounded-[20px]" />
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#eff5f0] px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">
            প্রোফাইল দেখতে সাইন ইন করুন
          </h1>
          <Link
            href="/signin"
            className="inline-block rounded-[14px] bg-[#008b45] px-6 py-3 font-bold text-white"
          >
            সাইন ইন
          </Link>
        </div>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-[75vh] bg-[#eff5f0] px-4 py-12">
      <div className="mx-auto max-w-[700px]">
        <h1 className="mb-6 text-[28px] font-bold text-[#202c23]">
          আমার প্রোফাইল
        </h1>

        <div className="rounded-[20px] border border-[#dfe8e0] bg-[#fbfdfb] p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-4 border-b border-[#e4ebe5] pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f4e9] text-2xl font-bold text-[#008b45]">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-[#202c23]">
                {user.name}
              </h2>
              <p className="break-all text-sm text-[#68756b]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="mb-1 text-sm text-[#68756b]">
                নাম
              </p>
              <p className="font-semibold text-[#202c23]">
                {user.name}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-[#68756b]">
                ইমেইল
              </p>
              <p className="break-all font-semibold text-[#202c23]">
                {user.email}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-[#68756b]">
                ইমেইল যাচাই
              </p>
              <p className="font-semibold text-[#202c23]">
                {user.emailVerified
                  ? "যাচাইকৃত"
                  : "যাচাই করা হয়নি"}
              </p>
            </div>
          </div>

          <div>
            <LinkGitHubButton />
          </div>

          <Link
            href="/profile/update"
            className="mt-8 inline-flex items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-6 py-3 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all hover:bg-[#007e3e]"
          >
            প্রোফাইল আপডেট করুন
          </Link>
        </div>
      </div>
    </main>
  );
}

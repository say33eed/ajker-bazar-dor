
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

function UpdateProfileForm({
  currentName,
  email,
}: {
  currentName: string;
  email: string;
}) {
  const router = useRouter();

  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newName = name.trim();

    if (!newName) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: newName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "প্রোফাইল আপডেট করা যায়নি"
        );
        return;
      }

      toast.success("প্রোফাইল আপডেট হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("প্রোফাইল আপডেট করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[75vh] bg-[#eff5f0] px-4 py-12">
      <div className="mx-auto max-w-[600px]">
        <Link
          href="/profile"
          className="mb-6 inline-block text-sm font-semibold text-[#008b45] hover:underline"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>

        <div className="rounded-[20px] border border-[#dfe8e0] bg-[#fbfdfb] p-7 shadow-sm sm:p-9">
          <h1 className="text-[26px] font-bold text-[#202c23]">
            প্রোফাইল আপডেট
          </h1>

          <p className="mt-2 text-sm text-[#68756b]">
            আপনার অ্যাকাউন্টের তথ্য পরিবর্তন করুন
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#202c23]"
              >
                নাম
              </label>

              <input
                id="name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="input w-full border-[#dfe8e0] bg-white focus:border-[#008b45]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#202c23]"
              >
                ইমেইল
              </label>

              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="input w-full cursor-not-allowed border-[#dfe8e0] bg-[#f1f4f1] text-gray-500"
              />
              <p className="mt-2 text-xs text-[#68756b]">
                এখানে ইমেইল পরিবর্তন করা যাবে না।
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="inline-flex w-full items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-6 py-3 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all hover:bg-[#007e3e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#eff5f0]">
        <span className="loading loading-spinner loading-lg text-[#008b45]" />
      </main>
    );
  }

  return (
    <UpdateProfileForm
      key={session.user.id}
      currentName={session.user.name}
      email={session.user.email}
    />
  );
}

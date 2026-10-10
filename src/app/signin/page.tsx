
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "সাইন ইন ব্যর্থ হয়েছে");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে!");

      const requestedPath = searchParams.get("callbackUrl");
      const destination =
        requestedPath?.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/profile";

      router.push(destination);
      router.refresh();
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#eff5f0] px-4 py-12">
      <div className="w-full max-w-[440px] rounded-[20px] border border-[#dfe8e0] bg-[#fbfdfb] p-7 shadow-sm sm:p-9">
        <h1 className="text-center text-[28px] font-bold text-[#202c23]">
          সাইন ইন
        </h1>

        <p className="mt-2 text-center text-sm text-[#68756b]">
          আপনার অ্যাকাউন্টে প্রবেশ করুন
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@email.com"
              className="input w-full border-[#dfe8e0] bg-white focus:border-[#008b45] focus:outline-[#008b45]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-[#202c23]"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              className="input w-full border-[#dfe8e0] bg-white focus:border-[#008b45] focus:outline-[#008b45]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-6 py-3 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all hover:bg-[#007e3e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#68756b]">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-bold text-[#008b45] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </main>
  );
}

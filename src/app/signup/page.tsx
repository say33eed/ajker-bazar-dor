
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "সাইন আপ ব্যর্থ হয়েছে");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#eff5f0] px-4 py-12">
      <div className="w-full max-w-[440px] rounded-[20px] border border-[#dfe8e0] bg-[#fbfdfb] p-7 shadow-sm sm:p-9">
        <h1 className="text-center text-[28px] font-bold text-[#202c23]">
          সাইন আপ
        </h1>

        <p className="mt-2 text-center text-sm text-[#68756b]">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold">
              নাম
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="আপনার নাম"
              className="input w-full border-[#dfe8e0] bg-white focus:border-[#008b45]"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
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
              className="input w-full border-[#dfe8e0] bg-white focus:border-[#008b45]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="input w-full border-[#dfe8e0] bg-white focus:border-[#008b45]"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="পাসওয়ার্ড আবার লিখুন"
              className="input w-full border-[#dfe8e0] bg-white focus:border-[#008b45]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-6 py-3 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all hover:bg-[#007e3e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন আপ"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#68756b]">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="font-bold text-[#008b45] hover:underline">
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}

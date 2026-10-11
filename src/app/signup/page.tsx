
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import GoogleIcon from "@/components/GoogleIcon";
import toast from "react-hot-toast";

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.82c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.25-1.25-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1.01 1.72 2.65 1.22 3.29.93.1-.73.4-1.22.72-1.5-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.16a10.75 10.75 0 0 1 5.6 0c2.14-1.45 3.08-1.16 3.08-1.16.62 1.55.23 2.7.12 2.98.72.79 1.15 1.8 1.15 3.03 0 4.33-2.63 5.28-5.14 5.56.41.35.77 1.03.77 2.08v3.08c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8z" />
    </svg>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");

  useEffect(() => {
    if (!oauthError) return;

    const message =
      oauthError === "account_not_linked"
        ? "এই ইমেইলে আগে অ্যাকাউন্ট আছে। ইমেইল ও পাসওয়ার্ড দিয়ে সাইন ইন করে Google অ্যাকাউন্ট লিংক করুন।"
        : oauthErrorDescription ||
          `সোশ্যাল লগইন ব্যর্থ হয়েছে: ${oauthError}`;

    toast.error(message, {
      id: "signup-oauth-error",
      duration: 7000,
    });
  }, [oauthError, oauthErrorDescription]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না");
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
        toast.error(
          result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(
    provider: "google" | "github"
  ) {
    if (socialLoading || loading) return;

    setSocialLoading(provider);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/signup",
      });

      if (result.error) {
        toast.error(
          result.error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে"
        );
        setSocialLoading(null);
      }
    } catch {
      toast.error("সোশ্যাল লগইন শুরু করা যায়নি");
      setSocialLoading(null);
    }
  }

  const inputClass =
    "h-[35px] w-full rounded-[9px] border border-[#dce6de] bg-transparent px-3 text-[13px] text-[#243027] outline-none focus:border-[#008d43] focus:ring-1 focus:ring-[#008d43]";

  const labelClass =
    "mb-1.5 block text-[13px] font-semibold text-[#243027]";

  const socialButtonClass =
    "flex h-[35px] items-center justify-center gap-1.5 rounded-[8px] border border-[#dce6de] text-[11px] font-semibold text-[#26332a] hover:bg-[#f1f6f2] disabled:opacity-60";

  return (
    <main className="min-h-[calc(100vh-190px)] bg-[#f0f5f0] px-4 pb-14 pt-6">
      <div className="mx-auto w-full max-w-[350px]">
        <div className="mb-5 text-center">
          <h1 className="text-[24px] font-extrabold text-[#1e2b21]">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="mt-1 text-[12px] text-[#758177]">
            বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </div>

        <div className="rounded-[15px] border border-[#dce6de] bg-[#fbfdfb] px-5 py-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className={labelClass}>
                নাম
              </label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="যেমন: রহিম উদ্দিন"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="signup-email" className={labelClass}>
                ইমেইল
              </label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="signup-password" className={labelClass}>
                পাসওয়ার্ড
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="signup-confirm-password"
                className={labelClass}
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="আবার লিখুন"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="h-[36px] w-full rounded-[7px] bg-[#008e42] text-[13px] font-bold text-white shadow-[0_3px_3px_rgba(0,100,40,0.28)] hover:bg-[#007d39] disabled:opacity-60"
            >
              {loading
                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#dce6de]" />
            <span className="text-[12px] text-[#6b786e]">
              অথবা
            </span>
            <div className="h-px flex-1 bg-[#dce6de]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading || socialLoading !== null}
              className={socialButtonClass}
            >
              <GoogleIcon />
              {socialLoading === "google"
                ? "অপেক্ষা..."
                : "Google দিয়ে চালিয়ে যান"}
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              disabled={loading || socialLoading !== null}
              className={socialButtonClass}
            >
              <GitHubIcon />
              {socialLoading === "github"
                ? "অপেক্ষা..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </button>
          </div>

          <p className="mt-4 text-center text-[12px] text-[#445148]">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-semibold text-[#008e42] hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-[12px] text-[#849087] hover:text-[#008e42]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}

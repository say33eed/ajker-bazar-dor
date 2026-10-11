
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { signIn } from "@/lib/auth-client";
import GoogleIcon from "@/components/GoogleIcon";
import GitHubIcon from "@/components/GitHubIcon";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  const oauthError = searchParams.get("error");
  const oauthErrorDescription =
    searchParams.get("error_description");

  const requestedPath = searchParams.get("callbackUrl");

  const destination =
    requestedPath?.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.startsWith("/\\")
      ? requestedPath
      : "/";

  useEffect(() => {
    if (!oauthError) return;

    const message =
      oauthError === "account_not_linked"
        ? "এই ইমেইলে আগে অ্যাকাউন্ট আছে।"
        : oauthErrorDescription ||
          `সোশ্যাল লগইন ব্যর্থ হয়েছে: ${oauthError}`;

    toast.error(message, {
      id: "signin-oauth-error",
      duration: 5000,
    });
  }, [oauthError, oauthErrorDescription]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "সাইন ইন ব্যর্থ হয়েছে"
        );
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে!");
      router.replace(destination);
      router.refresh();
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
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
        callbackURL: destination,
        errorCallbackURL: "/signin",
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
            সাইন ইন
          </h1>

          <p className="mt-1 text-[12px] text-[#758177]">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        <div className="rounded-[15px] border border-[#dce6de] bg-[#fbfdfb] px-5 py-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="signin-email"
                className={labelClass}
              >
                ইমেইল
              </label>

              <input
                id="signin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="signin-password"
                className={labelClass}
              >
                পাসওয়ার্ড
              </label>

              <input
                id="signin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="কমপক্ষে ৮ অক্ষর"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="h-[36px] w-full rounded-[7px] bg-[#008e42] text-[13px] font-bold text-white shadow-[0_3px_3px_rgba(0,100,40,0.28)] hover:bg-[#007d39] disabled:opacity-60"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
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
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#008e42] hover:underline"
            >
              সাইন আপ করুন
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

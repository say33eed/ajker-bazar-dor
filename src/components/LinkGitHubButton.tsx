
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import GitHubIcon from "@/components/GitHubIcon";
import toast from "react-hot-toast";

export default function LinkGitHubButton() {
  const [loading, setLoading] = useState(false);

  async function handleLink() {
    if (loading) return;
    setLoading(true);

    try {
      const result = await authClient.linkSocial({
        provider: "github",
        callbackURL: "/profile",
      });

      if (result.error) {
        toast.error(
          result.error.message || "GitHub লিংক করা যায়নি"
        );
      }
    } catch {
      toast.error("GitHub লিংক শুরু করা যায়নি");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLink}
      disabled={loading}
      className="mt-4 inline-flex items-center justify-center gap-2 rounded-[12px] border border-[#dce6de] bg-white px-4 py-2.5 text-sm font-semibold text-[#243027] hover:bg-[#f1f6f2] disabled:opacity-60"
    >
      <GitHubIcon />
      {loading
        ? "GitHub লিংক হচ্ছে..."
        : "GitHub অ্যাকাউন্ট লিংক করুন"}
    </button>
  );
}

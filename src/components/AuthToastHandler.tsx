"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function AuthToastHandler() {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending || !session?.user) return;

    const url = new URL(window.location.href);

    if (url.searchParams.get("authToast") !== "login") {
      return;
    }

    url.searchParams.delete("authToast");

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`
    );

    toast.success("সাইন ইন সফল হয়েছে!", {
      id: "oauth-login-success",
    });
  }, [isPending, session?.user]);

  return null;
}
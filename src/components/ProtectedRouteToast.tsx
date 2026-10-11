
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function ProtectedRouteToast() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const reason = searchParams.get("reason");

  useEffect(() => {
    if (pathname !== "/signin" || reason !== "auth-required") {
      return;
    }

    toast("এই পেজটি দেখতে প্রথমে সাইন ইন করুন।", {
      id: "protected-route-redirect",
      icon: "🔒",
      duration: 4000,
    });

    // Remove only the reason parameter so the message
    // doesn't reappear when the page is refreshed.
    const url = new URL(window.location.href);
    url.searchParams.delete("reason");

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  }, [pathname, reason]);

  return null;
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { Product } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [navigating, setNavigating] = useState(false);

  const productPath = `/product/${product.id}`;

  function handleProductClick() {
    if (isPending || navigating) return;

    setNavigating(true);

    if (!session?.user) {
      const signInPath =
        `/signin?callbackUrl=${encodeURIComponent(productPath)}`;

      router.push(signInPath);
      return;
    }

    router.push(productPath);
  }

  const productName =
    "nameBn" in product &&
    typeof product.nameBn === "string"
      ? product.nameBn
      : "পণ্য";

  const price =
    "todayPrice" in product &&
    typeof product.todayPrice === "number"
      ? product.todayPrice
      : null;

  const image =
    "image" in product &&
    typeof product.image === "string"
      ? product.image
      : null;

  const disabled = isPending || navigating;

  return (
    <button
      type="button"
      onClick={handleProductClick}
      disabled={disabled}
      aria-label={`${productName} এর বিস্তারিত দেখুন`}
      className="group flex w-full flex-col overflow-hidden rounded-[15px] border border-[#e0e8e1] bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#b8d9c2] hover:shadow-md disabled:cursor-wait"
    >
      {/* Product image */}
      <div className="flex h-[155px] w-full items-center justify-center bg-[#f0f5f0] p-5">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={productName}
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="text-5xl"
            aria-hidden="true"
          >
            🛒
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="flex w-full flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-[16px] font-bold text-[#263027]">
          {productName}
        </h3>

        <p className="mb-4 text-[12px] text-[#78847b]">
          আজকের বাজার দর
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            {price !== null ? (
              <p className="text-[21px] font-extrabold text-[#008e43]">
                ৳{price}
              </p>
            ) : (
              <p className="text-sm font-semibold text-[#008e43]">
                বিস্তারিত দেখুন
              </p>
            )}
          </div>

          <span className="rounded-lg bg-[#e6f4e9] px-3 py-1.5 text-[12px] font-semibold text-[#008e43] transition-colors group-hover:bg-[#008e43] group-hover:text-white">
            {disabled ? (
              <span className="flex items-center gap-1.5">
                <span className="loading loading-spinner loading-xs" />
                অপেক্ষা...
              </span>
            ) : (
              "বিস্তারিত →"
            )}
          </span>
        </div>
      </div>
    </button>
  );
}

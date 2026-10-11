
"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  formatPrice,
  getUnitBn,
  toBengaliNumber,
  type Product,
} from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

// Match the small grocery illustrations in the Figma design.
function getProductEmoji(product: Product): string {
  const name = product.nameBn;
  const category = product.category;

  if (name.includes("পেঁয়াজ")) return "🧅";
  if (name.includes("আদা")) return "🫚";
  if (name.includes("রসুন")) return "🧄";
  if (name.includes("আলু")) return "🥔";
  if (name.includes("কাঁচামরিচ")) return "🌶️";
  if (name.includes("মরিচ")) return "🌶️";
  if (name.includes("বেগুন")) return "🍆";
  if (name.includes("টমেটো")) return "🍅";
  if (name.includes("লেবু")) return "🍋";
  if (name.includes("শসা")) return "🥒";
  if (name.includes("ডিম")) return "🥚";
  if (name.includes("দুধ")) return "🥛";
  if (name.includes("মুরগি")) return "🍗";
  if (name.includes("গরুর মাংস")) return "🥩";
  if (name.includes("খাসির মাংস")) return "🥩";
  if (name.includes("মাছ")) return "🐟";
  if (name.includes("চিংড়ি")) return "🦐";
  if (name.includes("চাল")) return "🍚";
  if (name.includes("ডাল")) return "🫘";
  if (name.includes("তেল")) return "🫙";
  if (name.includes("চিনি")) return "🧂";
  if (name.includes("লবণ")) return "🧂";
  if (name.includes("হলুদ")) return "🌾";

  if (category === "chal") return "🍚";
  if (category === "dal") return "🫘";
  if (category === "tel") return "🫙";
  if (category === "sobji") return "🥬";
  if (category === "mach") return "🐟";
  if (category === "mangsho") return "🍗";
  if (category === "dim-dudh") return "🥚";
  if (category === "moshla") return "🌶️";

  return product.categoryIcon || "🛒";
}

function PriceChangeBadge({
  change,
}: {
  change: Product["change"];
}) {
  const percentage = toBengaliNumber(
    Math.abs(change.pct).toFixed(1)
  );

  if (change.dir === "up") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#fff0f0] px-2.5 py-1 text-[11px] font-bold text-[#e53935]">
        <span aria-hidden="true">▲</span>
        {percentage}%
      </span>
    );
  }

  if (change.dir === "down") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#e8f6ec] px-2.5 py-1 text-[11px] font-bold text-[#008c45]">
        <span aria-hidden="true">▼</span>
        {percentage}%
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-[#f0f2f0] px-2.5 py-1 text-[11px] font-bold text-[#7c8780]">
      — {percentage}%
    </span>
  );
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const productName = product.nameBn || "পণ্য";
  const productEmoji = getProductEmoji(product);
  const unit = getUnitBn(product.unit);

  const productPath = `/product/${product.slug || product.id}`;

  function handleProductClick() {
    if (isPending) return;

    if (!session?.user) {
      const params = new URLSearchParams({
        callbackUrl: productPath,
        reason: "auth-required",
      });

      router.push(`/signin?${params.toString()}`);
      return;
    }

    router.push(productPath);
  }

  return (
    <button
      type="button"
      onClick={handleProductClick}
      disabled={isPending}
      aria-label={`${productName} এর বিস্তারিত দেখুন`}
      className="group flex min-h-[142px] w-full cursor-pointer flex-col justify-between rounded-[15px] border border-[#e0e8e1] bg-[#fbfdfb] p-4 text-left shadow-[0_2px_5px_rgba(25,55,35,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b9d9c2] hover:shadow-[0_6px_16px_rgba(25,55,35,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008b45] disabled:cursor-wait"
    >
      {/* Top: Emoji, name and unit */}
      <div className="flex w-full items-center gap-3">
        <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] bg-[#f0f5f0] text-[25px]">
          <span role="img" aria-label={productName}>
            {productEmoji}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-[15px] font-bold leading-6 text-[#1e2b21]">
            {productName}
          </h3>

          <p className="mt-0.5 text-[11px] leading-4 text-[#79867d]">
            {unit}
          </p>
        </div>
      </div>

      {/* Bottom: Today's price and change */}
      <div className="mt-5 flex w-full items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-medium text-[#78857c]">
            আজকের দাম
          </p>

          <p className="text-[19px] font-extrabold leading-6 text-[#1e2b21]">
            {formatPrice(product.today)}{" "}
            <span className="text-[13px] font-bold">
              টাকা
            </span>
          </p>
        </div>

        <PriceChangeBadge change={product.change} />
      </div>
    </button>
  );
}

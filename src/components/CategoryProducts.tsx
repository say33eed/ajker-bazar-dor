
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SortDropdown, {
  type SortOption,
} from "@/components/SortDropdown";
import {
  toBengaliNumber,
  toEnglishNumber,
  type Product,
} from "@/lib/utils";

type CategoryProductsProps = {
  products: Product[];
};

function numericPrice(value: number | string): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const parsed = toEnglishNumber(
    value.replace(/[,٬]/g, "")
  );

  return Number.isFinite(parsed) ? parsed : 0;
}

export default function CategoryProducts({
  products,
}: CategoryProductsProps) {
  const [sortBy, setSortBy] =
    useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "price-asc") {
      result.sort(
        (a, b) =>
          numericPrice(a.today) - numericPrice(b.today)
      );
    }

    if (sortBy === "price-desc") {
      result.sort(
        (a, b) =>
          numericPrice(b.today) - numericPrice(a.today)
      );
    }

    return result;
  }, [products, sortBy]);

  return (
    <section className="mt-4">

      {/* Sort toolbar */}
      <div className="flex min-h-[64px] items-center justify-end rounded-[16px] border border-[#dfe8e0] bg-[#fbfdfb] px-5 py-3">
        <SortDropdown
          value={sortBy}
          onChange={setSortBy}
        />
      </div>

      {/* Product count */}
      <p
        className="mt-4 text-[12px] text-[#68756b]"
        aria-live="polite"
      >
        মোট {toBengaliNumber(sortedProducts.length)}টি
        পণ্য দেখানো হচ্ছে
      </p>

      {sortedProducts.length === 0 ? (
        <div className="mt-4 rounded-[16px] border border-[#dfe8e0] bg-[#fbfdfb] px-6 py-12 text-center">
          <div className="mb-3 text-4xl">🛒</div>

          <h2 className="text-lg font-bold text-[#243127]">
            কোনো পণ্য পাওয়া যায়নি
          </h2>

          <p className="mt-2 text-sm text-[#68756b]">
            এই ক্যাটাগরিতে এখন কোনো পণ্য নেই।
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-[#008b45] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#007a3c]"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

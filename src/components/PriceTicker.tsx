
"use client";

import { useEffect, useState } from "react";
import {
  formatPrice,
  toBengaliNumber,
  type Product,
} from "@/lib/utils";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

const unitMap: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

function getProducts(data: unknown): Product[] {
  if (Array.isArray(data)) {
    return data as Product[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const response = data as Record<string, unknown>;

  if (Array.isArray(response.data)) {
    return response.data as Product[];
  }

  if (Array.isArray(response.products)) {
    return response.products as Product[];
  }

  if (
    response.data &&
    typeof response.data === "object"
  ) {
    const nested = response.data as Record<string, unknown>;

    if (Array.isArray(nested.products)) {
      return nested.products as Product[];
    }
  }

  return [];
}

function TickerItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => {
        const direction = product.change?.dir ?? "flat";
        const percentage = product.change?.pct ?? 0;

        return (
          <span
            key={product.id}
            className="mx-3 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] sm:mx-4 sm:text-[13px]"
          >
            {/* Product emoji from the API */}
            <span aria-hidden="true">
              {product.image || product.categoryIcon || "🛒"}
            </span>

            {/* Product name */}
            <span className="font-medium text-[#26352a]">
              {product.nameBn}
            </span>

            {/* Today's price */}
            <span className="text-[#69756d]">
              {formatPrice(product.today)} টাকা/
              {unitMap[product.unit] || product.unit}
            </span>

            {/* Price change */}
            <span
              className={`font-semibold ${
                direction === "up"
                  ? "text-red-500"
                  : direction === "down"
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              {direction === "up"
                ? "▲"
                : direction === "down"
                  ? "▼"
                  : "—"}{" "}
              {toBengaliNumber(
                Math.abs(percentage).toFixed(1)
              )}
              %
            </span>
          </span>
        );
      })}
    </>
  );
}

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load products: ${response.status}`
          );
        }

        const data: unknown = await response.json();
        const loadedProducts = getProducts(data);

        if (!controller.signal.aborted) {
          setProducts(loadedProducts);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Price ticker error:", error);
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full overflow-hidden border-t border-gray-200 bg-white"
      aria-label="আজকের পণ্যের দাম ও পরিবর্তন"
    >
      {/* Animated ticker track */}
      <div className="animate-marquee flex w-max flex-nowrap items-center whitespace-nowrap py-1.5">

        {/* First copy */}
        <div className="flex shrink-0 items-center">
          <TickerItems products={products} />
        </div>

        {/* Identical copy for seamless looping */}
        <div
          className="flex shrink-0 items-center"
          aria-hidden="true"
        >
          <TickerItems products={products} />
        </div>

      </div>
    </div>
  );
}

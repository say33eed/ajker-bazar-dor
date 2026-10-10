
"use client";

import { useEffect, useState } from "react";
import {
  formatPrice,
  toBengaliNumber,
  type Product,
} from "@/lib/utils";

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Products could not load");
        }
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Ticker error:", err);
      });
  }, []);

  if (products.length === 0) return null;

  const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
  };

  const renderItems = (copy: number) =>
    products.map((product) => (
      <span
        key={`${copy}-${product.id}`}
        className="mx-3 inline-flex shrink-0 items-center gap-1.5 text-[12px] sm:mx-4 sm:text-[13px]"
      >
        <span aria-hidden="true">{product.image}</span>

        <span className="font-medium text-[#26352a]">
          {product.nameBn}
        </span>

        <span className="text-[#69756d]">
          {formatPrice(product.today)} টাকা/
          {unitMap[product.unit] || product.unit}
        </span>

        <span
          className={`font-semibold ${
            product.change.dir === "up"
              ? "text-red-500"
              : product.change.dir === "down"
                ? "text-green-600"
                : "text-gray-400"
          }`}
        >
          {product.change.dir === "up"
            ? "▲"
            : product.change.dir === "down"
              ? "▼"
              : "—"}{" "}
          {toBengaliNumber(
            Math.abs(product.change.pct).toFixed(1)
          )}
          %
        </span>
      </span>
    ));

  return (
    <div
      className="overflow-hidden border-t border-gray-200 bg-white"
      aria-label="আজকের পণ্যের দাম ও পরিবর্তন"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap py-1.5">
        <div className="flex shrink-0 items-center">
          {renderItems(1)}
        </div>

        <div
          className="flex shrink-0 items-center"
          aria-hidden="true"
        >
          {renderItems(2)}
        </div>
      </div>
    </div>
  );
}

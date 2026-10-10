
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  type Product,
  getUnitBn,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const API =
  "https://openapi.programming-hero.com/api/bazardor";

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${API}/products/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const json: unknown = await res.json();
    if (!json || typeof json !== "object") return null;

    const wrapper = json as Record<string, unknown>;
    const value = wrapper.data ?? json;

    if (!value || typeof value !== "object") return null;

    const product = value as Product;

    if (
      typeof product.nameBn !== "string" ||
      typeof product.today !== "number"
    ) {
      return null;
    }

    return product;
  } catch (error) {
    console.error("Unable to load product:", error);
    return null;
  }
}

function bn(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function price(value: number): string {
  return `${bn(value)} টাকা`;
}

function unitLabel(unit: string): string {
  const units: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
  };

  return units[unit] ?? getUnitBn(unit);
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const markets = (product.markets ?? []).filter(
    (market) =>
      Number.isFinite(market.min) &&
      Number.isFinite(market.max)
  );

  const min =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : product.today;

  const max =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : product.today;

  const average =
    markets.length > 0
      ? markets.reduce(
          (sum, market) =>
            sum + (market.min + market.max) / 2,
          0
        ) / markets.length
      : product.today;

  const direction = product.change?.dir ?? "flat";
  const percent = product.change?.pct ?? 0;

  const up = direction === "up";
  const down = direction === "down";

  const difference = Math.abs(
    product.today - product.yesterday
  );

  return (
    <main className="min-h-[calc(100vh-200px)] bg-[#eef4ef] px-3 py-6 sm:px-5 lg:py-8">
      <div className="mx-auto max-w-[1120px]">
        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#708075]">
          <Link href="/" className="hover:text-[#008e47]">
            হোম
          </Link>
          <span>›</span>
          <Link
            href={`/category/${product.category}`}
            className="hover:text-[#008e47]"
          >
            {product.categoryNameBn}
          </Link>
          <span>›</span>
          <span className="text-[#253328]">
            {product.nameBn}
          </span>
        </nav>

        {/* TOP CARD */}
        <section className="flex flex-col gap-5 rounded-[17px] border border-[#dce6de] bg-[#fafcfb] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-[16px] bg-[#edf3ee] text-[48px]">
              <span role="img" aria-label={product.nameBn}>
                {product.categoryIcon || "🛒"}
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="text-[25px] font-extrabold leading-[1.25] text-[#1c2a20] sm:text-[30px]">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-[13px] text-[#68756b]">
                প্রতি {unitLabel(product.unit)} ·{" "}
                {product.categoryNameBn}
              </p>

              <p className="mt-2 text-[13px] text-[#253328]">
                গতকালের তুলনায় আজ দাম{" "}
                {up
                  ? "বেড়েছে"
                  : down
                    ? "কমেছে"
                    : "অপরিবর্তিত"}
                {difference > 0 && (
                  <> · {price(difference)}</>
                )}
              </p>
            </div>
          </div>

          {/* TODAY'S PRICE */}
          <div className="flex min-h-[138px] w-full shrink-0 flex-col items-center justify-center rounded-[16px] bg-[#edf3ee] px-4 py-3 text-center sm:w-[122px]">
            <p className="text-[12px] text-[#68756b]">
              আজকের দাম
            </p>

            <p className="mt-1 text-[29px] font-extrabold leading-tight text-[#1c2a20]">
              {bn(product.today)}
            </p>

            <p className="mt-1 text-[12px] text-[#68756b]">
              টাকা / {unitLabel(product.unit)}
            </p>

            <p
              className={`mt-2 text-[13px] font-bold ${
                up
                  ? "text-[#e23c43]"
                  : down
                    ? "text-[#009e50]"
                    : "text-[#77827a]"
              }`}
            >
              {up ? "▲" : down ? "▼" : "—"}{" "}
              {bn(percent)}%
            </p>
          </div>
        </section>

        {/* LOWER CARD */}
        <section className="mt-6 rounded-[17px] border border-[#dce6de] bg-[#fafcfb] px-4 py-5 sm:px-5">
          <h2 className="text-[16px] font-bold text-[#1c2a20]">
            দামের সারসংক্ষেপ
          </h2>

          {/* SUMMARY GRID */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-[15px] border border-[#dce6de] px-5 py-4">
              <p className="text-[12px] text-[#68756b]">
                সর্বনিম্ন দাম
              </p>
              <p className="mt-1 text-[21px] font-extrabold leading-tight text-[#009e50]">
                {price(min)}
              </p>
              <p className="mt-1 text-[11px] text-[#39473d]">
                সবচেয়ে কম দামের বাজার
              </p>
            </div>

            <div className="rounded-[15px] border border-[#dce6de] px-5 py-4">
              <p className="text-[12px] text-[#68756b]">
                সর্বোচ্চ দাম
              </p>
              <p className="mt-1 text-[21px] font-extrabold leading-tight text-[#e23c43]">
                {price(max)}
              </p>
              <p className="mt-1 text-[11px] text-[#39473d]">
                সবচেয়ে বেশি দামের বাজার
              </p>
            </div>

            <div className="rounded-[15px] border border-[#dce6de] px-5 py-4">
              <p className="text-[12px] text-[#68756b]">
                গড় দাম
              </p>
              <p className="mt-1 text-[21px] font-extrabold leading-tight text-[#009e50]">
                {price(average)}
              </p>
              <p className="mt-1 text-[11px] text-[#39473d]">
                প্রতি {unitLabel(product.unit)}-এর হিসাবে
              </p>
            </div>
          </div>

          {/* TABLE TITLE */}
          <h2 className="mb-4 mt-7 text-[16px] font-bold text-[#1c2a20]">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {/* TABLE */}
          {markets.length > 0 ? (
            <div className="overflow-x-auto rounded-[15px] border border-[#dce6de]">
              <table className="w-full min-w-[630px] border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#f8fbf9] text-[#78837b]">
                    <th className="px-4 py-3 text-left font-semibold">
                      বাজার
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      বিভাগ
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      সর্বনিম্ন
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      সর্বোচ্চ
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => {
                    const marketAverage =
                      (market.min + market.max) / 2;

                    return (
                      <tr
                        key={`${market.market}-${index}`}
                        className={`border-t border-[#8b958d] ${
                          index % 2 === 0
                            ? "bg-[#fafcfb]"
                            : "bg-[#edf3ee]"
                        }`}
                      >
                        <td className="px-4 py-[11px] text-left font-medium text-[#243127]">
                          {market.market}
                        </td>

                        <td className="px-4 py-[11px] text-left text-[#344239]">
                          {market.division}
                        </td>

                        <td className="px-4 py-[11px] text-right text-[#344239]">
                          {price(market.min)}
                        </td>

                        <td className="px-4 py-[11px] text-right text-[#344239]">
                          {price(market.max)}
                        </td>

                        <td className="px-4 py-[11px] text-right font-bold text-[#1c2a20]">
                          {price(marketAverage)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-[#edf3ee] p-6 text-center text-sm text-[#68756b]">
              বাজারভিত্তিক মূল্য পাওয়া যায়নি।
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

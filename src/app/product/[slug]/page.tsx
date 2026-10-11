
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  type Product,
  getUnitBn,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

const API =
  "https://openapi.programming-hero.com/api/bazardor";

type ProductDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.nameBn === "string" &&
    typeof product.today === "number" &&
    (typeof product.slug === "string" ||
      typeof product.id === "string" ||
      typeof product.id === "number")
  );
}

function extractProductList(
  response: unknown
): Product[] {
  if (Array.isArray(response)) {
    return response.filter(isProduct);
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const wrapper = response as Record<string, unknown>;

  if (Array.isArray(wrapper.data)) {
    return wrapper.data.filter(isProduct);
  }

  if (Array.isArray(wrapper.products)) {
    return wrapper.products.filter(isProduct);
  }

  if (
    wrapper.data &&
    typeof wrapper.data === "object"
  ) {
    const data = wrapper.data as Record<string, unknown>;

    if (Array.isArray(data.products)) {
      return data.products.filter(isProduct);
    }

    if (Array.isArray(data.items)) {
      return data.items.filter(isProduct);
    }
  }

  return [];
}

function extractSingleProduct(
  response: unknown
): Product | null {
  if (isProduct(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return null;
  }

  const wrapper = response as Record<string, unknown>;

  if (isProduct(wrapper.data)) {
    return wrapper.data;
  }

  if (isProduct(wrapper.product)) {
    return wrapper.product;
  }

  if (
    wrapper.data &&
    typeof wrapper.data === "object"
  ) {
    const data = wrapper.data as Record<string, unknown>;

    if (isProduct(data.product)) {
      return data.product;
    }
  }

  return null;
}

async function getProduct(
  slugOrId: string
): Promise<Product | null> {
  const requestedValue = slugOrId.trim();

  if (!requestedValue) {
    return null;
  }

  // First, try the single-product endpoint.
  try {
    const response = await fetch(
      `${API}/products/${encodeURIComponent(requestedValue)}`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const json: unknown = await response.json();

      const product = extractSingleProduct(json);

      if (product) {
        return product;
      }
    }
  } catch (error) {
    console.error(
      "Single product API error:",
      error
    );
  }

  // If the endpoint does not recognize a slug,
  // look up the product in the complete product list.
  try {
    const response = await fetch(
      `${API}/products`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const json: unknown = await response.json();

    const products = extractProductList(json);

    const matchedProduct = products.find(
      (product) =>
        product.slug === requestedValue ||
        String(product.id) === requestedValue
    );

    if (!matchedProduct) {
      return null;
    }

    // Prefer complete details from the ID endpoint,
    // because the list may not include market data.
    if (
      matchedProduct.id !== undefined &&
      matchedProduct.id !== null &&
      String(matchedProduct.id) !== requestedValue
    ) {
      try {
        const detailResponse = await fetch(
          `${API}/products/${encodeURIComponent(
            String(matchedProduct.id)
          )}`,
          {
            cache: "no-store",
          }
        );

        if (detailResponse.ok) {
          const detailJson: unknown =
            await detailResponse.json();

          const detailedProduct =
            extractSingleProduct(detailJson);

          if (detailedProduct) {
            return detailedProduct;
          }
        }
      } catch (error) {
        console.error(
          "Product details API error:",
          error
        );
      }
    }

    return matchedProduct;
  } catch (error) {
    console.error(
      "Product list API error:",
      error
    );

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
}: ProductDetailsPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const markets = (product.markets ?? []).filter(
    (market) =>
      Number.isFinite(market.min) &&
      Number.isFinite(market.max)
  );

  const min =
    markets.length > 0
      ? Math.min(
          ...markets.map((market) => market.min)
        )
      : product.today;

  const max =
    markets.length > 0
      ? Math.max(
          ...markets.map((market) => market.max)
        )
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
    product.today - (product.yesterday ?? product.today)
  );

  return (
    <main className="min-h-[calc(100vh-200px)] bg-[#eef4ef] px-3 py-6 sm:px-5 lg:py-8">
      <div className="mx-auto max-w-[1120px]">

        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#708075]">
          <Link
            href="/"
            className="hover:text-[#008e47]"
          >
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

            {/* Product icon */}
            <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-[16px] bg-[#edf3ee] text-[48px]">
              <span
                role="img"
                aria-label={product.nameBn}
              >
                {product.categoryIcon || "🛒"}
              </span>
            </div>

            {/* Product information */}
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

            {/* Minimum */}
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

            {/* Maximum */}
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

            {/* Average */}
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

          {/* MARKET TABLE */}
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

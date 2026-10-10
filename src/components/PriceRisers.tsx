
import ProductCard from "./ProductCard";
import { type Product } from "@/lib/utils";

export default function PriceRisers({
  products,
}: {
  products: Product[];
}) {
  // Only products whose prices increased
  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort(
      (a, b) => b.change.pct - a.change.pct
    )
    .slice(0, 6);

  // Do not show an empty section
  if (risers.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1120px] px-4">
        <h2 className="mb-5 flex items-center gap-2 text-[20px] font-bold text-[#202c23]">
          <span
            className="text-[#e33439]"
            aria-hidden="true"
          >
            ▲
          </span>
          আজ দাম বেড়েছে
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {risers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

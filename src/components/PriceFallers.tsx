
import ProductCard from "./ProductCard";
import { type Product } from "@/lib/utils";

export default function PriceFallers({
  products,
}: {
  products: Product[];
}) {
  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort(
      (a, b) =>
        Math.abs(b.change.pct) -
        Math.abs(a.change.pct)
    )
    .slice(0, 6);

  if (fallers.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1120px] px-4">
        <h2 className="mb-5 flex items-center gap-2 text-[20px] font-bold text-[#202c23]">
          <span
            className="text-[#07934b]"
            aria-hidden="true"
          >
            ▼
          </span>
          আজ দাম কমেছে
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fallers.map((product) => (
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

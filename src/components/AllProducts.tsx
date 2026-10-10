
import ProductCard from "./ProductCard";
import {
  toBengaliNumber,
  type Product,
} from "@/lib/utils";

type AllProductsProps = {
  products: Product[];
};

export default function AllProducts({
  products,
}: AllProductsProps) {
  return (
    <section
      id="সব-পণ্য"
      className="scroll-mt-36 py-8"
    >
      <div className="mx-auto max-w-[1120px] px-4">
        <h2 className="text-[22px] font-bold text-[#202c23]">
          সব পণ্য
        </h2>

        <p className="mb-5 mt-3 text-[13px] text-[#68756b]">
          মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {products.length === 0 ? (
          <p className="rounded-[17px] border border-[#dfe8e0] bg-[#fbfdfb] p-6 text-center text-[#68756b]">
            কোনো পণ্য পাওয়া যায়নি।
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

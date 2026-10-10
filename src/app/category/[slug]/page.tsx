
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import {
  toBengaliNumber,
  type Product,
  type Category,
} from "@/lib/utils";

const API = "https://openapi.programming-hero.com/api/bazardor";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const [productsResponse, categoriesResponse] =
    await Promise.all([
      fetch(
        `${API}/products?category=${encodeURIComponent(slug)}`,
        { next: { revalidate: 300 } }
      ),
      fetch(`${API}/categories`, {
        next: { revalidate: 300 },
      }),
    ]);

  if (!productsResponse.ok || !categoriesResponse.ok) {
    throw new Error("Failed to load category data");
  }

  const products: Product[] = await productsResponse.json();
  const categories: Category[] =
    await categoriesResponse.json();

  const category = categories.find(
    (item) => item.slug === slug || item.id === slug
  );

  return (
    <main className="min-h-screen bg-[#eff5f0] py-8">
      <div className="mx-auto max-w-[1120px] px-4">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-semibold text-[#008b45] hover:underline"
        >
          ← হোমে ফিরে যান
        </Link>

        <h1 className="text-[26px] font-bold text-[#202c23]">
          {category?.icon && (
            <span className="mr-2">{category.icon}</span>
          )}
          {category?.nameBn ?? "ক্যাটাগরির পণ্য"}
        </h1>

        <p className="mb-6 mt-2 text-sm text-[#68756b]">
          মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {products.length === 0 ? (
          <div className="rounded-[17px] border border-[#dfe8e0] bg-white p-8 text-center">
            এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
          </div>
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
    </main>
  );
}

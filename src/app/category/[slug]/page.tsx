
import Link from "next/link";
import CategoryProducts from "@/components/CategoryProducts";
import {
  type Product,
  type Category,
} from "@/lib/utils";

const API =
  "https://openapi.programming-hero.com/api/bazardor";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API}/categories`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Failed to load categories");
  }

  const data: unknown = await response.json();

  if (Array.isArray(data)) {
    return data as Category[];
  }

  if (data && typeof data === "object") {
    const wrapper = data as Record<string, unknown>;

    if (Array.isArray(wrapper.data)) {
      return wrapper.data as Category[];
    }

    if (Array.isArray(wrapper.categories)) {
      return wrapper.categories as Category[];
    }
  }

  return [];
}

async function getProducts(
  categorySlug: string
): Promise<Product[]> {
  const response = await fetch(
    `${API}/products?category=${encodeURIComponent(
      categorySlug
    )}`,
    {
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load category products");
  }

  const data: unknown = await response.json();

  let products: Product[] = [];

  if (Array.isArray(data)) {
    products = data as Product[];
  } else if (data && typeof data === "object") {
    const wrapper = data as Record<string, unknown>;

    if (Array.isArray(wrapper.data)) {
      products = wrapper.data as Product[];
    } else if (Array.isArray(wrapper.products)) {
      products = wrapper.products as Product[];
    } else if (
      wrapper.data &&
      typeof wrapper.data === "object"
    ) {
      const nested = wrapper.data as Record<string, unknown>;

      if (Array.isArray(nested.products)) {
        products = nested.products as Product[];
      }
    }
  }

  // Keep only products belonging to this category.
  return products.filter(
    (product) => product.category === categorySlug
  );
}

function EmptyCategory() {
  return (
    <div className="rounded-[16px] border border-[#dfe8e0] bg-[#fbfdfb] px-6 py-14 text-center">
      <div className="mb-4 text-5xl">🛒</div>

      <h2 className="text-xl font-bold text-[#243127]">
        কোনো পণ্য পাওয়া যায়নি
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-[#68756b]">
        এই ক্যাটাগরিতে কোনো পণ্য নেই অথবা
        ক্যাটাগরিটি সঠিক নয়।
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#008b45] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#007a3c]"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}

export default async function CategoryPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const categories = await getCategories();

  const category = categories.find(
    (item) => item.slug === slug || item.id === slug
  );

  if (!category) {
    return (
      <main className="min-h-screen bg-[#eff5f0] px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-[1120px]">
          <EmptyCategory />
        </div>
      </main>
    );
  }

  const products = await getProducts(category.slug);

  return (
    <main className="min-h-screen bg-[#eff5f0] px-4 py-4 sm:py-6">
      <div className="mx-auto max-w-[1120px]">

        {/* Category heading */}
        <section className="flex min-h-[94px] items-center gap-3 rounded-[16px] border border-[#dfe8e0] bg-[#fbfdfb] px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[30px]">
            <span role="img" aria-label={category.nameBn}>
              {category.icon || "🛒"}
            </span>
          </div>

          <div>
            <h1 className="text-[19px] font-extrabold leading-6 text-[#1e2b21]">
              {category.nameBn}
            </h1>

            <p className="mt-0.5 text-[12px] text-[#78857c]">
              প্রতি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        {/* Sorting and products */}
        <CategoryProducts products={products} />

      </div>
    </main>
  );
}

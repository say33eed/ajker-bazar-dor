
import Hero from "@/components/Hero";
import PriceRisers from "@/components/PriceRisers";
import PriceFallers from "@/components/PriceFallers";
import AllProducts from "@/components/AllProducts";
import { type Product } from "@/lib/utils";

const PRODUCTS_API =
  "https://api.abcz.workers.dev/api/bazardor/products";

async function getProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_API, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products: Product[] = await response.json();

  return products;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#eff5f0]">
      <Hero />

      <PriceRisers products={products} />

      <PriceFallers products={products} />

      <AllProducts products={products} />
    </main>
  );
}

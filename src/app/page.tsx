
import Hero from "@/components/Hero";
import PriceRisers from "@/components/PriceRisers";
import PriceFallers from "@/components/PriceFallers";
import AllProducts from "@/components/AllProducts";
import { type Product } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PRODUCTS_API =
  "https://openapi.programming-hero.com/api/bazardor/products";

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(PRODUCTS_API, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Products API returned:",
        response.status
      );
      return [];
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      console.error("Unexpected products API response");
      return [];
    }

    return data as Product[];
  } catch (error) {
    console.error("Failed to load products:", error);
    return [];
  }
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

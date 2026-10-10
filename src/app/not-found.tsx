
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#eff5f0] px-4 py-12">
      <div className="max-w-lg text-center">
        <div className="mb-4 text-[90px] font-bold leading-none text-[#008b45]">
          404
        </div>

        <h1 className="mb-3 text-[28px] font-bold text-[#202c23]">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mb-8 text-[15px] leading-7 text-[#68756b]">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি পাওয়া যায়নি।
          অনুগ্রহ করে হোমপেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-6 py-3 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all hover:bg-[#007e3e]"
        >
          হোমপেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}

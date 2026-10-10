
import Image from "next/image";
import { getBanglaDate } from "@/lib/utils";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-6 py-3 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all duration-200 hover:bg-[#007e3e] hover:shadow-[0_8px_14px_rgba(0,139,69,0.38)] active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008b45]";

export default function Hero() {
  return (
    <section className="bg-[#eff5f0] px-4 pt-6 pb-8 md:pt-7 md:pb-10">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-6 rounded-[24px] border border-[#e0e9e2] bg-[#fbfdfb] px-5 py-7 sm:px-8 md:min-h-[290px] md:flex-row md:px-4 md:py-6">
        {/* Left: text content */}
        <div className="w-full min-w-0 md:flex-1">
          <span className="mb-3 inline-block rounded-full bg-[#e4f4e9] px-3 py-1 text-[12px] font-medium text-[#008b45]">
            {getBanglaDate()}
          </span>

          <h1 className="mb-5 text-[27px] leading-[1.25] font-bold text-[#1c271e] sm:text-[32px] lg:text-[36px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mb-7 max-w-[610px] text-[14px] leading-[1.7] text-[#66736a] sm:text-[15px]">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className={primaryButtonClass}
          >
            সব পণ্য দেখুন
          </a>
        </div>

        {/* Right: existing hero image */}
        <div className="flex w-full shrink-0 items-center justify-center md:w-[270px] lg:w-[300px]">
          <Image
            src="/bazar-hero.png"
            alt="ফল ও সবজির ঝুড়ি"
            width={320}
            height={260}
            priority
            className="h-auto w-full max-w-[270px] object-contain lg:max-w-[300px]"
          />
        </div>
      </div>
    </section>
  );
}


import Image from "next/image";
import { getBanglaDate } from "@/lib/utils";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-[14px] border border-[#007a3c] bg-[#008b45] px-6 py-3 text-sm font-bold text-white shadow-[0_6px_10px_rgba(0,139,69,0.32)] transition-all duration-200 hover:bg-[#007e3e] hover:shadow-[0_8px_14px_rgba(0,139,69,0.38)] active:translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008b45]";

export default function Hero() {
  const banglaDate = getBanglaDate();

  return (
    <section className="bg-[#eff5f0] px-4 pb-8 pt-6 md:pb-10 md:pt-7">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-6 rounded-[24px] border border-[#e0e9e2] bg-[#fbfdfb] px-5 py-7 sm:px-8 md:min-h-[290px] md:flex-row md:px-4 md:py-6">

        {/* LEFT CONTENT */}
        <div className="w-full min-w-0 md:flex-1">

          {/* BENGALI DATE BADGE */}
          <div className="mb-4">
            <span
              lang="bn"
              className="
                inline-flex
                min-h-[44px]
                w-fit
                max-w-full
                items-center
                justify-center
                rounded-full
                bg-[#e4f4e9]
                px-5
                py-2.5
                text-[14px]
                font-normal
                leading-[2]
                whitespace-nowrap
                text-[#008b45]
                sm:text-[15px]
              "
              style={{
                fontFamily:
                  '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
                fontVariantLigatures: "normal",
                textRendering: "optimizeLegibility",
              }}
            >
              {banglaDate}
            </span>
          </div>

          {/* HEADING */}
          <h1 className="mb-5 text-[27px] font-bold leading-[1.3] text-[#1c271e] sm:text-[32px] lg:text-[36px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* DESCRIPTION */}
          <p className="mb-7 max-w-[610px] text-[14px] leading-[1.8] text-[#66736a] sm:text-[15px]">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* VIEW ALL PRODUCTS BUTTON */}
          <a
            href="#সব-পণ্য"
            className={primaryButtonClass}
          >
            সব পণ্য দেখুন
          </a>
        </div>

        {/* RIGHT IMAGE */}
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

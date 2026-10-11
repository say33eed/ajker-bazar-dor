
function SkeletonProductCard() {
  return (
    <div
      className="flex min-h-[142px] flex-col justify-between rounded-[15px] border border-[#e0e8e1] bg-[#fbfdfb] p-4 shadow-[0_2px_5px_rgba(25,55,35,0.05)]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-[46px] w-[46px] shrink-0 animate-pulse rounded-[12px] bg-[#e5eee6]" />

        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-[#e5eee6]" />
          <div className="h-3 w-1/2 animate-pulse rounded-md bg-[#eaf0ea]" />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded-md bg-[#eaf0ea]" />
          <div className="h-6 w-24 animate-pulse rounded-md bg-[#e5eee6]" />
        </div>

        <div className="h-6 w-16 animate-pulse rounded-full bg-[#eaf0ea]" />
      </div>
    </div>
  );
}

function SkeletonSection({
  titleWidth = "w-44",
  cardCount = 6,
}: {
  titleWidth?: string;
  cardCount?: number;
}) {
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-8">
      <div className="mb-5 space-y-3" aria-hidden="true">
        <div
          className={`h-7 ${titleWidth} animate-pulse rounded-lg bg-[#dce9de]`}
        />
        <div className="h-4 w-64 max-w-full animate-pulse rounded-md bg-[#e4eee5]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardCount }, (_, index) => (
          <SkeletonProductCard key={index} />
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#eff5f0] pb-12"
      role="status"
      aria-label="বাজারের তথ্য লোড হচ্ছে"
      aria-busy="true"
    >
      <span className="sr-only">
        বাজারের তথ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।
      </span>

      {/* Hero skeleton */}
      <section className="px-4 pb-8 pt-6 md:pb-10 md:pt-7">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-6 rounded-[24px] border border-[#e0e9e2] bg-[#fbfdfb] px-5 py-7 sm:px-8 md:min-h-[290px] md:flex-row md:px-4 md:py-6">
          {/* Left content */}
          <div className="w-full min-w-0 md:flex-1">
            <div className="mb-4 h-[40px] w-[205px] max-w-full animate-pulse rounded-full bg-[#e4f4e9]" />

            <div className="mb-5 h-9 w-full max-w-[440px] animate-pulse rounded-lg bg-[#dce9de]" />

            <div className="mb-2 h-4 w-full max-w-[560px] animate-pulse rounded-md bg-[#e6eee7]" />

            <div className="mb-7 h-4 w-4/5 max-w-[440px] animate-pulse rounded-md bg-[#e6eee7]" />

            <div className="h-[43px] w-[155px] animate-pulse rounded-[14px] bg-[#cce7d4]" />
          </div>

          {/* Right image placeholder */}
          <div className="flex w-full shrink-0 items-center justify-center md:w-[270px] lg:w-[300px]">
            <div className="h-[210px] w-full max-w-[270px] animate-pulse rounded-[20px] bg-[#e8f0e9] lg:max-w-[300px]" />
          </div>
        </div>
      </section>

      {/* Price risers */}
      <SkeletonSection titleWidth="w-48" cardCount={6} />

      {/* Price fallers */}
      <SkeletonSection titleWidth="w-48" cardCount={6} />

      {/* All products */}
      <SkeletonSection titleWidth="w-36" cardCount={9} />
    </div>
  );
}

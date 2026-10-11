
export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#eff5f0] px-4 py-4 sm:py-6">
      <div className="mx-auto max-w-[1120px]">

        {/* Category header skeleton */}
        <div className="flex min-h-[94px] items-center gap-3 rounded-[16px] border border-[#dfe8e0] bg-[#fbfdfb] px-5 py-4">
          <div className="skeleton h-10 w-10 rounded-xl" />

          <div className="space-y-2">
            <div className="skeleton h-5 w-24" />
            <div className="skeleton h-3 w-48" />
          </div>
        </div>

        {/* Sort toolbar skeleton */}
        <div className="mt-4 flex min-h-[64px] items-center justify-end rounded-[16px] border border-[#dfe8e0] bg-[#fbfdfb] px-5 py-3">
          <div className="skeleton h-8 w-36 rounded-lg" />
        </div>

        {/* Product count skeleton */}
        <div className="skeleton mt-4 h-3 w-36" />

        {/* Product cards skeleton */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-[142px] flex-col justify-between rounded-[15px] border border-[#e0e8e1] bg-[#fbfdfb] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="skeleton h-[46px] w-[46px] rounded-xl" />

                <div className="space-y-2">
                  <div className="skeleton h-4 w-28" />
                  <div className="skeleton h-3 w-16" />
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <div className="space-y-2">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-6 w-24" />
                </div>

                <div className="skeleton h-6 w-14 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

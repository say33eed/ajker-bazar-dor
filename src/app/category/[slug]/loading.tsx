
export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#eff5f0] py-8">
      <div className="mx-auto max-w-[1120px] px-4">
        <div className="skeleton mb-6 h-5 w-32" />
        <div className="skeleton mb-3 h-9 w-52" />
        <div className="skeleton mb-7 h-4 w-44" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[17px] border border-[#dfe8e0] bg-[#fbfdfb] p-[17px]"
            >
              <div className="flex items-center gap-3">
                <div className="skeleton h-[52px] w-[52px] rounded-[14px]" />
                <div className="flex-1">
                  <div className="skeleton mb-2 h-5 w-28" />
                  <div className="skeleton h-3 w-20" />
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="skeleton mb-2 h-3 w-20" />
                  <div className="skeleton h-6 w-24" />
                </div>
                <div className="skeleton h-7 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

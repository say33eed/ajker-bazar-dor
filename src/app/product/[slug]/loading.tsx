
export default function ProductLoading() {
  return (
    <main className="min-h-[75vh] bg-[#eff5f0] px-4 py-10">
      <div className="mx-auto max-w-[1120px]">
        <div className="skeleton mb-7 h-5 w-48" />

        <div className="grid grid-cols-1 gap-8 rounded-[20px] border border-[#dfe8e0] bg-[#fbfdfb] p-6 lg:grid-cols-2 lg:p-8">
          <div className="skeleton aspect-square w-full rounded-[16px]" />

          <div className="space-y-5">
            <div className="skeleton h-5 w-28" />
            <div className="skeleton h-9 w-3/4" />
            <div className="skeleton h-5 w-40" />

            <div className="skeleton mt-8 h-14 w-48" />

            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-5 w-4/5" />

            <div className="skeleton mt-8 h-12 w-40 rounded-[14px]" />
          </div>
        </div>

        <div className="skeleton mt-8 h-8 w-52" />
        <div className="skeleton mt-4 h-40 w-full rounded-[20px]" />
      </div>
    </main>
  );
}

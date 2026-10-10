
export default function CategoryLoading() {
  return (
    <main className="min-h-[75vh] bg-[#eff5f0] px-4 py-10">
      <div className="mx-auto max-w-[1120px]">
        <div className="skeleton mb-4 h-9 w-52" />
        <div className="skeleton mb-8 h-5 w-36" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[18px] border border-[#dfe8e0] bg-[#fbfdfb] p-5"
            >
              <div className="skeleton mb-5 h-36 w-full rounded-[12px]" />
              <div className="skeleton mb-3 h-6 w-2/3" />
              <div className="skeleton mb-5 h-4 w-1/3" />
              <div className="skeleton h-8 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

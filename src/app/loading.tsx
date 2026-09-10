export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse mx-auto mb-8"></div>
        <div className="h-12 w-full bg-gray-200 rounded-2xl animate-pulse mb-8"></div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse hidden sm:block"></div>
              </div>

              <div className="flex items-center gap-2 w-1/3 justify-center">
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                <span className="text-gray-300 font-bold">-</span>
                <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>

              <div className="flex items-center justify-end gap-3 w-1/3">
                <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse hidden sm:block"></div>
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

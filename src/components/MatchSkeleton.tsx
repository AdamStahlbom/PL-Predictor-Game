export default function MatchSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 w-full sm:w-1/3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          <div className="flex items-center justify-center gap-3 w-full sm:w-1/3">
            <div className="w-12 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            <span className="text-gray-300 font-bold">-</span>
            <div className="w-12 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-1/3 justify-end">
            <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse hidden sm:block"></div>
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

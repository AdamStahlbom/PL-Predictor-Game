export default function LeaderboardSkeleton() {
  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-4 sm:gap-6 w-full">
            <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-24 sm:w-40 h-5 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
          <div className="w-12 h-10 bg-gray-200 rounded-xl animate-pulse flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
}

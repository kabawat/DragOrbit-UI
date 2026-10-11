"use client";
export function ComingSoonChartView({ model }) {
  const { DynamicChartLayer, type, data, colors } = model;
  return (
    <div className="relative w-full h-full flex-grow min-h-[100px] overflow-hidden rounded-xl bg-[rgb(var(--color-bg-secondary))]/10 border border-[rgb(var(--color-border-primary))]/10">
      {/* Background Chart */}
      <div className="absolute inset-0 z-0 opacity-20 blur-[0.5px] w-full h-full flex flex-col items-stretch">
        <DynamicChartLayer type={type} data={data} colors={colors} />
      </div>

      {/* Animated Overlay Elements */}
      <div className="absolute top-4 left-4 flex gap-2 z-10 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-75" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-150" />
      </div>

      {/* Backdrop Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[rgb(var(--color-bg-secondary))]/20 backdrop-blur-[1px] transition-all duration-700 hover:backdrop-blur-none group">
        <div className="relative overflow-hidden px-6 py-2 rounded-xl transform transition-all duration-500 group-hover:scale-105 bg-[rgb(var(--color-bg-primary))] border border-[rgb(var(--color-border-primary))]/30 shadow-sm">
          {/* Shine effect */}
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-[rgb(var(--color-primary))]/10 to-transparent skew-x-[-20deg] animate-[shimmer_3s_infinite]" />

          <span className="relative text-[rgb(var(--color-text-primary))] font-bold tracking-[0.15em] text-xs uppercase opacity-90">
            Coming Soon
          </span>
        </div>

        <p className="mt-3 text-[0.5625rem] text-[rgb(var(--color-text-tertiary))] uppercase tracking-[0.2em] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Advanced Insights
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            left: 200%;
          }
        }
      `}</style>
    </div>
  );
}

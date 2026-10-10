"use client";

// Spinner Component
const Spinner = ({ size = "md", color = "blue", className = "", ...props }) => {
  // Size classes
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  // Color classes
  const colorClasses = {
    blue: "border-blue-500",
    primary: "border-[rgb(var(--color-primary))]",
    gray: "border-gray-500",
    white: "border-white",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
  };

  const spinnerClasses = `${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin ${className}`;

  return <div role="status" aria-label="Loading" className={spinnerClasses} {...props} />;
};

// Loading Component
const Loading = ({
  text = "Loading...",
  size = "md",
  color = "blue",
  showText = true,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <Spinner size={size} color={color} />
      {showText && (
        <span
          className={`ml-2 text-gray-600 ${size === "xs" ? "text-xs" : size === "sm" ? "text-sm" : "text-base"}`}
        >
          {text}
        </span>
      )}
    </div>
  );
};

// Skeleton Component
const Skeleton = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded",
  className = "",
  ...props
}) => {
  const skeletonClasses = `${width} ${height} ${rounded} bg-gray-200 animate-pulse ${className}`;

  return <div className={skeletonClasses} {...props} />;
};

// Skeleton Text Component
const SkeletonText = ({ lines = 3, className = "", ...props }) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? "w-3/4" : "w-full"}
          height="h-4"
        />
      ))}
    </div>
  );
};

// Skeleton Card Component
const SkeletonCard = ({
  showImage = true,
  showAvatar = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`p-6 border border-gray-200 rounded-lg ${className}`}
      {...props}
    >
      {showImage && <Skeleton width="w-full" height="h-48" className="mb-4" />}

      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <Skeleton width="w-10" height="h-10" rounded="rounded-full" />
            <Skeleton width="w-24" height="h-4" />
          </div>
        )}

        <SkeletonText lines={2} />

        <div className="flex space-x-2">
          <Skeleton width="w-16" height="h-8" />
          <Skeleton width="w-20" height="h-8" />
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({
  progress = 0,
  size = "md",
  color = "blue",
  showPercentage = false,
  className = "",
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  // Color classes
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    gray: "bg-gray-500",
  };

  const progressClasses = `${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden ${className}`;

  return (
    <div className={progressClasses} {...props}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} transition-all duration-300 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
      {showPercentage && (
        <div className="text-xs text-gray-600 mt-1 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

// Circular Progress Component
const CircularProgress = ({
  progress = 0,
  size = "md",
  color = "blue",
  showPercentage = true,
  strokeWidth = 2,
  className = "",
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  // Color classes
  const colorClasses = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    red: "stroke-red-500",
    yellow: "stroke-yellow-500",
    purple: "stroke-purple-500",
    gray: "stroke-gray-500",
  };

  const radius =
    size === "sm" ? 12 : size === "md" ? 18 : size === "lg" ? 24 : 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`} {...props}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClasses[color]} transition-all duration-300 ease-out`}
        />
      </svg>

      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-xs font-medium ${colorClasses[color].replace("stroke-", "text-")}`}
          >
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export {
  Spinner,
  Loading,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  ProgressBar,
  CircularProgress,
};
export default Loading;

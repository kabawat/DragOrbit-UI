"use client";
import { cn } from "../../utils/cn";
const Card = ({
  children,
  variant = "default",
  padding = "md",
  shadow = "",
  rounded = "lg",
  hover = false,
  className = "",
  onClick,
  ...props
}) => {
  // Variant classes - Theme aware
  const variantClasses = {
    default: "bg-[rgb(var(--color-bg-primary))] border",
    elevated: "bg-[rgb(var(--color-bg-primary))] border-0",
    outlined: "bg-[rgb(var(--color-bg-primary))] border-2",
    filled: "bg-[rgb(var(--color-bg-secondary))] border",
    glass:
      "bg-[rgb(var(--color-bg-primary))] bg-opacity-80 backdrop-blur-sm border border-[rgb(var(--color-border-primary))] border-opacity-20",
  };

  // Border color class - uses CSS variable that adapts to theme
  const borderColorClass =
    variant === "glass" ? "" : "border-[var(--color-border-primary-light)]";

  // Padding classes - Reduced padding
  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-5",
    xl: "p-6",
  };

  // Shadow classes
  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  };

  // Rounded classes
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  // Hover classes
  const hoverClasses = hover
    ? "hover:-translate-y-1 transition-all duration-200"
    : "";

  // Clickable classes
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const cardClasses = cn(
    variantClasses[variant],
    borderColorClass,
    paddingClasses[padding],
    shadowClasses[shadow],
    roundedClasses[rounded],
    hoverClasses,
    clickableClasses,
    className
  );

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = "", ...props }) => (
  <div
    className={cn(
      "border-b border-[var(--color-border-primary-light)] pb-4 mb-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Card Title Component
const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={cn(
      "text-lg font-semibold text-[rgb(var(--color-text-primary))]",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

// Card Description Component
const CardDescription = ({ children, className = "", ...props }) => (
  <p
    className={cn(
      "text-sm text-[rgb(var(--color-text-secondary))] mt-1",
      className
    )}
    {...props}
  >
    {children}
  </p>
);

// Card Body Component
const CardBody = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// Card Footer Component
const CardFooter = ({ children, className = "", ...props }) => (
  <div
    className={cn(
      "border-t border-[var(--color-border-primary-light)] pt-4 mt-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Card Image Component
const CardImage = ({ src, alt, className = "", ...props }) => (
  <div className={cn("overflow-hidden", className)} {...props}>
    <img src={src} alt={alt} className="w-full h-auto object-cover" />
  </div>
);

// Card Actions Component
const CardActions = ({ children, className = "", ...props }) => (
  <div
    className={cn("flex items-center justify-end space-x-2", className)}
    {...props}
  >
    {children}
  </div>
);

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  CardImage,
  CardActions,
};
export default Card;

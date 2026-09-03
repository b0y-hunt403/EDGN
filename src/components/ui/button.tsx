import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: "sm" | "md" | "lg" = "md",
): string {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "border-transparent bg-[#0f6f68] text-white shadow-sm hover:bg-[#0b5f59]",
    secondary:
      "border-transparent bg-[#173b53] text-white shadow-sm hover:bg-[#102f44]",
    outline: "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
    ghost: "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "border-transparent bg-rose-700 text-white shadow-sm hover:bg-rose-800",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6f68]/30 disabled:cursor-not-allowed disabled:opacity-55",
    variants[variant],
    sizes[size],
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonStyles(variant, size), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
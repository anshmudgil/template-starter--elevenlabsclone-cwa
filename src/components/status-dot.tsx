import { cn } from "@/lib/utils";

type Status = "active" | "pending" | "error" | "idle";

const statusClasses: Record<Status, string> = {
  active: "bg-green-500",
  pending: "bg-yellow-500",
  error: "bg-red-500",
  idle: "bg-gray-500",
};

export function StatusDot({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        statusClasses[status],
        status === "active" && "animate-pulse-glow",
        className,
      )}
    />
  );
}

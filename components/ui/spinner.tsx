import * as React from "react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      className={cn("size-4 animate-rotate", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="22 22 44 44"
      role="status"
      aria-label="Loading"
      {...props}
    >
      <circle
        className="animate-dash-circle"
        cx="44"
        cy="44"
        r="20.2"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeDasharray="1,200"
        strokeDashoffset="0"
      />
    </svg>
  );
}

export { Spinner };

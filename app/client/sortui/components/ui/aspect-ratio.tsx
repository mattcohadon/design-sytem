// Stride UI · brand new design system, built on SortUI
import { cn } from "cn"

function AspectRatio({
  ratio,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
          ...style,
        } as React.CSSProperties
      }
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  )
}

export { AspectRatio }

import type React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <Card className={cn("glass-card text-orange-100", className)} {...props}>
      {children}
    </Card>
  )
}

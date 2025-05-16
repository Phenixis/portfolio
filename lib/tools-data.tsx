import { LayoutGrid, Grid2X2 } from "lucide-react"
import type { ReactNode } from "react"

export interface ToolCardProps {
  name: string
  description: string
  icon: ReactNode
  href: string
}

// Move the tools data to a separate file that can be imported by both client and server components
export const tools: ToolCardProps[] = [
  {
    name: "All Tools",
    href: "/my/tools",
    icon: <LayoutGrid className="h-5 w-5" />,
    description: "View all available tools",
  },
  {
    name: "Weighted Multi-Criteria Decision Matrix",
    href: "/my/tools/WMCDM",
    icon: <Grid2X2 className="h-5 w-5" />,
    description: "A decision-making tool that helps evaluate multiple options against various criteria, with each criterion having a different level of importance (weight).",
  },
  // Future tools can be added here following the same structure
]

import {
    Tooltip as TooltipRoot,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Tooltip({
    children,
    tooltip,
    cursor,
}: {
    children: React.ReactNode
    tooltip: string
    cursor?: "cursor-auto" | "cursor-pointer" | "cursor-default" | "cursor-help" | "cursor-wait" | "cursor-not-allowed" 
}) {
    return (
        <TooltipRoot>
            <TooltipTrigger className={`${cursor}`}>{children}</TooltipTrigger>
            <TooltipContent>{tooltip.split("<br/>").map((line) => (
                <div key={line} className="text-sm">
                    {line}
                </div>
            ))}</TooltipContent>
        </TooltipRoot>
    )
}
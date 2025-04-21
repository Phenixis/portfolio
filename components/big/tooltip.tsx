import {
    Tooltip as TooltipRoot,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Tooltip({
    children,
    tooltip,
    cursorPointer,
}: {
    children: React.ReactNode
    tooltip: string
    cursorPointer?: boolean
}) {
    return (
        <TooltipRoot>
            <TooltipTrigger className={`${
                cursorPointer === true ? "cursor-pointer" : (cursorPointer === false ? "cursor-default" : "")
            }`}>{children}</TooltipTrigger>
            <TooltipContent>{tooltip.split("<br/>").map((line) => (
                <div key={line} className="text-sm">
                    {line}
                </div>
            ))}</TooltipContent>
        </TooltipRoot>
    )
}
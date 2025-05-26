import { cn } from "@/lib/utils";
import Tooltip from "./tooltip";
import { HelpCircle } from "lucide-react";

export default function Help({
    message = "",
    size = "base",
    className = "",
} : {
    message?: string;
    size?: "xs" | "sm" | "base" | "lg" | "xl" ;
    className?: string;
}) {
    const sizeClass = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        base: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-7 h-7",
    }[size];

    return (
        <Tooltip tooltip={message} cursor="cursor-auto">
            <HelpCircle className={cn(sizeClass, className)} />
        </Tooltip>
    )
}
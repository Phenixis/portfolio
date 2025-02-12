import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Project({
    name,
    description,
    color,
    link,
    image,
    state
}: {
    name: string,
    description: string,
    color: "green" | "red" | "blue",
    link: string,
    image?: string
    state: "Sold" | "Running" | "Discontinued" | "Building"
}) {
    const colorVariants = {
        "blue": {
            "background": "bg-blue-300/10",
            "image": "bg-blue-300/50",
            "border": "border-blue-300/90"
        },
        "green": {
            "background": "bg-green-300/10",
            "image": "bg-green-300/50",
            "border": "border-green-300/90"
        },
        "red": {
            "background": "bg-red-300/10",
            "image": "bg-red-300/50",
            "border": "border-red-300/90"
        }
    }

    return (
        <div className={`size-full p-4 rounded-md duration-100 selection:${colorVariants[color].image} ${colorVariants[color].background}`}>
            <a href={link} className="block group/link mb-2">
                <AspectRatio ratio={3/1}>
                    <img className={`${colorVariants[color].image} h-full w-full rounded-md duration-100 border-2 ${colorVariants[color].border}`} src={image ? image : link + "/og"} alt={name} />
                </AspectRatio>
            </a>
            <div className="flex justify-between items-center">
                <h3>
                    {name}
                </h3>
                <div className={`text-xs p-1 rounded-md ${colorVariants[color].image}`}>
                    {state}
                </div>
            </div>
            <p className="text-sm">
                {description}
            </p>
        </div>
    )
}
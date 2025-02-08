"use client"

export default function Project({
    name,
    description,
    color,
    link,
    images,
    state
}: {
    name: string,
    description: string,
    color: "green" | "red" | "blue",
    link: string,
    images?: string[]
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
            <a href={link} className="group/link">
                <div className={`${colorVariants[color].image} h-24 w-full mb-2 rounded-md duration-100 group-hover/link:border-2 ${colorVariants[color].border}`} />
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
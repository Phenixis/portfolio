import Link from "next/link"

export const colorVariants = {
    "blue": {
        "background": "bg-blue-300/10 dark:bg-blue-300/20",
        "image": "bg-blue-300/50",
        "border": "border-blue-300/90"
    },
    "green": {
        "background": "bg-green-300/10 dark:bg-green-300/20",
        "image": "bg-green-300/50",
        "border": "border-green-300/90"
    },
    "red": {
        "background": "bg-red-300/10 dark:bg-red-300/20",
        "image": "bg-red-300/50",
        "border": "border-red-300/90"
    },
    "yellow": {
        "background": "bg-yellow-300/10 dark:bg-yellow-300/20",
        "image": "bg-yellow-300/50",
        "border": "border-yellow-300/90"
    },
    "purple": {
        "background": "bg-purple-300/10 dark:bg-purple-300/20",
        "image": "bg-purple-300/50",
        "border": "border-purple-300/90"
    },
    "orange": {
        "background": "bg-orange-300/10 dark:bg-orange-300/20",
        "image": "bg-orange-300/50",
        "border": "border-orange-300/90"
    }
}

export const states = ["Sold", "Running", "Discontinued", "Building", "Built"]

export default function Project({
    name,
    description,
    color,
    state
}: {
    name: string,
    description: string,
    color: keyof typeof colorVariants,
    image?: string
    state: typeof states[number]
}) {
    return (
        <Link href={`/blog/${name}`}>
            <div className={`size-full p-4 rounded-md duration-100 selection:${colorVariants[color].image} ${colorVariants[color].background}`}>
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
        </Link >
    )
}
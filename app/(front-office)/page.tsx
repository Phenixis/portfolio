import BlogPosts from '@/components/big/posts'
import Project, { colorVariants, states } from "@/components/big/project"
import projects from "./projects/projects.json"
import Link from "next/link"

export default function Page() {
    return (
        <section className="page">
            <h1 className="page-title">
                My Portfolio
            </h1>
            <p className="page-description">
                I'm Maxime, a 19 years old french student in computer science. I love building useful applications and websites. I'm learning NextJS since Septembre 2024. You can find all my projects <Link href="/projects" className="duration-300 underline underline-offset-4 decoration-dashed lg:hover:text-black dark:lg:hover:text-white" >here</Link>. I alos write about my projects, my views and my thoughts <Link href="/blog" className="duration-300 underline underline-offset-4 decoration-dashed lg:hover:text-black dark:lg:hover:text-white" >here</Link>.
            </p>
            <h2 className="page-title text-2xl">
                <Link href="/projects" className="duration-300 text-gray-700 dark:text-gray-300 lg:hover:text-black dark:lg:hover:text-white" >
                    My current projects
                </Link>
            </h2>
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(projects).filter(([key, value]) => value.state === "Running").map(([key, value]) => (
                    <Project key={key} name={value.name} description={value.description} color={value.color as keyof typeof colorVariants} state={value.state as typeof states[number]} />
                ))}
            </div>
            <div className="my-8">
                <h2 className="page-title text-2xl">
                    <Link href="/blog" className="duration-300 text-gray-700 dark:text-gray-300  lg:hover:text-black dark:lg:hover:text-white" >
                        My recent blog posts
                    </Link>
                </h2>
                <BlogPosts />
            </div>
        </section>
    )
}

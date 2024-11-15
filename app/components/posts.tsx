import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export default function BlogPosts() {
    let allBlogs = getBlogPosts()

    return (
        <div>
            {allBlogs
                .sort((a, b) => {
                    if (
                        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
                    ) {
                        return -1
                    }
                    return 1
                })
                .map((post) => (
                    <Link
                        key={post.slug}
                        className="flex flex-col space-y-1 mb-4 p-1 rounded border border-neutral-200 md:border-transparent hover:border-neutral-200 dark:hover:border-neutral-500 "
                        href={`/blog/${post.slug}`}
                    >
                        <div className="w-full flex flex-col md:items-center md:flex-row space-x-0 md:space-x-2">
                            <p className="text-neutral-600 dark:text-neutral-400 w-full md:w-[100px] tabular-nums">
                                {formatDate(post.metadata.publishedAt, false)}
                            </p>
                            <div>
                                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                                    {post.metadata.title}
                                </p>
                                <p className="text-neutral-500 dark:text-neutral-400 tracking-tight">
                                    {post.metadata.summary}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
        </div>
    )
}

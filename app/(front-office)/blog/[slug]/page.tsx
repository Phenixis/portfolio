import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/big/mdx'
import { formatDate, getBlogPosts } from '@/app/(front-office)/blog/utils'
import { baseUrl } from 'app/sitemap'

export async function generateStaticParams() {
	const posts = getBlogPosts(true)

	return posts.map((post) => ({
		slug: post.slug,
	}))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const post = getBlogPosts(true).find((post) => post.slug === params.slug)
	if (!post) {
		return
	}

	const {
		title,
		publishedAt: publishedTime,
		summary: description,
		image,
	} = post.metadata
	const ogImage = image
		? image
		: `${baseUrl}/og?title=${encodeURIComponent(title)}`

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime,
			url: `${baseUrl}/blog/${post.slug}`,
			images: [
				{
					url: ogImage,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	}
}

export default async function Blog(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const post = getBlogPosts(true).find((post) => post.slug === params.slug)

	if (!post) {
		notFound()
	}

	return (
		<section className='page'>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: post.metadata.title,
						datePublished: post.metadata.publishedAt,
						dateModified: post.metadata.publishedAt,
						description: post.metadata.summary,
						image: post.metadata.image
							? `${baseUrl}${post.metadata.image}`
							: `/og?title=${encodeURIComponent(post.metadata.title)}`,
						url: `${baseUrl}/blog/${post.slug}`,
						author: {
							'@type': 'Person',
							name: 'Maxime Duhamel',
						},
					}),
				}}
			/>
			<h1 className="page-title">
				{post.metadata.title}
			</h1>
			<div className="flex flex-col md:flex-row justify-between md:items-center mt-2 mb-8 text-sm">
				<p className="text-sm text-neutral-600 dark:text-neutral-400 basis-1/6">
					{formatDate(post.metadata.publishedAt)}
				</p>
				<p className="text-sm text-neutral-500 dark:text-neutral-400 basis-5/6">
					{post.metadata.summary}
				</p>
			</div>
			<article className="prose font-serif text-lg max-w-full">
				<CustomMDX source={post.content} />
			</article>
			<footer>
				<p className="text-sm text-neutral-500 dark:text-neutral-400">
					Best Regards,<br />
					Maxime Duhamel
				</p>
			</footer>
		</section>
	)
}

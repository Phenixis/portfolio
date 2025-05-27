import BlogPosts from '@/components/big/posts'
import Logo from '@/components/big/logo'

export const metadata = {
	title: 'Blog',
	description: 'A blog where I write about my projects, my views and my thoughts.',
}

export default function Page() {
	return (
		<section className="page">
			<h1 className="page-title">
				My Blog
			</h1>
			<div className="page-description">
				<p>
					This blog is a curated list of thoughts, ideas, and projects from my Second Brain. This blog has multiple purposes:
				</p>
				<ul className="list-decorated">
					<li className="group/Logo">
						<Logo />
						<p>
							to make me write regularly
						</p>
					</li>
					<li className="group/Logo">
						<Logo />
						<p>
							to start conversations about topics I&apos;m interested in
						</p>
					</li>
					<li className="group/Logo">
						<Logo />
						<p>
							and to build a public archive of my thoughts
						</p>
					</li>
				</ul>
			</div>
			<BlogPosts limit={0} />
		</section>
	)
}

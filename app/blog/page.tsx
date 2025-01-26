import BlogPosts from '@/components/big/posts'
import Logo from '@/components/big/logo'

export const metadata = {
	title: 'Blog',
	description: 'Read my blog.',
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
					<li className="group">
						<Logo />
						<p>
							to make me write regularly

						</p>
					</li>
					<li className="group">
						<Logo />
						<p>
							to start conversations about topics I'm interested in
						</p>
					</li>
					<li className="group">
						<Logo />
						<p>
							and to build a public archive of my thoughts
						</p>
					</li>
				</ul>
			</div>
			<BlogPosts />
		</section>
	)
}

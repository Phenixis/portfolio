import BlogPosts from 'app/components/posts'
import Image from 'next/image'
import * as ListIconLight from 'public/listIconLight.png';
import * as ListIconDark from 'public/listIconDark.png';

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
					<li>
						<div>
							<Image src={ListIconLight} width={16} height={16} alt="list-style" className="dark:hidden" />
							<Image src={ListIconDark} width={16} height={16} alt="list-style" className="hidden dark:block" />
						</div>
						<p>
							to make me write regularly

						</p>
					</li>
					<li>
						<div>
							<Image src={ListIconLight} width={16} height={16} alt="list-style" className="dark:hidden" />
							<Image src={ListIconDark} width={16} height={16} alt="list-style" className="hidden dark:block" />
						</div>
						<p>
							to start conversations about topics I'm interested in
						</p>
					</li>
					<li>
						<div>
							<Image src={ListIconLight} width={16} height={16} alt="list-style" className="dark:hidden" />
							<Image src={ListIconDark} width={16} height={16} alt="list-style" className="hidden dark:block" />
						</div>
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

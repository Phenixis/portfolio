import LifeElapsed from '@/components/big/lifeElapsed'
import BlogPosts from '@/components/big/posts'

export default function Page() {
  return (
    <section className="page">
      <h1 className="page-title">
        My Portfolio
      </h1>
      <p className="page-description">
        I'm Maxime, a 19 years old french student in computer science. I love building useful applications and websites. I'm currently learning React, Next.js and Tailwindcss by building <a href="https://boilerpalte.maximeduhamel.com" target='_blank' className="underline underline-offset-4 decoration-dashed hover:text-black dark:hover:text-white" >Boilerplate.md</a>, the best open-source NextJS boilerplate.
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
      <LifeElapsed />
    </section>
  )
}

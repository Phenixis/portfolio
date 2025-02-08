import BlogPosts from '@/components/big/posts'

export default function Page() {
  return (
    <section className="page">
      <h1 className="page-title">
        My Portfolio
      </h1>
      <p className="page-description">
        I'm Maxime, a 19 years old french student in computer science. I love building useful applications and websites. I'm currently learning React, Next.js and Tailwindcss by building <a href="https://www.wisecart.app" target='_blank' className="underline decoration-dashed hover:text-black dark:hover:text-white" >WiseCart</a>, a shopping list builder using a meal-oriented approach.
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}

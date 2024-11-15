import BlogPosts from 'app/components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4 text-justify text-neutral-600 dark:text-neutral-300 leading-[1.8]">
        I'm Maxime, a 19 years old french student in computer science. I love building useful applications and websites. I'm currently learning React, Next.js and Tailwindcss by building <a href="https://www.wisecart.app" target='_blank' className="underline decoration-dashed hover:text-black dark:hover:text-white" >WiseCart</a>, a shopping list builder using a meal-oriented approach.
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}

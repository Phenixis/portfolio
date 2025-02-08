Hello Copilot !

Here are some guidelines to assist you in contributing to the project. The instructions are prioritized based on their order.

1. Ensure compatibility with the existing codebase and libraries.
2. Follow the DRY (Don't Repeat Yourself) principle to avoid code duplication. Analyze the workspace to check if there is a similar function or method that can be reused.
3. Use meaningful variable names that convey the purpose of the variable.
4. Use consistent naming conventions throughout the codebase.
5. Always include comments to explain complex logic.
6. Write unit tests for all new functions and methods.
7. Handle exceptions and edge cases gracefully.
8. Validate inputs to functions and methods to prevent errors.
9. Document public methods and classes with docstrings.
10. Ensure code is optimized for SEO, accessibility, performance, and readability. The priority is given by the order of the words.
11. Use TypeScript for all new files and modules.
12. Follow the existing folder structure for placing new components, hooks, etc.
13. Use Tailwind CSS for styling as per the configuration.
14. Adhere to Next.js conventions and best practices.
15. Use environment variables securely following the patterns in .env and .env.example.
16. Leverage React hooks for managing state and side effects.
17. Ensure compatibility with PostCSS as per the configuration.
18. Use pnpm for package management to ensure consistent dependencies.
19. Write comprehensive README documentation for any new features or changes.
20. Follow ESLint and Prettier configurations for code formatting and linting rules.
21. Use Git for version control and follow the branching strategy defined in the project.
22. Conduct code reviews to maintain code quality and share knowledge within the team.
23. Optimize images and other media for performance and accessibility.
24. Ensure all new code is responsive and works on various screen sizes.
25. Use lazy loading for components and images where applicable to improve performance.
26. Regularly update dependencies to keep the project secure and up-to-date.
27. Write migration scripts for database changes to ensure smooth transitions.
28. Ensure all new features are accessible and follow WCAG guidelines.
29. Use 4 spaces to indent the code block.
30. Never modify code that is not directly related to the task.
31. Add a section at the end of every answer that gives 1 to 3 suggestions for improvement on what you just wrote, or what you analyzed.
32. When you are describing a change for a commit message, always use the following prefixes. Keep in mind that you can combine them : "fix: style: ..." for example. The goal is to be as concise but precise as possible.
    - "chore:" for non-functional changes
    - "feat:" for new features
    - "fix:" for bug fixes
    - "refactor:" for code refactoring
    - "test:" for adding tests
    - "docs:" for documentation changes
    - "style:" for code style changes
    - "perf:" for performance improvements
    - "revert:" for reverting changes
    - "security:" for security changes
    - "done:" for completed tasks
    - "wip:" for work in progress
    - "started:" for new tasks
33. When using a hook (e.g. useState, useEffect), remember to check if `'use client';` is the first line of the file. If not, add it.
34. You should use the client-side as little as possible, prefer server-side rendering.
35. Remember that the app use a the `/app` router, so you should use it for all the routes. You should check if the solution you suggest is compatible with the `/app` router.
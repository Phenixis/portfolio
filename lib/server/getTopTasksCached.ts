// lib/server/getTopTasksCached.ts
import { unstable_cache } from "next/cache"
import { getUncompletedTasks } from "@/lib/db/queries"

export const getTop5UncompletedTasksCached = unstable_cache(
  async (userId: string) => {
    return await getUncompletedTasks(userId, "score", "desc", 5)
  },
  ["top5-uncompleted-tasks"], // cache key
  {
    revalidate: 60, // seconds
    tags: ["tasks"]
  }
)

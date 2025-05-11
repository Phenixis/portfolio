import * as Drizzle from "drizzle-orm";
import * as Schema from "../schema";
import { db } from "../drizzle";
import { revalidatePath } from "next/cache";

export async function createDailyMood(
    userId: string,
    mood: number,
    date: Date,
    comment: string
): Promise<Schema.DailyMood> {
    const moodExists = await getDailyMood(userId, date);

    if (moodExists) {
        throw new Error("Mood already exists for this date");
    }

    const dailyMood = await db
        .insert(Schema.dailyMood)
        .values({
            user_id: userId,
            mood: mood,
            comment: comment,
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        })
        .returning()

    revalidatePath("/mood");

    return dailyMood[0];
}

export async function getDailyMoods(
    userId: string,
    startDate: Date,
    endDate: Date
): Promise<Schema.DailyMood[]> {
    const dailyMood = await db
        .select()
        .from(Schema.dailyMood)
        .where(
            Drizzle.and(
                Drizzle.eq(Schema.dailyMood.user_id, userId),
                Drizzle.isNull(Schema.dailyMood.deleted_at),
                Drizzle.gte(Schema.dailyMood.date, new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())),
                Drizzle.lte(Schema.dailyMood.date, new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())),
            )
        )
        .orderBy(Drizzle.desc(Schema.dailyMood.date))

    revalidatePath("/my");

    if (!dailyMood || dailyMood.length === 0) {
        throw new Error("No mood found for this period");
    }

    return dailyMood;
}

export async function getDailyMood(
    userId: string,
    date: Date
): Promise<Schema.DailyMood | null> {
    let dailyMood: Schema.DailyMood[]

    try {
        dailyMood = await getDailyMoods(
            userId,
            new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        );
    } catch (error) {
        throw new Error("No mood found for this date");
    }

    return (dailyMood && dailyMood.length > 0) ? dailyMood[0] : null;
}

export async function updateDailyMood(
    userId: string,
    mood: number,
    date: Date,
    comment: string
): Promise<Schema.DailyMood> {
    const dailyMood = await db
        .update(Schema.dailyMood)
        .set({
            mood: mood,
            updated_at: new Date(),
            comment: comment,
        })
        .where(
            Drizzle.and(
                Drizzle.eq(Schema.dailyMood.user_id, userId),
                Drizzle.isNull(Schema.dailyMood.deleted_at),
                Drizzle.eq(Schema.dailyMood.date, new Date(date.getFullYear(), date.getMonth(), date.getDate()))
            )
        )
        .returning()

    revalidatePath("/my");

    return dailyMood[0];
}

export async function deleteDailyMood(
    userId: string,
    date: Date
): Promise<Schema.DailyMood> {
    const dailyMood = await db
        .update(Schema.dailyMood)
        .set({
            deleted_at: new Date(),
        })
        .where(
            Drizzle.and(
                Drizzle.eq(Schema.dailyMood.user_id, userId),
                Drizzle.isNull(Schema.dailyMood.deleted_at),
                Drizzle.eq(Schema.dailyMood.date, new Date(date.getFullYear(), date.getMonth(), date.getDate()))
            )
        )
        .returning()

    revalidatePath("/my");

    return dailyMood[0];
}
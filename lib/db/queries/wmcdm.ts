"use server"

import {
    desc,
    eq,
    isNull,
    and,
    asc
} from "drizzle-orm"
import { db } from "../drizzle"
import * as Schema from "../schema"
import { revalidatePath } from "next/cache"

export type WmcdmMatrixWithRelations = Schema.WmcdmMatrix & {
    criteria: (Schema.WmcdmCriterion & {
        scores: Schema.WmcdmScore[]
    })[]
    options: (Schema.WmcdmOption & {
        scores: Schema.WmcdmScore[]
    })[]
}

// ## Matrix Operations

export async function createWmcdmMatrix(
    userId: string,
    name: string,
    description?: string
): Promise<number> {
    const result = await db
        .insert(Schema.wmcdmMatrix)
        .values({
            user_id: userId,
            name: name,
            description: description,
        })
        .returning({ id: Schema.wmcdmMatrix.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result[0].id
}

export async function getWmcdmMatrices(userId: string): Promise<Schema.WmcdmMatrix[]> {
    return await db
        .select()
        .from(Schema.wmcdmMatrix)
        .where(and(
            eq(Schema.wmcdmMatrix.user_id, userId),
            isNull(Schema.wmcdmMatrix.deleted_at)
        ))
        .orderBy(desc(Schema.wmcdmMatrix.updated_at))
}

export async function getWmcdmMatrixById(
    userId: string,
    matrixId: number
): Promise<WmcdmMatrixWithRelations | null> {
    // Get the matrix
    const matrix = await db
        .select()
        .from(Schema.wmcdmMatrix)
        .where(and(
            eq(Schema.wmcdmMatrix.id, matrixId),
            eq(Schema.wmcdmMatrix.user_id, userId),
            isNull(Schema.wmcdmMatrix.deleted_at)
        ))
        .limit(1)

    if (!matrix || matrix.length === 0) {
        return null
    }

    // Get criteria
    const criteria = await db
        .select()
        .from(Schema.wmcdmCriterion)
        .where(and(
            eq(Schema.wmcdmCriterion.matrix_id, matrixId),
            isNull(Schema.wmcdmCriterion.deleted_at)
        ))
        .orderBy(asc(Schema.wmcdmCriterion.position))

    // Get options
    const options = await db
        .select()
        .from(Schema.wmcdmOption)
        .where(and(
            eq(Schema.wmcdmOption.matrix_id, matrixId),
            isNull(Schema.wmcdmOption.deleted_at)
        ))
        .orderBy(asc(Schema.wmcdmOption.position))

    // Get scores
    const scores = await db
        .select()
        .from(Schema.wmcdmScore)
        .where(eq(Schema.wmcdmScore.matrix_id, matrixId))

    // Group scores by criterion and option
    const criteriaWithScores = criteria.map(criterion => ({
        ...criterion,
        scores: scores.filter(score => score.criterion_id === criterion.id)
    }))

    const optionsWithScores = options.map(option => ({
        ...option,
        scores: scores.filter(score => score.option_id === option.id)
    }))

    return {
        ...matrix[0],
        criteria: criteriaWithScores,
        options: optionsWithScores
    }
}

export async function updateWmcdmMatrix(
    userId: string,
    matrixId: number,
    name: string,
    description?: string
): Promise<boolean> {
    const result = await db
        .update(Schema.wmcdmMatrix)
        .set({
            name: name,
            description: description,
            updated_at: new Date(),
        })
        .where(and(
            eq(Schema.wmcdmMatrix.id, matrixId),
            eq(Schema.wmcdmMatrix.user_id, userId),
            isNull(Schema.wmcdmMatrix.deleted_at)
        ))
        .returning({ id: Schema.wmcdmMatrix.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result.length > 0
}

export async function deleteWmcdmMatrix(
    userId: string,
    matrixId: number
): Promise<boolean> {
    const result = await db
        .update(Schema.wmcdmMatrix)
        .set({
            deleted_at: new Date(),
        })
        .where(and(
            eq(Schema.wmcdmMatrix.id, matrixId),
            eq(Schema.wmcdmMatrix.user_id, userId),
            isNull(Schema.wmcdmMatrix.deleted_at)
        ))
        .returning({ id: Schema.wmcdmMatrix.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result.length > 0
}

// ## Criterion Operations

export async function createWmcdmCriterion(
    matrixId: number,
    name: string,
    weight: number,
    description?: string
): Promise<number> {
    // Get the next position
    const maxPosition = await db
        .select({ max: Schema.wmcdmCriterion.position })
        .from(Schema.wmcdmCriterion)
        .where(and(
            eq(Schema.wmcdmCriterion.matrix_id, matrixId),
            isNull(Schema.wmcdmCriterion.deleted_at)
        ))

    const position = (maxPosition[0]?.max || 0) + 1

    const result = await db
        .insert(Schema.wmcdmCriterion)
        .values({
            matrix_id: matrixId,
            name: name,
            weight: weight,
            description: description,
            position: position,
        })
        .returning({ id: Schema.wmcdmCriterion.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result[0].id
}

export async function updateWmcdmCriterion(
    criterionId: number,
    name: string,
    weight: number,
    description?: string
): Promise<boolean> {
    const result = await db
        .update(Schema.wmcdmCriterion)
        .set({
            name: name,
            weight: weight,
            description: description,
            updated_at: new Date(),
        })
        .where(and(
            eq(Schema.wmcdmCriterion.id, criterionId),
            isNull(Schema.wmcdmCriterion.deleted_at)
        ))
        .returning({ id: Schema.wmcdmCriterion.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result.length > 0
}

export async function deleteWmcdmCriterion(criterionId: number): Promise<boolean> {
    const result = await db
        .update(Schema.wmcdmCriterion)
        .set({
            deleted_at: new Date(),
        })
        .where(and(
            eq(Schema.wmcdmCriterion.id, criterionId),
            isNull(Schema.wmcdmCriterion.deleted_at)
        ))
        .returning({ id: Schema.wmcdmCriterion.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result.length > 0
}

// ## Option Operations

export async function createWmcdmOption(
    matrixId: number,
    name: string
): Promise<number> {
    // Get the next position
    const maxPosition = await db
        .select({ max: Schema.wmcdmOption.position })
        .from(Schema.wmcdmOption)
        .where(and(
            eq(Schema.wmcdmOption.matrix_id, matrixId),
            isNull(Schema.wmcdmOption.deleted_at)
        ))

    const position = (maxPosition[0]?.max || 0) + 1

    const result = await db
        .insert(Schema.wmcdmOption)
        .values({
            matrix_id: matrixId,
            name: name,
            position: position,
        })
        .returning({ id: Schema.wmcdmOption.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result[0].id
}

export async function updateWmcdmOption(
    optionId: number,
    name: string
): Promise<boolean> {
    const result = await db
        .update(Schema.wmcdmOption)
        .set({
            name: name,
            updated_at: new Date(),
        })
        .where(and(
            eq(Schema.wmcdmOption.id, optionId),
            isNull(Schema.wmcdmOption.deleted_at)
        ))
        .returning({ id: Schema.wmcdmOption.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result.length > 0
}

export async function deleteWmcdmOption(optionId: number): Promise<boolean> {
    const result = await db
        .update(Schema.wmcdmOption)
        .set({
            deleted_at: new Date(),
        })
        .where(and(
            eq(Schema.wmcdmOption.id, optionId),
            isNull(Schema.wmcdmOption.deleted_at)
        ))
        .returning({ id: Schema.wmcdmOption.id })

    revalidatePath("/my/tools/WMCDM", "layout")

    return result.length > 0
}

// ## Score Operations

export async function updateWmcdmScore(
    matrixId: number,
    optionId: number,
    criterionId: number,
    score: number
): Promise<boolean> {
    // First try to update existing score
    const updateResult = await db
        .update(Schema.wmcdmScore)
        .set({
            score: score,
            updated_at: new Date(),
        })
        .where(and(
            eq(Schema.wmcdmScore.matrix_id, matrixId),
            eq(Schema.wmcdmScore.option_id, optionId),
            eq(Schema.wmcdmScore.criterion_id, criterionId)
        ))
        .returning({ id: Schema.wmcdmScore.id })

    // If no existing score, create a new one
    if (updateResult.length === 0) {
        await db
            .insert(Schema.wmcdmScore)
            .values({
                matrix_id: matrixId,
                option_id: optionId,
                criterion_id: criterionId,
                score: score,
            })
    }

    revalidatePath("/my/tools/WMCDM", "layout")

    return true
}

export async function createDefaultScoresForNewCriterion(
    matrixId: number,
    criterionId: number
): Promise<void> {
    // Get all options for this matrix
    const options = await db
        .select()
        .from(Schema.wmcdmOption)
        .where(and(
            eq(Schema.wmcdmOption.matrix_id, matrixId),
            isNull(Schema.wmcdmOption.deleted_at)
        ))

    // Create default scores (0) for each option
    const scoreValues = options.map(option => ({
        matrix_id: matrixId,
        option_id: option.id,
        criterion_id: criterionId,
        score: 0,
    }))

    if (scoreValues.length > 0) {
        await db.insert(Schema.wmcdmScore).values(scoreValues)
    }

    revalidatePath("/my/tools/WMCDM", "layout")
}

export async function createDefaultScoresForNewOption(
    matrixId: number,
    optionId: number
): Promise<void> {
    // Get all criteria for this matrix
    const criteria = await db
        .select()
        .from(Schema.wmcdmCriterion)
        .where(and(
            eq(Schema.wmcdmCriterion.matrix_id, matrixId),
            isNull(Schema.wmcdmCriterion.deleted_at)
        ))

    // Create default scores (0) for each criterion
    const scoreValues = criteria.map(criterion => ({
        matrix_id: matrixId,
        option_id: optionId,
        criterion_id: criterion.id,
        score: 0,
    }))

    if (scoreValues.length > 0) {
        await db.insert(Schema.wmcdmScore).values(scoreValues)
    }

    revalidatePath("/my/tools/WMCDM", "layout")
}

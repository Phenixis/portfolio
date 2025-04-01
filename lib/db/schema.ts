import {
    pgTable,
    serial,
    varchar,
    text,
    timestamp,
    integer,
    boolean,
    foreignKey
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Table Project
export const project = pgTable('project', {
    title: varchar('title', { length: 255 }).primaryKey(),
    description: text('description'),
    completed: boolean('completed').notNull().default(false),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

// Table Todo
export const todo = pgTable('todo', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    importance: integer('importance').notNull().default(0),
    urgency: integer('urgency').notNull().default(0),
    duration: integer('duration').notNull().default(0),
    score: integer('score').notNull().default(0),
    due: timestamp('due').notNull().defaultNow(),
    project_title: varchar('project_title', { length: 255 }).references(() => project.title),
    completed_at: timestamp('completed_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

// Table Meteo
export const meteo = pgTable('meteo', {
    day: varchar('day', { length: 10 }).primaryKey(),
    temperature: integer('temperature').notNull(),
    summary: varchar('summary', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

// Table Exercice
export const exercice = pgTable('exercice', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Séance (Modèle de Workout)
export const seance = pgTable('seance', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Séance_Exercice (Exercices d'un modèle de séance)
export const seanceExercice = pgTable('seance_exercice', {
    id: serial('id').primaryKey(),
    seance_id: integer('seance_id').references(() => seance.id).notNull(),
    exercice_id: integer('exercice_id').references(() => exercice.id).notNull(),
    position: integer('position').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Workout (Séance Réelle)
export const workout = pgTable('workout', {
    id: serial('id').primaryKey(),
    date: timestamp('date').notNull().defaultNow(),
    note: integer('note'),
    seance_id: integer('seance_id').references(() => seance.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Workout_Exercice (Exercices réellement faits dans un workout)
export const workoutExercice = pgTable('workout_exercice', {
    id: serial('id').primaryKey(),
    workout_id: integer('workout_id').references(() => workout.id).notNull(),
    exercice_id: integer('exercice_id').references(() => exercice.id).notNull(),
    position: integer('position').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Série (Séries des exercices du workout)
export const serie = pgTable('serie', {
    id: serial('id').primaryKey(),
    workout_id: integer('workout_id').references(() => workout.id).notNull(),
    exercice_id: integer('exercice_id').references(() => exercice.id).notNull(),
    poids: integer('poids'),
    reps: integer('reps'),
    exercice_position: integer('exercice_position').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Relations
export const projectRelations = relations(project, ({ many }) => ({
    todos: many(todo)
}));

export const todoRelations = relations(todo, ({ one }) => ({
    project: one(project, {
        fields: [todo.project_title],
        references: [project.title]
    })
}));

export const seanceRelations = relations(seance, ({ many }) => ({
    exercices: many(seanceExercice)
}));

export const workoutRelations = relations(workout, ({ many, one }) => ({
    exercices: many(workoutExercice),
    seance: one(seance, {
        fields: [workout.seance_id],
        references: [seance.id]
    })
}));

export const exerciceRelations = relations(exercice, ({ many }) => ({
    seance_exercices: many(seanceExercice),
    workout_exercices: many(workoutExercice),
    series: many(serie)
}));

export const workoutExerciceRelations = relations(workoutExercice, ({ one, many }) => ({
    workout: one(workout, {
        fields: [workoutExercice.workout_id],
        references: [workout.id]
    }),
    exercice: one(exercice, {
        fields: [workoutExercice.exercice_id],
        references: [exercice.id]
    }),
    series: many(serie)
}));

export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;
export type Meteo = typeof meteo.$inferSelect;
export type NewMeteo = typeof meteo.$inferInsert;
export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
export type Exercice = typeof exercice.$inferSelect;
export type NewExercice = typeof exercice.$inferInsert;
export type Seance = typeof seance.$inferSelect;
export type NewSeance = typeof seance.$inferInsert;
export type SeanceExercice = typeof seanceExercice.$inferSelect;
export type NewSeanceExercice = typeof seanceExercice.$inferInsert;
export type Workout = typeof workout.$inferSelect;
export type NewWorkout = typeof workout.$inferInsert;
export type WorkoutExercice = typeof workoutExercice.$inferSelect;
export type NewWorkoutExercice = typeof workoutExercice.$inferInsert;
export type Serie = typeof serie.$inferSelect;
export type NewSerie = typeof serie.$inferInsert;
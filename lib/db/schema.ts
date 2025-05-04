import {
    pgTable,
    serial,
    char,
    varchar,
    text,
    timestamp,
    integer,
    boolean,
    foreignKey
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
    id: char('id', { length: 8 }).primaryKey().notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    first_name: varchar('first_name', { length: 255 }).notNull(),
    last_name: varchar('last_name', { length: 255 }).notNull(),
    api_key: varchar('api_key', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

export const importance = pgTable('importance', {
    level: integer("level").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
})

export const duration = pgTable('duration', {
    level: integer("level").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
})

// Table Project
export const project = pgTable('project', {
    user_id: char('user_id', { length: 8 }).default("00000000").notNull()
        .references(() => user.id),
    title: varchar('title', { length: 255 }).primaryKey(),
    description: text('description'),
    completed: boolean('completed').notNull().default(false),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});

// Table Task
export const task = pgTable('task', {
    user_id: char('user_id', { length: 8 }).default("00000000").notNull()
        .references(() => user.id),
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    importance: integer('importance')
        .notNull()
        .default(0)
        .references(() => importance.level),
    urgency: integer('urgency').notNull().default(0),
    duration: integer('duration')
        .notNull()
        .default(0)
        .references(() => duration.level),
    score: integer('score').notNull().default(0),
    due: timestamp('due').notNull().defaultNow(),
    project_title: varchar('project_title', { length: 255 })
        .references(() => project.title),
    completed_at: timestamp('completed_at'),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// This table is used to manage the tasks that need to be done after a specific task
// So, after_task_id has to be done before task_id
export const taskToDoAfter = pgTable('task_to_do_after', {
    id: serial('id').primaryKey(),
    task_id: integer('task_id')
        .notNull()
        .references(() => task.id),
    after_task_id: integer('after_task_id')
        .notNull()
        .references(() => task.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});


// Table Meteo
export const meteo = pgTable('meteo', {
    user_id: char('user_id', { length: 8 }).default("00000000").notNull()
        .references(() => user.id),
    day: varchar('day', { length: 10 }).primaryKey(),
    latitude: varchar('latitude', { length: 10 }).default("-1").notNull(),
    longitude: varchar('longitude', { length: 10 }).default("-1").notNull(),
    temperature: integer('temperature').notNull(),
    summary: varchar('summary', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at')
});


// Workouts

// Table Exercice
export const exercice = pgTable('exercice', {
    user_id: char('user_id', { length: 8 }).default("00000000").notNull()
        .references(() => user.id),
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Séance (Modèle de Workout)
export const seance = pgTable('seance', {
    user_id: char('user_id', { length: 8 }).default("00000000").notNull()
        .references(() => user.id),
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
    nb_series: integer('nb_series').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Workout (Séance Réelle)
export const workout = pgTable('workout', {
    user_id: char('user_id', { length: 8 }).default("00000000").notNull()
        .references(() => user.id),
    id: serial('id').primaryKey(),
    date: timestamp('date').notNull().defaultNow(),
    note: integer('note'),
    comment: text('comment'),
    seance_id: integer('seance_id').references(() => seance.id),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Series_Group (Groupe de séries pour super-set, etc.)
export const seriesGroup = pgTable('series_group', {
    id: serial('id').primaryKey(),
    workout_id: integer('workout_id').references(() => workout.id).notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Table Série (Séries des exercices du workout)
export const serie = pgTable('serie', {
    user_id: char('user_id', { length: 8 }).default("00000000").notNull()
        .references(() => user.id),
    id: serial('id').primaryKey(),
    series_group_id: integer('series_group_id').references(() => seriesGroup.id).notNull(),
    exercice_id: integer('exercice_id').references(() => exercice.id).notNull(),
    poids: integer('poids'),
    reps: integer('reps'),
    exercice_position: integer('exercice_position').notNull(), // Premier, second, etc. exercice de la séance
    serie_position: integer('serie_position').notNull(), // Première, seconde, etc. série de l'exercice
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

export const clipboard = pgTable('clipboard', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    password: varchar('password', { length: 255 }), // if password is set, the clipboard is encrypted
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
    deleted_at: timestamp('deleted_at'),
});

// Relations
export const projectRelations = relations(project, ({ one, many }) => ({
    tasks: many(task),
    user: one(user, {
        fields: [project.user_id],
        references: [user.id]
    })
}));

export const taskRelations = relations(task, ({ one, many }) => ({
    project: one(project, {
        fields: [task.project_title],
        references: [project.title]
    }),
    taskAfter: many(taskToDoAfter),
    taskBefore: many(taskToDoAfter),
    user: one(user, {
        fields: [task.user_id],
        references: [user.id]
    })
}));

export const taskToDoAfterRelations = relations(taskToDoAfter, ({ many }) => ({
    tasks: many(task)
}));

export const seanceRelations = relations(seance, ({ one, many }) => ({
    exercices: many(seanceExercice),
    user: one(user, {
        fields: [seance.user_id],
        references: [user.id]
    })
}));

export const seanceExerciceRelations = relations(seanceExercice, ({ one }) => ({
    seance: one(seance, {
        fields: [seanceExercice.seance_id],
        references: [seance.id]
    }),
    exercice: one(exercice, {
        fields: [seanceExercice.exercice_id],
        references: [exercice.id]
    })
}));

export const workoutRelations = relations(workout, ({ one, many }) => ({
    seance: one(seance, {
        fields: [workout.seance_id],
        references: [seance.id]
    }),
    seriesGroup: many(seriesGroup),
}));

export const seriesGroupRelations = relations(seriesGroup, ({ one, many }) => ({
    workout: one(workout, {
        fields: [seriesGroup.workout_id],
        references: [workout.id]
    }),
    series: many(serie)
}));

export const serieRelations = relations(serie, ({ one }) => ({
    exercice: one(exercice, {
        fields: [serie.exercice_id],
        references: [exercice.id]
    }),
    seriesGroup: one(seriesGroup, {
        fields: [serie.series_group_id],
        references: [seriesGroup.id]
    }),
    user: one(user, {
        fields: [serie.user_id],
        references: [user.id]
    })
}));

export const workoutExerciceRelations = relations(workout, ({ many }) => ({
    exercices: many(serie)
}));

export const exerciceRelations = relations(exercice, ({ one, many }) => ({
    seanceExercices: many(seanceExercice),
    series: many(serie),
    user: one(user, {
        fields: [exercice.user_id],
        references: [user.id]
    })
}));


export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Task = typeof task.$inferSelect;
export type NewTask = typeof task.$inferInsert;
export type TaskWithNonRecursiveRelations = Task & { project: Project | null; importanceDetails: Importance; durationDetails: Duration; tasksToDoAfter: TaskToDoAfter[] | null, tasksToDoBefore: TaskToDoAfter[] | null, recursive: false };
export type TaskWithRelations = Task & { project: Project | null; importanceDetails: Importance; durationDetails: Duration; tasksToDoAfter: TaskWithNonRecursiveRelations[] | null, tasksToDoBefore: TaskWithNonRecursiveRelations[] | null, recursive: true };
export type TaskToDoAfter = typeof taskToDoAfter.$inferSelect;
export type NewTaskToDoAfter = typeof taskToDoAfter.$inferInsert;
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
export type SeriesGroup = typeof seriesGroup.$inferSelect;
export type NewSeriesGroup = typeof seriesGroup.$inferInsert;
export type Serie = typeof serie.$inferSelect;
export type NewSerie = typeof serie.$inferInsert;
export type Importance = typeof importance.$inferSelect;
export type NewImportance = typeof importance.$inferInsert;
export type Duration = typeof duration.$inferSelect;
export type NewDuration = typeof duration.$inferInsert;

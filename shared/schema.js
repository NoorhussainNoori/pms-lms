import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  decimal,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
// Converted from TypeScript enum to a plain JavaScript object
export const UserRole = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
  PROJECT_MANAGER: "project_manager",
  EMPLOYEE: "employee",
  FINANCE: "finance",
};

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  // Removed TypeScript type assertion .$type<UserRole>()
  role: text("role").notNull(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fee: decimal("fee", { precision: 10, scale: 2 }).notNull(),
  instructorId: integer("instructor_id").references(() => users.id),
});

// Course content table
export const courseContents = pgTable("course_contents", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id)
    .notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'video' or 'pdf'
  content: text("content").notNull(), // YouTube URL or PDF content
  order: integer("order").notNull(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .references(() => users.id)
    .notNull(),
  courseId: integer("course_id")
    .references(() => courses.id)
    .notNull(),
  enrollmentDate: timestamp("enrollment_date").notNull().defaultNow(),
  paymentStatus: text("payment_status").notNull(), // 'completed', 'pending', 'partial'
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
});

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id)
    .notNull(),
  title: text("title").notNull(),
  contentId: integer("content_id").references(() => courseContents.id),
});

// Quiz questions table
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .references(() => quizzes.id)
    .notNull(),
  question: text("question").notNull(),
  type: text("type").notNull(), // 'multiple-choice', 'true-false', 'fill-in-blank'
  options: text("options"), // JSON string of options for multiple choice
  correctAnswer: text("correct_answer").notNull(),
  order: integer("order").notNull(),
});

// Quiz results table
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .references(() => quizzes.id)
    .notNull(),
  studentId: integer("student_id")
    .references(() => users.id)
    .notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).notNull(),
  dateTaken: timestamp("date_taken").notNull().defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id")
    .references(() => courseContents.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  comment: text("comment").notNull(),
  datePosted: timestamp("date_posted").notNull().defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  clientId: integer("client_id").references(() => clients.id),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").notNull(), // 'active', 'completed', 'on-hold'
  managerId: integer("manager_id").references(() => users.id),
});

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  industry: text("industry"),
});

// Milestones table
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").notNull().default(false),
  order: integer("order").notNull(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  milestoneId: integer("milestone_id").references(() => milestones.id),
  title: text("title").notNull(),
  description: text("description"),
  assignedTo: integer("assigned_to").references(() => users.id),
  status: text("status").notNull(), // 'assigned', 'in-progress', 'completed'
  dueDate: timestamp("due_date"),
});

// Expenses table
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  description: text("description"),
});

// Project payments table
export const projectPayments = pgTable("project_payments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  status: text("status").notNull(), // 'completed', 'pending'
  description: text("description"),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});
export const insertCourseContentSchema = createInsertSchema(
  courseContents
).omit({ id: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
});
export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true });
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});
export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
});
export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
});
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});
export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
});
export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
});
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
});
export const insertProjectPaymentSchema = createInsertSchema(
  projectPayments
).omit({ id: true });

// Removed export types as they are TypeScript-specific
// export type User = typeof users.$inferSelect;
// export type InsertUser = z.infer<typeof insertUserSchema>;
// ... (all other export types removed)

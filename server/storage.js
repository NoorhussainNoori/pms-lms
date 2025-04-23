import {
  users,
  courses,
  courseContents,
  enrollments,
  quizzes,
  quizQuestions,
  quizResults,
  comments,
  projects,
  clients,
  milestones,
  tasks,
  expenses,
  projectPayments,
  UserRole, // Assuming UserRole is exported as a standard JS object or enum equivalent
} from "./../shared/schema.js"; // Adjust the import path as necessary

import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { pool, db } from "./db.js";
import { eq, desc, and, asc } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
// PostgresSessionStore needs the pg Pool, which is exported from db.js
const PostgresSessionStore = connectPg(session);

export class MemStorage {
  constructor() {
    // Initialize maps
    this.usersMap = new Map();
    this.coursesMap = new Map();
    this.courseContentsMap = new Map();
    this.enrollmentsMap = new Map();
    this.quizzesMap = new Map();
    this.quizQuestionsMap = new Map();
    this.quizResultsMap = new Map();
    this.commentsMap = new Map();
    this.projectsMap = new Map();
    this.clientsMap = new Map();
    this.milestonesMap = new Map();
    this.tasksMap = new Map();
    this.expensesMap = new Map();
    this.projectPaymentsMap = new Map();

    // Initialize IDs
    this.currentIds = {
      users: 1,
      courses: 1,
      courseContents: 1,
      enrollments: 1,
      quizzes: 1,
      quizQuestions: 1,
      quizResults: 1,
      comments: 1,
      projects: 1,
      clients: 1,
      milestones: 1,
      tasks: 1,
      expenses: 1,
      projectPayments: 1,
    };

    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id) {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser) {
    const id = this.currentIds.users++;
    const user = { ...insertUser, id };
    this.usersMap.set(id, user);
    return user;
  }

  async getUsersByRole(role) {
    return Array.from(this.usersMap.values()).filter(
      (user) => user.role === role
    );
  }

  // Course methods
  async createCourse(course) {
    const id = this.currentIds.courses++;
    const newCourse = { ...course, id };
    this.coursesMap.set(id, newCourse);
    return newCourse;
  }

  async getCourse(id) {
    return this.coursesMap.get(id);
  }

  async getAllCourses() {
    return Array.from(this.coursesMap.values());
  }

  async updateCourse(id, course) {
    const existingCourse = this.coursesMap.get(id);
    if (!existingCourse) return undefined;

    const updatedCourse = { ...existingCourse, ...course };
    this.coursesMap.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id) {
    return this.coursesMap.delete(id);
  }

  // Course content methods
  async createCourseContent(content) {
    const id = this.currentIds.courseContents++;
    const newContent = { ...content, id };
    this.courseContentsMap.set(id, newContent);
    return newContent;
  }

  async getCourseContent(id) {
    return this.courseContentsMap.get(id);
  }

  async getCourseContentsByCourse(courseId) {
    return Array.from(this.courseContentsMap.values()).filter(
      (content) => content.courseId === courseId
    );
  }

  async updateCourseContent(id, content) {
    const existingContent = this.courseContentsMap.get(id);
    if (!existingContent) return undefined;

    const updatedContent = { ...existingContent, ...content };
    this.courseContentsMap.set(id, updatedContent);
    return updatedContent;
  }

  async deleteCourseContent(id) {
    return this.courseContentsMap.delete(id);
  }

  // Enrollment methods
  async createEnrollment(enrollment) {
    const id = this.currentIds.enrollments++;
    const newEnrollment = { ...enrollment, id };
    this.enrollmentsMap.set(id, newEnrollment);
    return newEnrollment;
  }

  async getEnrollment(id) {
    return this.enrollmentsMap.get(id);
  }

  async getEnrollmentsByStudent(studentId) {
    return Array.from(this.enrollmentsMap.values()).filter(
      (enrollment) => enrollment.studentId === studentId
    );
  }

  async getEnrollmentsByCourse(courseId) {
    return Array.from(this.enrollmentsMap.values()).filter(
      (enrollment) => enrollment.courseId === courseId
    );
  }

  async updateEnrollment(id, enrollment) {
    const existingEnrollment = this.enrollmentsMap.get(id);
    if (!existingEnrollment) return undefined;

    const updatedEnrollment = { ...existingEnrollment, ...enrollment };
    this.enrollmentsMap.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  async deleteEnrollment(id) {
    return this.enrollmentsMap.delete(id);
  }

  // Quiz methods
  async createQuiz(quiz) {
    const id = this.currentIds.quizzes++;
    const newQuiz = { ...quiz, id };
    this.quizzesMap.set(id, newQuiz);
    return newQuiz;
  }

  async getQuiz(id) {
    return this.quizzesMap.get(id);
  }

  async getQuizzesByCourse(courseId) {
    return Array.from(this.quizzesMap.values()).filter(
      (quiz) => quiz.courseId === courseId
    );
  }

  async updateQuiz(id, quiz) {
    const existingQuiz = this.quizzesMap.get(id);
    if (!existingQuiz) return undefined;

    const updatedQuiz = { ...existingQuiz, ...quiz };
    this.quizzesMap.set(id, updatedQuiz);
    return updatedQuiz;
  }

  async deleteQuiz(id) {
    return this.quizzesMap.delete(id);
  }

  // Quiz question methods
  async createQuizQuestion(question) {
    const id = this.currentIds.quizQuestions++;
    const newQuestion = { ...question, id };
    this.quizQuestionsMap.set(id, newQuestion);
    return newQuestion;
  }

  async getQuizQuestion(id) {
    return this.quizQuestionsMap.get(id);
  }

  async getQuizQuestionsByQuiz(quizId) {
    return Array.from(this.quizQuestionsMap.values()).filter(
      (question) => question.quizId === quizId
    );
  }

  async updateQuizQuestion(id, question) {
    const existingQuestion = this.quizQuestionsMap.get(id);
    if (!existingQuestion) return undefined;

    const updatedQuestion = { ...existingQuestion, ...question };
    this.quizQuestionsMap.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async deleteQuizQuestion(id) {
    return this.quizQuestionsMap.delete(id);
  }

  // Quiz result methods
  async createQuizResult(result) {
    const id = this.currentIds.quizResults++;
    const newResult = { ...result, id };
    this.quizResultsMap.set(id, newResult);
    return newResult;
  }

  async getQuizResult(id) {
    return this.quizResultsMap.get(id);
  }

  async getQuizResultsByQuiz(quizId) {
    return Array.from(this.quizResultsMap.values()).filter(
      (result) => result.quizId === quizId
    );
  }

  async getQuizResultsByStudent(studentId) {
    return Array.from(this.quizResultsMap.values()).filter(
      (result) => result.studentId === studentId
    );
  }

  // Comment methods
  async createComment(comment) {
    const id = this.currentIds.comments++;
    const newComment = { ...comment, id };
    this.commentsMap.set(id, newComment);
    return newComment;
  }

  async getComment(id) {
    return this.commentsMap.get(id);
  }

  async getCommentsByContent(contentId) {
    return Array.from(this.commentsMap.values()).filter(
      (comment) => comment.contentId === contentId
    );
  }

  // Project methods
  async createProject(project) {
    const id = this.currentIds.projects++;
    const newProject = { ...project, id };
    this.projectsMap.set(id, newProject);
    return newProject;
  }

  async getProject(id) {
    return this.projectsMap.get(id);
  }

  async getAllProjects() {
    return Array.from(this.projectsMap.values());
  }

  async getProjectsByManager(managerId) {
    return Array.from(this.projectsMap.values()).filter(
      (project) => project.managerId === managerId
    );
  }

  async updateProject(id, project) {
    const existingProject = this.projectsMap.get(id);
    if (!existingProject) return undefined;

    const updatedProject = { ...existingProject, ...project };
    this.projectsMap.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id) {
    return this.projectsMap.delete(id);
  }

  // Client methods
  async createClient(client) {
    const id = this.currentIds.clients++;
    const newClient = { ...client, id };
    this.clientsMap.set(id, newClient);
    return newClient;
  }

  async getClient(id) {
    return this.clientsMap.get(id);
  }

  async getAllClients() {
    return Array.from(this.clientsMap.values());
  }

  async updateClient(id, client) {
    const existingClient = this.clientsMap.get(id);
    if (!existingClient) return undefined;

    const updatedClient = { ...existingClient, ...client };
    this.clientsMap.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id) {
    return this.clientsMap.delete(id);
  }

  // Milestone methods
  async createMilestone(milestone) {
    const id = this.currentIds.milestones++;
    const newMilestone = { ...milestone, id };
    this.milestonesMap.set(id, newMilestone);
    return newMilestone;
  }

  async getMilestone(id) {
    return this.milestonesMap.get(id);
  }

  async getMilestonesByProject(projectId) {
    return Array.from(this.milestonesMap.values()).filter(
      (milestone) => milestone.projectId === projectId
    );
  }

  async updateMilestone(id, milestone) {
    const existingMilestone = this.milestonesMap.get(id);
    if (!existingMilestone) return undefined;

    const updatedMilestone = { ...existingMilestone, ...milestone };
    this.milestonesMap.set(id, updatedMilestone);
    return updatedMilestone;
  }

  async deleteMilestone(id) {
    return this.milestonesMap.delete(id);
  }

  // Task methods
  async createTask(task) {
    const id = this.currentIds.tasks++;
    const newTask = { ...task, id };
    this.tasksMap.set(id, newTask);
    return newTask;
  }

  async getTask(id) {
    return this.tasksMap.get(id);
  }

  async getTasksByProject(projectId) {
    return Array.from(this.tasksMap.values()).filter(
      (task) => task.projectId === projectId
    );
  }

  async getTasksByMilestone(milestoneId) {
    return Array.from(this.tasksMap.values()).filter(
      (task) => task.milestoneId === milestoneId
    );
  }

  async getTasksByEmployee(employeeId) {
    return Array.from(this.tasksMap.values()).filter(
      (task) => task.assignedTo === employeeId
    );
  }

  async updateTask(id, task) {
    const existingTask = this.tasksMap.get(id);
    if (!existingTask) return undefined;

    const updatedTask = { ...existingTask, ...task };
    this.tasksMap.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id) {
    return this.tasksMap.delete(id);
  }

  // Expense methods
  async createExpense(expense) {
    const id = this.currentIds.expenses++;
    const newExpense = { ...expense, id };
    this.expensesMap.set(id, newExpense);
    return newExpense;
  }

  async getExpense(id) {
    return this.expensesMap.get(id);
  }

  async getAllExpenses() {
    return Array.from(this.expensesMap.values());
  }

  async getExpensesByCategory(category) {
    return Array.from(this.expensesMap.values()).filter(
      (expense) => expense.category === category
    );
  }

  // Project payment methods
  async createProjectPayment(payment) {
    const id = this.currentIds.projectPayments++;
    const newPayment = { ...payment, id };
    this.projectPaymentsMap.set(id, newPayment);
    return newPayment;
  }

  async getProjectPayment(id) {
    return this.projectPaymentsMap.get(id);
  }

  async getProjectPaymentsByProject(projectId) {
    return Array.from(this.projectPaymentsMap.values()).filter(
      (payment) => payment.projectId === projectId
    );
  }
}

export class DatabaseStorage {
  constructor() {
    // Pass the pool to PostgresSessionStore
    this.sessionStore = new PostgresSessionStore({
      pool: db.client, // Access the underlying pool from the drizzle instance if pool is not directly exported
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser) {
    const userInput = {
      ...insertUser,
      role: insertUser.role,
    };
    const [user] = await db.insert(users).values(userInput).returning();
    return user;
  }

  async getUsersByRole(role) {
    return await db.select().from(users).where(eq(users.role, role));
  }

  // Course methods
  async createCourse(course) {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async getCourse(id) {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getAllCourses() {
    return await db.select().from(courses);
  }

  async updateCourse(id, courseUpdate) {
    const [updatedCourse] = await db
      .update(courses)
      .set(courseUpdate)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse || undefined;
  }

  async deleteCourse(id) {
    const result = await db.delete(courses).where(eq(courses.id, id));
    // Drizzle's delete returns an array of deleted rows, or an empty array if none were deleted.
    // The original TS code returned a boolean based on map.delete().
    // Checking if the returned array has elements indicates if a row was deleted.
    return result.length > 0;
  }

  // Course content methods
  async createCourseContent(content) {
    const [newContent] = await db
      .insert(courseContents)
      .values(content)
      .returning();
    return newContent;
  }

  async getCourseContent(id) {
    const [content] = await db
      .select()
      .from(courseContents)
      .where(eq(courseContents.id, id));
    return content || undefined;
  }

  async getCourseContentsByCourse(courseId) {
    return await db
      .select()
      .from(courseContents)
      .where(eq(courseContents.courseId, courseId))
      .orderBy(asc(courseContents.order));
  }

  async updateCourseContent(id, contentUpdate) {
    const [updatedContent] = await db
      .update(courseContents)
      .set(contentUpdate)
      .where(eq(courseContents.id, id))
      .returning();
    return updatedContent || undefined;
  }

  async deleteCourseContent(id) {
    const result = await db
      .delete(courseContents)
      .where(eq(courseContents.id, id));
    return result.length > 0;
  }

  // Enrollment methods
  async createEnrollment(enrollment) {
    const [newEnrollment] = await db
      .insert(enrollments)
      .values(enrollment)
      .returning();
    return newEnrollment;
  }

  async getEnrollment(id) {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.id, id));
    return enrollment || undefined;
  }

  async getEnrollmentsByStudent(studentId) {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId));
  }

  async getEnrollmentsByCourse(courseId) {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
  }

  async updateEnrollment(id, enrollmentUpdate) {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set(enrollmentUpdate)
      .where(eq(enrollments.id, id))
      .returning();
    return updatedEnrollment || undefined;
  }

  async deleteEnrollment(id) {
    const result = await db.delete(enrollments).where(eq(enrollments.id, id));
    return result.length > 0;
  }

  // Quiz methods
  async createQuiz(quiz) {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async getQuiz(id) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async getQuizzesByCourse(courseId) {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.courseId, courseId));
  }

  async updateQuiz(id, quizUpdate) {
    const [updatedQuiz] = await db
      .update(quizzes)
      .set(quizUpdate)
      .where(eq(quizzes.id, id))
      .returning();
    return updatedQuiz || undefined;
  }

  async deleteQuiz(id) {
    const result = await db.delete(quizzes).where(eq(quizzes.id, id));
    return result.length > 0;
  }

  // Quiz question methods
  async createQuizQuestion(question) {
    const [newQuestion] = await db
      .insert(quizQuestions)
      .values(question)
      .returning();
    return newQuestion;
  }

  async getQuizQuestion(id) {
    const [question] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, id));
    return question || undefined;
  }

  async getQuizQuestionsByQuiz(quizId) {
    return await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(asc(quizQuestions.order));
  }

  async updateQuizQuestion(id, questionUpdate) {
    const [updatedQuestion] = await db
      .update(quizQuestions)
      .set(questionUpdate)
      .where(eq(quizQuestions.id, id))
      .returning();
    return updatedQuestion || undefined;
  }

  async deleteQuizQuestion(id) {
    const result = await db
      .delete(quizQuestions)
      .where(eq(quizQuestions.id, id));
    return result.length > 0;
  }

  // Quiz result methods
  async createQuizResult(result) {
    const [newResult] = await db.insert(quizResults).values(result).returning();
    return newResult;
  }

  async getQuizResult(id) {
    const [result] = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.id, id));
    return result || undefined;
  }

  async getQuizResultsByQuiz(quizId) {
    return await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.quizId, quizId));
  }

  async getQuizResultsByStudent(studentId) {
    return await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.studentId, studentId));
  }

  // Comment methods
  async createComment(comment) {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getComment(id) {
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, id));
    return comment || undefined;
  }

  async getCommentsByContent(contentId) {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.contentId, contentId));
  }

  // Project methods
  async createProject(project) {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getProject(id) {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    return project || undefined;
  }

  async getAllProjects() {
    return await db.select().from(projects);
  }

  async getProjectsByManager(managerId) {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.managerId, managerId));
  }

  async updateProject(id, projectUpdate) {
    const [updatedProject] = await db
      .update(projects)
      .set(projectUpdate)
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
  }

  async deleteProject(id) {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.length > 0;
  }

  // Client methods
  async createClient(client) {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async getClient(id) {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getAllClients() {
    return await db.select().from(clients);
  }

  async updateClient(id, clientUpdate) {
    const [updatedClient] = await db
      .update(clients)
      .set(clientUpdate)
      .where(eq(clients.id, id))
      .returning();
    return updatedClient || undefined;
  }

  async deleteClient(id) {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.length > 0;
  }

  // Milestone methods
  async createMilestone(milestone) {
    const [newMilestone] = await db
      .insert(milestones)
      .values(milestone)
      .returning();
    return newMilestone;
  }

  async getMilestone(id) {
    const [milestone] = await db
      .select()
      .from(milestones)
      .where(eq(milestones.id, id));
    return milestone || undefined;
  }

  async getMilestonesByProject(projectId) {
    return await db
      .select()
      .from(milestones)
      .where(eq(milestones.projectId, projectId))
      .orderBy(asc(milestones.order));
  }

  async updateMilestone(id, milestoneUpdate) {
    const [updatedMilestone] = await db
      .update(milestones)
      .set(milestoneUpdate)
      .where(eq(milestones.id, id))
      .returning();
    return updatedMilestone || undefined;
  }

  async deleteMilestone(id) {
    const result = await db.delete(milestones).where(eq(milestones.id, id));
    return result.length > 0;
  }

  // Task methods
  async createTask(task) {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async getTask(id) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async getTasksByProject(projectId) {
    return await db.select().from(tasks).where(eq(tasks.projectId, projectId));
  }

  async getTasksByMilestone(milestoneId) {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.milestoneId, milestoneId));
  }

  async getTasksByEmployee(employeeId) {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.assignedTo, employeeId));
  }

  async updateTask(id, taskUpdate) {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskUpdate)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask || undefined;
  }

  async deleteTask(id) {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.length > 0;
  }

  // Expense methods
  async createExpense(expense) {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async getExpense(id) {
    const [expense] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id));
    return expense || undefined;
  }

  async getAllExpenses() {
    return await db.select().from(expenses);
  }

  async getExpensesByCategory(category) {
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.category, category));
  }

  // Project payment methods
  async createProjectPayment(payment) {
    const [newPayment] = await db
      .insert(projectPayments)
      .values(payment)
      .returning();
    return newPayment;
  }

  async getProjectPayment(id) {
    const [payment] = await db
      .select()
      .from(projectPayments)
      .where(eq(projectPayments.id, id));
    return payment || undefined;
  }

  async getProjectPaymentsByProject(projectId) {
    return await db
      .select()
      .from(projectPayments)
      .where(eq(projectPayments.projectId, projectId));
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();

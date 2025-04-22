import { 
  users, courses, courseContents, enrollments, quizzes, quizQuestions, quizResults, 
  comments, projects, clients, milestones, tasks, expenses, projectPayments,
  type User, type InsertUser, type Course, type InsertCourse, type CourseContent, 
  type InsertCourseContent, type Enrollment, type InsertEnrollment, type Quiz, 
  type InsertQuiz, type QuizQuestion, type InsertQuizQuestion, type QuizResult, 
  type InsertQuizResult, type Comment, type InsertComment, type Project, 
  type InsertProject, type Client, type InsertClient, type Milestone, 
  type InsertMilestone, type Task, type InsertTask, type Expense, 
  type InsertExpense, type ProjectPayment, type InsertProjectPayment, UserRole
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByRole(role: UserRole): Promise<User[]>;
  
  // Course management
  createCourse(course: InsertCourse): Promise<Course>;
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Course content management
  createCourseContent(content: InsertCourseContent): Promise<CourseContent>;
  getCourseContent(id: number): Promise<CourseContent | undefined>;
  getCourseContentsByCourse(courseId: number): Promise<CourseContent[]>;
  updateCourseContent(id: number, content: Partial<InsertCourseContent>): Promise<CourseContent | undefined>;
  deleteCourseContent(id: number): Promise<boolean>;
  
  // Enrollment management
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]>;
  updateEnrollment(id: number, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;
  deleteEnrollment(id: number): Promise<boolean>;
  
  // Quiz management
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizzesByCourse(courseId: number): Promise<Quiz[]>;
  updateQuiz(id: number, quiz: Partial<InsertQuiz>): Promise<Quiz | undefined>;
  deleteQuiz(id: number): Promise<boolean>;
  
  // Quiz question management
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  getQuizQuestion(id: number): Promise<QuizQuestion | undefined>;
  getQuizQuestionsByQuiz(quizId: number): Promise<QuizQuestion[]>;
  updateQuizQuestion(id: number, question: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined>;
  deleteQuizQuestion(id: number): Promise<boolean>;
  
  // Quiz result management
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  getQuizResultsByQuiz(quizId: number): Promise<QuizResult[]>;
  getQuizResultsByStudent(studentId: number): Promise<QuizResult[]>;
  
  // Comment management
  createComment(comment: InsertComment): Promise<Comment>;
  getComment(id: number): Promise<Comment | undefined>;
  getCommentsByContent(contentId: number): Promise<Comment[]>;
  
  // Project management
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getProjectsByManager(managerId: number): Promise<Project[]>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Client management
  createClient(client: InsertClient): Promise<Client>;
  getClient(id: number): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  // Milestone management
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  getMilestone(id: number): Promise<Milestone | undefined>;
  getMilestonesByProject(projectId: number): Promise<Milestone[]>;
  updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined>;
  deleteMilestone(id: number): Promise<boolean>;
  
  // Task management
  createTask(task: InsertTask): Promise<Task>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByProject(projectId: number): Promise<Task[]>;
  getTasksByMilestone(milestoneId: number): Promise<Task[]>;
  getTasksByEmployee(employeeId: number): Promise<Task[]>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Expense management
  createExpense(expense: InsertExpense): Promise<Expense>;
  getExpense(id: number): Promise<Expense | undefined>;
  getAllExpenses(): Promise<Expense[]>;
  getExpensesByCategory(category: string): Promise<Expense[]>;
  
  // Project payment management
  createProjectPayment(payment: InsertProjectPayment): Promise<ProjectPayment>;
  getProjectPayment(id: number): Promise<ProjectPayment | undefined>;
  getProjectPaymentsByProject(projectId: number): Promise<ProjectPayment[]>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private coursesMap: Map<number, Course>;
  private courseContentsMap: Map<number, CourseContent>;
  private enrollmentsMap: Map<number, Enrollment>;
  private quizzesMap: Map<number, Quiz>;
  private quizQuestionsMap: Map<number, QuizQuestion>;
  private quizResultsMap: Map<number, QuizResult>;
  private commentsMap: Map<number, Comment>;
  private projectsMap: Map<number, Project>;
  private clientsMap: Map<number, Client>;
  private milestonesMap: Map<number, Milestone>;
  private tasksMap: Map<number, Task>;
  private expensesMap: Map<number, Expense>;
  private projectPaymentsMap: Map<number, ProjectPayment>;
  
  // Current IDs for each entity
  private currentIds: {
    users: number;
    courses: number;
    courseContents: number;
    enrollments: number;
    quizzes: number;
    quizQuestions: number;
    quizResults: number;
    comments: number;
    projects: number;
    clients: number;
    milestones: number;
    tasks: number;
    expenses: number;
    projectPayments: number;
  };
  
  sessionStore: session.SessionStore;

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
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id };
    this.usersMap.set(id, user);
    return user;
  }
  
  async getUsersByRole(role: UserRole): Promise<User[]> {
    return Array.from(this.usersMap.values()).filter(
      (user) => user.role === role,
    );
  }

  // Course methods
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.currentIds.courses++;
    const newCourse: Course = { ...course, id };
    this.coursesMap.set(id, newCourse);
    return newCourse;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.coursesMap.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.coursesMap.values());
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const existingCourse = this.coursesMap.get(id);
    if (!existingCourse) return undefined;
    
    const updatedCourse: Course = { ...existingCourse, ...course };
    this.coursesMap.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.coursesMap.delete(id);
  }

  // Course content methods
  async createCourseContent(content: InsertCourseContent): Promise<CourseContent> {
    const id = this.currentIds.courseContents++;
    const newContent: CourseContent = { ...content, id };
    this.courseContentsMap.set(id, newContent);
    return newContent;
  }

  async getCourseContent(id: number): Promise<CourseContent | undefined> {
    return this.courseContentsMap.get(id);
  }

  async getCourseContentsByCourse(courseId: number): Promise<CourseContent[]> {
    return Array.from(this.courseContentsMap.values()).filter(
      (content) => content.courseId === courseId,
    );
  }

  async updateCourseContent(id: number, content: Partial<InsertCourseContent>): Promise<CourseContent | undefined> {
    const existingContent = this.courseContentsMap.get(id);
    if (!existingContent) return undefined;
    
    const updatedContent: CourseContent = { ...existingContent, ...content };
    this.courseContentsMap.set(id, updatedContent);
    return updatedContent;
  }

  async deleteCourseContent(id: number): Promise<boolean> {
    return this.courseContentsMap.delete(id);
  }

  // Enrollment methods
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentIds.enrollments++;
    const newEnrollment: Enrollment = { ...enrollment, id };
    this.enrollmentsMap.set(id, newEnrollment);
    return newEnrollment;
  }

  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollmentsMap.get(id);
  }

  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollmentsMap.values()).filter(
      (enrollment) => enrollment.studentId === studentId,
    );
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollmentsMap.values()).filter(
      (enrollment) => enrollment.courseId === courseId,
    );
  }

  async updateEnrollment(id: number, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const existingEnrollment = this.enrollmentsMap.get(id);
    if (!existingEnrollment) return undefined;
    
    const updatedEnrollment: Enrollment = { ...existingEnrollment, ...enrollment };
    this.enrollmentsMap.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    return this.enrollmentsMap.delete(id);
  }

  // Quiz methods
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentIds.quizzes++;
    const newQuiz: Quiz = { ...quiz, id };
    this.quizzesMap.set(id, newQuiz);
    return newQuiz;
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzesMap.get(id);
  }

  async getQuizzesByCourse(courseId: number): Promise<Quiz[]> {
    return Array.from(this.quizzesMap.values()).filter(
      (quiz) => quiz.courseId === courseId,
    );
  }

  async updateQuiz(id: number, quiz: Partial<InsertQuiz>): Promise<Quiz | undefined> {
    const existingQuiz = this.quizzesMap.get(id);
    if (!existingQuiz) return undefined;
    
    const updatedQuiz: Quiz = { ...existingQuiz, ...quiz };
    this.quizzesMap.set(id, updatedQuiz);
    return updatedQuiz;
  }

  async deleteQuiz(id: number): Promise<boolean> {
    return this.quizzesMap.delete(id);
  }

  // Quiz question methods
  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentIds.quizQuestions++;
    const newQuestion: QuizQuestion = { ...question, id };
    this.quizQuestionsMap.set(id, newQuestion);
    return newQuestion;
  }

  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    return this.quizQuestionsMap.get(id);
  }

  async getQuizQuestionsByQuiz(quizId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestionsMap.values()).filter(
      (question) => question.quizId === quizId,
    );
  }

  async updateQuizQuestion(id: number, question: Partial<InsertQuizQuestion>): Promise<QuizQuestion | undefined> {
    const existingQuestion = this.quizQuestionsMap.get(id);
    if (!existingQuestion) return undefined;
    
    const updatedQuestion: QuizQuestion = { ...existingQuestion, ...question };
    this.quizQuestionsMap.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async deleteQuizQuestion(id: number): Promise<boolean> {
    return this.quizQuestionsMap.delete(id);
  }

  // Quiz result methods
  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentIds.quizResults++;
    const newResult: QuizResult = { ...result, id };
    this.quizResultsMap.set(id, newResult);
    return newResult;
  }

  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    return this.quizResultsMap.get(id);
  }

  async getQuizResultsByQuiz(quizId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResultsMap.values()).filter(
      (result) => result.quizId === quizId,
    );
  }

  async getQuizResultsByStudent(studentId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResultsMap.values()).filter(
      (result) => result.studentId === studentId,
    );
  }

  // Comment methods
  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.currentIds.comments++;
    const newComment: Comment = { ...comment, id };
    this.commentsMap.set(id, newComment);
    return newComment;
  }

  async getComment(id: number): Promise<Comment | undefined> {
    return this.commentsMap.get(id);
  }

  async getCommentsByContent(contentId: number): Promise<Comment[]> {
    return Array.from(this.commentsMap.values()).filter(
      (comment) => comment.contentId === contentId,
    );
  }

  // Project methods
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentIds.projects++;
    const newProject: Project = { ...project, id };
    this.projectsMap.set(id, newProject);
    return newProject;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsMap.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projectsMap.values());
  }

  async getProjectsByManager(managerId: number): Promise<Project[]> {
    return Array.from(this.projectsMap.values()).filter(
      (project) => project.managerId === managerId,
    );
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projectsMap.get(id);
    if (!existingProject) return undefined;
    
    const updatedProject: Project = { ...existingProject, ...project };
    this.projectsMap.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projectsMap.delete(id);
  }

  // Client methods
  async createClient(client: InsertClient): Promise<Client> {
    const id = this.currentIds.clients++;
    const newClient: Client = { ...client, id };
    this.clientsMap.set(id, newClient);
    return newClient;
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clientsMap.get(id);
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clientsMap.values());
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const existingClient = this.clientsMap.get(id);
    if (!existingClient) return undefined;
    
    const updatedClient: Client = { ...existingClient, ...client };
    this.clientsMap.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clientsMap.delete(id);
  }

  // Milestone methods
  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const id = this.currentIds.milestones++;
    const newMilestone: Milestone = { ...milestone, id };
    this.milestonesMap.set(id, newMilestone);
    return newMilestone;
  }

  async getMilestone(id: number): Promise<Milestone | undefined> {
    return this.milestonesMap.get(id);
  }

  async getMilestonesByProject(projectId: number): Promise<Milestone[]> {
    return Array.from(this.milestonesMap.values()).filter(
      (milestone) => milestone.projectId === projectId,
    );
  }

  async updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    const existingMilestone = this.milestonesMap.get(id);
    if (!existingMilestone) return undefined;
    
    const updatedMilestone: Milestone = { ...existingMilestone, ...milestone };
    this.milestonesMap.set(id, updatedMilestone);
    return updatedMilestone;
  }

  async deleteMilestone(id: number): Promise<boolean> {
    return this.milestonesMap.delete(id);
  }

  // Task methods
  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentIds.tasks++;
    const newTask: Task = { ...task, id };
    this.tasksMap.set(id, newTask);
    return newTask;
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasksMap.get(id);
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return Array.from(this.tasksMap.values()).filter(
      (task) => task.projectId === projectId,
    );
  }

  async getTasksByMilestone(milestoneId: number): Promise<Task[]> {
    return Array.from(this.tasksMap.values()).filter(
      (task) => task.milestoneId === milestoneId,
    );
  }

  async getTasksByEmployee(employeeId: number): Promise<Task[]> {
    return Array.from(this.tasksMap.values()).filter(
      (task) => task.assignedTo === employeeId,
    );
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasksMap.get(id);
    if (!existingTask) return undefined;
    
    const updatedTask: Task = { ...existingTask, ...task };
    this.tasksMap.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasksMap.delete(id);
  }

  // Expense methods
  async createExpense(expense: InsertExpense): Promise<Expense> {
    const id = this.currentIds.expenses++;
    const newExpense: Expense = { ...expense, id };
    this.expensesMap.set(id, newExpense);
    return newExpense;
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    return this.expensesMap.get(id);
  }

  async getAllExpenses(): Promise<Expense[]> {
    return Array.from(this.expensesMap.values());
  }

  async getExpensesByCategory(category: string): Promise<Expense[]> {
    return Array.from(this.expensesMap.values()).filter(
      (expense) => expense.category === category,
    );
  }

  // Project payment methods
  async createProjectPayment(payment: InsertProjectPayment): Promise<ProjectPayment> {
    const id = this.currentIds.projectPayments++;
    const newPayment: ProjectPayment = { ...payment, id };
    this.projectPaymentsMap.set(id, newPayment);
    return newPayment;
  }

  async getProjectPayment(id: number): Promise<ProjectPayment | undefined> {
    return this.projectPaymentsMap.get(id);
  }

  async getProjectPaymentsByProject(projectId: number): Promise<ProjectPayment[]> {
    return Array.from(this.projectPaymentsMap.values()).filter(
      (payment) => payment.projectId === projectId,
    );
  }
}

export const storage = new MemStorage();

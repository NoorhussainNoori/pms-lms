import { createServer } from "http";
import { storage } from "./storage.js";
import { setupAuth } from "./auth.js";
// Assuming UserRole is exported as a standard JS object or enum equivalent from @shared/schema
import {
  UserRole,
  insertCourseSchema,
  insertCourseContentSchema,
  insertEnrollmentSchema,
  insertQuizSchema,
  insertQuizQuestionSchema,
  insertQuizResultSchema,
  insertCommentSchema,
  insertProjectSchema,
  insertClientSchema,
  insertMilestoneSchema,
  insertTaskSchema,
  insertExpenseSchema,
  insertProjectPaymentSchema,
} from "./../shared/schema.js";
import { z } from "zod";

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Middleware to check role
function hasRole(roles) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roles.includes(req.user.role)) {
      return next();
    }

    res.status(403).json({ message: "Forbidden - Insufficient permissions" });
  };
}

export async function registerRoutes(app) {
  // Set up authentication routes
  setupAuth(app);

  // User routes
  app.get(
    "/api/users",
    isAuthenticated,
    hasRole([UserRole.ADMIN]),
    async (req, res) => {
      try {
        const role = req.query.role;
        let users;

        if (role) {
          users = await storage.getUsersByRole(role);
        } else {
          // Return all users except the current user
          const allUsers = [];
          for (const r of Object.values(UserRole)) {
            const usersWithRole = await storage.getUsersByRole(r);
            allUsers.push(...usersWithRole);
          }
          users = allUsers.filter((user) => user.id !== req.user.id);
        }

        // Return users without passwords
        const usersWithoutPasswords = users.map(
          ({ password, ...user }) => user
        );
        res.json(usersWithoutPasswords);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Course routes
  app.post(
    "/api/courses",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.INSTRUCTOR]),
    async (req, res) => {
      try {
        const data = insertCourseSchema.parse(req.body);
        const course = await storage.createCourse(data);
        res.status(201).json(course);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get("/api/courses", isAuthenticated, async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/courses/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(
    "/api/courses/:id",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.INSTRUCTOR]),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const data = insertCourseSchema.partial().parse(req.body);
        const course = await storage.updateCourse(id, data);

        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }

        res.json(course);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.delete(
    "/api/courses/:id",
    isAuthenticated,
    hasRole([UserRole.ADMIN]),
    async (req, res) => {
      try {
        const id = parseInt(req.params.id);
        const deleted = await storage.deleteCourse(id);

        if (!deleted) {
          return res.status(404).json({ message: "Course not found" });
        }

        res.sendStatus(204);
      } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Course content routes
  app.post(
    "/api/course-contents",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.INSTRUCTOR]),
    async (req, res) => {
      try {
        const data = insertCourseContentSchema.parse(req.body);
        const content = await storage.createCourseContent(data);
        res.status(201).json(content);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating course content:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/courses/:courseId/contents",
    isAuthenticated,
    async (req, res) => {
      try {
        const courseId = parseInt(req.params.courseId);
        const contents = await storage.getCourseContentsByCourse(courseId);
        res.json(contents);
      } catch (error) {
        console.error("Error fetching course contents:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Enrollment routes
  app.post(
    "/api/enrollments",
    isAuthenticated,
    hasRole([UserRole.ADMIN]),
    async (req, res) => {
      try {
        const data = insertEnrollmentSchema.parse(req.body);
        const enrollment = await storage.createEnrollment(data);
        res.status(201).json(enrollment);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating enrollment:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/students/:studentId/enrollments",
    isAuthenticated,
    async (req, res) => {
      try {
        const studentId = parseInt(req.params.studentId);

        // Only admin or the student themselves can view enrollments
        if (req.user.role !== UserRole.ADMIN && req.user.id !== studentId) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const enrollments = await storage.getEnrollmentsByStudent(studentId);
        res.json(enrollments);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/courses/:courseId/enrollments",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.INSTRUCTOR]),
    async (req, res) => {
      try {
        const courseId = parseInt(req.params.courseId);
        const enrollments = await storage.getEnrollmentsByCourse(courseId);
        res.json(enrollments);
      } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Quiz routes
  app.post(
    "/api/quizzes",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.INSTRUCTOR]),
    async (req, res) => {
      try {
        const data = insertQuizSchema.parse(req.body);
        const quiz = await storage.createQuiz(data);
        res.status(201).json(quiz);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/courses/:courseId/quizzes",
    isAuthenticated,
    async (req, res) => {
      try {
        const courseId = parseInt(req.params.courseId);
        const quizzes = await storage.getQuizzesByCourse(courseId);
        res.json(quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Quiz question routes
  app.post(
    "/api/quiz-questions",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.INSTRUCTOR]),
    async (req, res) => {
      try {
        const data = insertQuizQuestionSchema.parse(req.body);
        const question = await storage.createQuizQuestion(data);
        res.status(201).json(question);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating quiz question:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/quizzes/:quizId/questions",
    isAuthenticated,
    async (req, res) => {
      try {
        const quizId = parseInt(req.params.quizId);
        const questions = await storage.getQuizQuestionsByQuiz(quizId);
        res.json(questions);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Quiz result routes
  app.post("/api/quiz-results", isAuthenticated, async (req, res) => {
    try {
      const data = insertQuizResultSchema.parse(req.body);

      // If not admin or instructor, ensure the student ID is the current user's ID
      if (
        req.user.role !== UserRole.ADMIN &&
        req.user.role !== UserRole.INSTRUCTOR &&
        req.user.id !== data.studentId
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const result = await storage.createQuizResult(data);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      console.error("Error creating quiz result:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(
    "/api/quizzes/:quizId/results",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.INSTRUCTOR]),
    async (req, res) => {
      try {
        const quizId = parseInt(req.params.quizId);
        const results = await storage.getQuizResultsByQuiz(quizId);
        res.json(results);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/students/:studentId/quiz-results",
    isAuthenticated,
    async (req, res) => {
      try {
        const studentId = parseInt(req.params.studentId);

        // Only admin, instructor, or the student themselves can view results
        if (
          req.user.role !== UserRole.ADMIN &&
          req.user.role !== UserRole.INSTRUCTOR &&
          req.user.id !== studentId
        ) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const results = await storage.getQuizResultsByStudent(studentId);
        res.json(results);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Comment routes
  app.post("/api/comments", isAuthenticated, async (req, res) => {
    try {
      // Ensure the user ID in the comment is the current user's ID
      const data = insertCommentSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const comment = await storage.createComment(data);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(
    "/api/content/:contentId/comments",
    isAuthenticated,
    async (req, res) => {
      try {
        const contentId = parseInt(req.params.contentId);
        const comments = await storage.getCommentsByContent(contentId);
        res.json(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Project routes
  app.post(
    "/api/projects",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
    async (req, res) => {
      try {
        const data = insertProjectSchema.parse(req.body);
        const project = await storage.createProject(data);
        res.status(201).json(project);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get("/api/projects", isAuthenticated, async (req, res) => {
    try {
      let projects;

      // Filter projects based on user role
      if (
        req.user.role === UserRole.ADMIN ||
        req.user.role === UserRole.PROJECT_MANAGER
      ) {
        projects = await storage.getAllProjects();
      } else if (req.user.role === UserRole.EMPLOYEE) {
        // Employees can only see projects they are assigned to
        const employeeTasks = await storage.getTasksByEmployee(req.user.id);
        const projectIds = [
          ...new Set(employeeTasks.map((task) => task.projectId)),
        ];
        projects = await Promise.all(
          projectIds.map(async (id) => await storage.getProject(id))
        );
        // Filter out null projects in case getProject returns null
        projects = projects.filter((project) => project !== null);
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Client routes
  app.post(
    "/api/clients",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
    async (req, res) => {
      try {
        const data = insertClientSchema.parse(req.body);
        const client = await storage.createClient(data);
        res.status(201).json(client);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating client:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/clients",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
    async (req, res) => {
      try {
        const clients = await storage.getAllClients();
        res.json(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Milestone routes
  app.post(
    "/api/milestones",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
    async (req, res) => {
      try {
        const data = insertMilestoneSchema.parse(req.body);
        const milestone = await storage.createMilestone(data);
        res.status(201).json(milestone);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating milestone:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/projects/:projectId/milestones",
    isAuthenticated,
    async (req, res) => {
      try {
        const projectId = parseInt(req.params.projectId);
        const milestones = await storage.getMilestonesByProject(projectId);
        res.json(milestones);
      } catch (error) {
        console.error("Error fetching milestones:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Task routes
  app.post(
    "/api/tasks",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.PROJECT_MANAGER]),
    async (req, res) => {
      try {
        const data = insertTaskSchema.parse(req.body);
        const task = await storage.createTask(data);
        res.status(201).json(task);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/projects/:projectId/tasks",
    isAuthenticated,
    async (req, res) => {
      try {
        const projectId = parseInt(req.params.projectId);
        const tasks = await storage.getTasksByProject(projectId);
        res.json(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/employees/:employeeId/tasks",
    isAuthenticated,
    async (req, res) => {
      try {
        const employeeId = parseInt(req.params.employeeId);

        // Only admin, project manager, or the employee themselves can view their tasks
        if (
          req.user.role !== UserRole.ADMIN &&
          req.user.role !== UserRole.PROJECT_MANAGER &&
          req.user.id !== employeeId
        ) {
          return res.status(403).json({ message: "Forbidden" });
        }

        const tasks = await storage.getTasksByEmployee(employeeId);
        res.json(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.put("/api/tasks/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // If not admin or project manager, ensure the employee is assigned to this task
      if (
        req.user.role !== UserRole.ADMIN &&
        req.user.role !== UserRole.PROJECT_MANAGER &&
        req.user.id !== task.assignedTo
      ) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // If employee, they can only update the status
      let data;
      if (req.user.role === UserRole.EMPLOYEE) {
        data = { status: req.body.status };
      } else {
        data = insertTaskSchema.partial().parse(req.body);
      }

      const updatedTask = await storage.updateTask(id, data);
      res.json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Expense routes
  app.post(
    "/api/expenses",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.FINANCE]),
    async (req, res) => {
      try {
        const data = insertExpenseSchema.parse(req.body);
        const expense = await storage.createExpense(data);
        res.status(201).json(expense);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating expense:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/expenses",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.FINANCE]),
    async (req, res) => {
      try {
        const category = req.query.category;
        let expenses;

        if (category) {
          expenses = await storage.getExpensesByCategory(category);
        } else {
          expenses = await storage.getAllExpenses();
        }

        res.json(expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Project payment routes
  app.post(
    "/api/project-payments",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.FINANCE]),
    async (req, res) => {
      try {
        const data = insertProjectPaymentSchema.parse(req.body);
        const payment = await storage.createProjectPayment(data);
        res.status(201).json(payment);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Validation failed",
            errors: error.errors,
          });
        }
        console.error("Error creating project payment:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  app.get(
    "/api/projects/:projectId/payments",
    isAuthenticated,
    hasRole([UserRole.ADMIN, UserRole.FINANCE, UserRole.PROJECT_MANAGER]),
    async (req, res) => {
      try {
        const projectId = parseInt(req.params.projectId);
        const payments = await storage.getProjectPaymentsByProject(projectId);
        res.json(payments);
      } catch (error) {
        console.error("Error fetching project payments:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

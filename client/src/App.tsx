import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import CoursesPage from "@/pages/courses-page";
import StudentsPage from "@/pages/students-page";
import QuizzesPage from "@/pages/quizzes-page";
import InstructorsPage from "@/pages/instructors-page";
import ProjectsPage from "@/pages/projects-page";
import TasksPage from "@/pages/tasks-page";
import EmployeesPage from "@/pages/employees-page";
import ClientsPage from "@/pages/clients-page";
import PaymentsPage from "@/pages/payments-page";
import IncomePage from "@/pages/income-page";
import ExpensesPage from "@/pages/expenses-page";
import ReportsPage from "@/pages/reports-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes */}
      <Route path="/" component={Dashboard} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/students" component={StudentsPage} />
      <Route path="/quizzes" component={QuizzesPage} />
      <Route path="/instructors" component={InstructorsPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/tasks" component={TasksPage} />
      <Route path="/employees" component={EmployeesPage} />
      <Route path="/clients" component={ClientsPage} />
      <Route path="/payments" component={PaymentsPage} />
      <Route path="/income" component={IncomePage} />
      <Route path="/expenses" component={ExpensesPage} />
      <Route path="/reports" component={ReportsPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;

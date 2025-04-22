import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import CoursesPage from "@/pages/courses-page";
import StudentsPage from "@/pages/students-page-fixed";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";

// Import other pages as they are created
// import QuizzesPage from "@/pages/quizzes-page";
// import InstructorsPage from "@/pages/instructors-page";
// import ProjectsPage from "@/pages/projects-page";
// import TasksPage from "@/pages/tasks-page";
// import EmployeesPage from "@/pages/employees-page";
// import ClientsPage from "@/pages/clients-page";
// import PaymentsPage from "@/pages/payments-page";
// import ExpensesPage from "@/pages/expenses-page";
// import ReportsPage from "@/pages/reports-page";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* LMS Routes */}
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/courses" component={CoursesPage} />
      <ProtectedRoute path="/students" component={StudentsPage} />
      
      {/* These routes will be activated when their components are created */}
      {/* <ProtectedRoute path="/quizzes" component={QuizzesPage} /> */}
      {/* <ProtectedRoute path="/instructors" component={InstructorsPage} /> */}
      
      {/* Project Management Routes */}
      {/* <ProtectedRoute path="/projects" component={ProjectsPage} /> */}
      {/* <ProtectedRoute path="/tasks" component={TasksPage} /> */}
      {/* <ProtectedRoute path="/employees" component={EmployeesPage} /> */}
      {/* <ProtectedRoute path="/clients" component={ClientsPage} /> */}
      
      {/* Financial Routes */}
      {/* <ProtectedRoute path="/payments" component={PaymentsPage} /> */}
      {/* <ProtectedRoute path="/expenses" component={ExpensesPage} /> */}
      {/* <ProtectedRoute path="/reports" component={ReportsPage} /> */}
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

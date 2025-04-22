import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import TempAuthPage from "@/pages/temp-auth-page";
import Dashboard from "@/pages/dashboard";
import CoursesPage from "@/pages/courses-page";
import StudentsPage from "@/pages/students-page";

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
      <Route path="/auth" component={TempAuthPage} />
      
      {/* LMS Routes */}
      <Route path="/" component={Dashboard} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/students" component={StudentsPage} />
      
      {/* These routes will be activated when their components are created */}
      {/* <Route path="/quizzes" component={QuizzesPage} /> */}
      {/* <Route path="/instructors" component={InstructorsPage} /> */}
      
      {/* Project Management Routes */}
      {/* <Route path="/projects" component={ProjectsPage} /> */}
      {/* <Route path="/tasks" component={TasksPage} /> */}
      {/* <Route path="/employees" component={EmployeesPage} /> */}
      {/* <Route path="/clients" component={ClientsPage} /> */}
      
      {/* Financial Routes */}
      {/* <Route path="/payments" component={PaymentsPage} /> */}
      {/* <Route path="/expenses" component={ExpensesPage} /> */}
      {/* <Route path="/reports" component={ReportsPage} /> */}
      
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

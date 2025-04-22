import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import MainLayout from "@/components/layout/main-layout";
import TaskForm from "@/components/task/task-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare,
  Calendar,
  Clock,
  MoreHorizontal,
  Briefcase,
  FilePlus,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TasksPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");

  const { data: tasks, isLoading } = useQuery({
    queryKey: [user?.role === UserRole.EMPLOYEE ? `/api/employees/${user?.id}/tasks` : "/api/tasks"],
    enabled: !!user,
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/users?role=employee"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.PROJECT_MANAGER,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/tasks/${id}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Task updated",
        description: "The task status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${user?.id}/tasks`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const getTaskStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "assigned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "in-progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const canManageTasks = user && (user.role === UserRole.ADMIN || user.role === UserRole.PROJECT_MANAGER);

  const onCloseDialog = () => {
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    queryClient.invalidateQueries({ queryKey: [`/api/employees/${user?.id}/tasks`] });
  };

  // Sample data for the static view
  const sampleTasks = {
    todo: [
      {
        id: 1,
        title: "Design homepage mockup",
        project: "E-commerce Website",
        description: "Create responsive design mockups for the main landing page.",
        assignee: { name: "Michael Scott", initials: "MS" },
        dueDate: "Oct 12",
        status: "assigned",
        tag: "E-commerce Website"
      },
      {
        id: 2,
        title: "API integration for user auth",
        project: "Mobile App",
        description: "Implement OAuth2 authentication for the mobile application.",
        assignee: { name: "Jim Halpert", initials: "JH" },
        dueDate: "Oct 15",
        status: "assigned",
        tag: "Mobile App"
      }
    ],
    inProgress: [
      {
        id: 3,
        title: "Product listing page",
        project: "E-commerce Website",
        description: "Implement filtering and sorting functionality for product listings.",
        assignee: { name: "Pam Beesly", initials: "PB" },
        dueDate: "Oct 18",
        status: "in-progress",
        tag: "E-commerce Website"
      },
      {
        id: 4,
        title: "User profile screens",
        project: "Mobile App",
        description: "Design and implement user profile and settings screens.",
        assignee: { name: "Dwight Schrute", initials: "DS" },
        dueDate: "Oct 12",
        status: "in-progress",
        tag: "Mobile App"
      }
    ],
    completed: [
      {
        id: 5,
        title: "Project kickoff meeting",
        project: "E-commerce Website",
        description: "Initial meeting with client to discuss project scope and goals.",
        assignee: { name: "Andy Bernard", initials: "AB" },
        dueDate: "Completed Oct 5",
        status: "completed",
        tag: "E-commerce Website"
      },
      {
        id: 6,
        title: "Initial wireframes",
        project: "E-commerce Website",
        description: "Create wireframes for key pages based on client requirements.",
        assignee: { name: "Angela Martin", initials: "AM" },
        dueDate: "Completed Oct 8",
        status: "completed",
        tag: "E-commerce Website"
      }
    ]
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    updateTaskMutation.mutate({ id: taskId, status: newStatus });
  };

  return (
    <MainLayout module="projects">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">Tasks</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button 
                variant={viewMode === "list" ? "default" : "ghost"} 
                size="sm"
                className="rounded-none" 
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
              <Button 
                variant={viewMode === "kanban" ? "default" : "ghost"} 
                size="sm"
                className="rounded-none" 
                onClick={() => setViewMode("kanban")}
              >
                Kanban
              </Button>
            </div>
            {canManageTasks && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <FilePlus className="h-4 w-4" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm onSuccess={onCloseDialog} projects={projects} employees={employees} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Task Column: To Do */}
            <Card>
              <CardHeader className="pb-2 bg-gray-100 dark:bg-gray-800">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  To Do ({sampleTasks.todo.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {sampleTasks.todo.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {task.tag}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in-progress')}>
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                            Mark as Completed
                          </DropdownMenuItem>
                          {canManageTasks && (
                            <>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                Delete Task
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h4 className="text-sm font-medium mb-2">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-green-500 text-white text-xs">
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{task.assignee.name}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due {task.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
                {sampleTasks.todo.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No tasks to do</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Task Column: In Progress */}
            <Card>
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-primary">
                  <ArrowRight className="h-4 w-4" />
                  In Progress ({sampleTasks.inProgress.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {sampleTasks.inProgress.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-primary">
                    <div className="flex justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {task.tag}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'assigned')}>
                            Move to To Do
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                            Mark as Completed
                          </DropdownMenuItem>
                          {canManageTasks && (
                            <>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                Delete Task
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h4 className="text-sm font-medium mb-2">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-amber-500 text-white text-xs">
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{task.assignee.name}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        Due {task.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
                {sampleTasks.inProgress.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No tasks in progress</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Task Column: Completed */}
            <Card>
              <CardHeader className="pb-2 bg-green-50 dark:bg-green-950">
                <CardTitle className="text-base font-medium flex items-center gap-2 text-green-700 dark:text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  Completed ({sampleTasks.completed.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {sampleTasks.completed.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-success opacity-75">
                    <div className="flex justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {task.tag}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'assigned')}>
                            Move to To Do
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in-progress')}>
                            Move to In Progress
                          </DropdownMenuItem>
                          {canManageTasks && (
                            <>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                Delete Task
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h4 className="text-sm font-medium mb-2 line-through">{task.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-red-500 text-white text-xs">
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{task.assignee.name}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {task.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
                {sampleTasks.completed.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No completed tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Task</th>
                      <th className="text-left py-3 px-4">Project</th>
                      <th className="text-left py-3 px-4">Assignee</th>
                      <th className="text-left py-3 px-4">Due Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...sampleTasks.todo, ...sampleTasks.inProgress, ...sampleTasks.completed].map((task) => (
                      <tr key={task.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{task.description.substring(0, 40)}...</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{task.project}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary text-white text-xs">
                                {task.assignee.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="ml-2">{task.assignee.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{task.dueDate}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getTaskStatusColor(task.status)}>
                            {task.status === "assigned" ? "To Do" : 
                             task.status === "in-progress" ? "In Progress" : "Completed"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              {task.status !== "assigned" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'assigned')}>
                                  Move to To Do
                                </DropdownMenuItem>
                              )}
                              {task.status !== "in-progress" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in-progress')}>
                                  Move to In Progress
                                </DropdownMenuItem>
                              )}
                              {task.status !== "completed" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                                  Mark as Completed
                                </DropdownMenuItem>
                              )}
                              {canManageTasks && (
                                <>
                                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    Delete Task
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

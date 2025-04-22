import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import MainLayout from "@/components/layout/main-layout";
import ProjectForm from "@/components/project/project-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Briefcase, 
  Globe, 
  CalendarIcon, 
  ArrowUpRight, 
  PhoneIcon 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.PROJECT_MANAGER || user?.role === UserRole.EMPLOYEE,
  });

  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.PROJECT_MANAGER,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete project: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on schedule':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'at risk':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case 'delayed':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const canManageProjects = user && (user.role === UserRole.ADMIN || user.role === UserRole.PROJECT_MANAGER);

  const onCloseDialog = () => {
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
  };

  // Sample data for the static view
  const sampleProjects = [
    {
      id: 1,
      title: "E-commerce Website Redesign",
      projectId: "PRJ-2023-001",
      client: "Global Shop Inc.",
      clientType: "Retail",
      progress: 65,
      status: "On Schedule",
      deadline: "Nov 30, 2023"
    },
    {
      id: 2,
      title: "Mobile App Development",
      projectId: "PRJ-2023-002",
      client: "FitLife Solutions",
      clientType: "Health & Fitness",
      progress: 35,
      status: "At Risk",
      deadline: "Oct 15, 2023"
    },
    {
      id: 3,
      title: "CRM System Integration",
      projectId: "PRJ-2023-003",
      client: "TechCorp International",
      clientType: "Technology",
      progress: 80,
      status: "On Schedule",
      deadline: "Dec 20, 2023"
    }
  ];

  return (
    <MainLayout module="projects">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">Projects</h2>
          {canManageProjects && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <span className="material-icons text-sm">add</span>
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <ProjectForm onSuccess={onCloseDialog} clients={clients} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{project.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">ID: {project.projectId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-1 text-gray-500" />
                            <div>
                              <div className="text-sm">{project.client}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{project.clientType}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <Progress value={project.progress} className="h-2 mb-1" />
                            <div className="text-xs text-gray-500 dark:text-gray-400">{project.progress}% complete</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(project.status)}
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1 text-gray-500" />
                            {project.deadline}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            {canManageProjects && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary-dark mr-3"
                              >
                                Manage
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

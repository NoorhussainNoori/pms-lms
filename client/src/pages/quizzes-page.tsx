import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import MainLayout from "@/components/layout/main-layout";
import QuizForm from "@/components/quiz/quiz-form";
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
import { HelpCircle, FileQuestion, Check, AlertCircle, Eye } from "lucide-react";

export default function QuizzesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ["/api/quizzes"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/quizzes/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Quiz deleted",
        description: "The quiz has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete quiz: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      deleteMutation.mutate(id);
    }
  };

  const canManageQuizzes = user && (user.role === UserRole.ADMIN || user.role === UserRole.INSTRUCTOR);

  const onCloseDialog = () => {
    setIsDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
  };

  // Sample data for the static view
  const sampleQuizzes = [
    {
      id: 1,
      title: "HTML Basics Quiz",
      courseTitle: "Web Development Fundamentals",
      questionCount: 10,
      passScore: 70,
      status: "active"
    },
    {
      id: 2,
      title: "CSS Layouts Quiz",
      courseTitle: "Advanced Web Development",
      questionCount: 15,
      passScore: 75,
      status: "active"
    },
    {
      id: 3,
      title: "JavaScript Basics Quiz",
      courseTitle: "JavaScript Mastery",
      questionCount: 20,
      passScore: 70,
      status: "draft"
    }
  ];

  return (
    <MainLayout module="lms">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200">Quizzes</h2>
          {canManageQuizzes && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <span className="material-icons text-sm">add</span>
                  Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Quiz</DialogTitle>
                </DialogHeader>
                <QuizForm onSuccess={onCloseDialog} courses={courses} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quiz Management</CardTitle>
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
                      <TableHead>Quiz Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Pass Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleQuizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                              <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="font-medium">{quiz.title}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{quiz.courseTitle}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileQuestion className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{quiz.questionCount} questions</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Check className="h-4 w-4 mr-1 text-green-500" />
                            <span>{quiz.passScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              quiz.status === 'active' 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                            }
                          >
                            {quiz.status === 'active' ? 'Active' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-500 hover:text-primary mr-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canManageQuizzes && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-primary mr-2"
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-gray-500 hover:text-red-500"
                                  onClick={() => handleDelete(quiz.id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
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

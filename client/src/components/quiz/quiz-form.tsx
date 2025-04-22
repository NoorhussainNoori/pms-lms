import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const quizSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  courseId: z.string().min(1, { message: "Please select a course" }),
  contentId: z.string().optional(),
  questions: z.array(
    z.object({
      question: z.string().min(3, { message: "Question is required" }),
      type: z.enum(["multiple-choice", "true-false", "fill-in-blank"]),
      options: z.string().optional(),
      correctAnswer: z.string().min(1, { message: "Correct answer is required" }),
    })
  ).min(1, { message: "At least one question is required" }),
});

interface QuizFormProps {
  onSuccess: () => void;
  courses?: any[];
  quizToEdit?: any;
}

export default function QuizForm({ onSuccess, courses = [], quizToEdit }: QuizFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Sample for demonstration - in real implementation, this would come from course contents
  const courseContents = [
    { id: 1, title: "Introduction to HTML", courseId: 1 },
    { id: 2, title: "CSS Basics", courseId: 1 },
    { id: 3, title: "JavaScript Fundamentals", courseId: 1 },
    { id: 4, title: "Responsive Design", courseId: 2 },
  ];

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: quizToEdit?.title || "",
      courseId: quizToEdit?.courseId?.toString() || "",
      contentId: quizToEdit?.contentId?.toString() || "",
      questions: quizToEdit?.questions || [
        {
          question: "",
          type: "multiple-choice",
          options: "Option 1, Option 2, Option 3, Option 4",
          correctAnswer: "",
        },
      ],
    },
  });

  const { fields, append, remove } = form.control._formValues.questions;

  const quizMutation = useMutation({
    mutationFn: async (data: z.infer<typeof quizSchema>) => {
      const payload = {
        ...data,
        courseId: parseInt(data.courseId),
        contentId: data.contentId ? parseInt(data.contentId) : undefined,
        questions: data.questions.map((q, index) => ({
          ...q,
          order: index + 1,
        })),
      };
      
      if (quizToEdit) {
        await apiRequest("PUT", `/api/quizzes/${quizToEdit.id}`, payload);
      } else {
        await apiRequest("POST", "/api/quizzes", payload);
      }
    },
    onSuccess: () => {
      toast({
        title: quizToEdit ? "Quiz updated" : "Quiz created",
        description: quizToEdit
          ? "The quiz has been updated successfully"
          : "New quiz has been created successfully",
      });
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${quizToEdit ? "update" : "create"} quiz: ${error.message}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof quizSchema>) {
    setIsSubmitting(true);
    quizMutation.mutate(values);
  }

  function addQuestion() {
    const questions = form.getValues("questions") || [];
    form.setValue("questions", [
      ...questions,
      {
        question: "",
        type: "multiple-choice",
        options: "Option 1, Option 2, Option 3, Option 4",
        correctAnswer: "",
      },
    ]);
  }

  function removeQuestion(index: number) {
    const questions = form.getValues("questions") || [];
    if (questions.length > 1) {
      form.setValue("questions", questions.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Cannot remove question",
        description: "A quiz must have at least one question",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Content (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Associate with content (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None (General Quiz)</SelectItem>
                      {courseContents
                        .filter(content => !form.getValues("courseId") || content.courseId.toString() === form.getValues("courseId"))
                        .map((content) => (
                          <SelectItem key={content.id} value={content.id.toString()}>
                            {content.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optionally associate this quiz with specific course content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <Button type="button" onClick={() => setActiveTab("questions")}>
                Continue to Questions
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-6 pt-4">
            {form.getValues("questions")?.map((question, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between">
                    <span>Question {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      className="h-7 px-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`questions.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Text</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your question" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`questions.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select question type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                            <SelectItem value="fill-in-blank">Fill in the Blank</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch(`questions.${index}.type`) === "multiple-choice" && (
                    <FormField
                      control={form.control}
                      name={`questions.${index}.options`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer Options</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Option 1, Option 2, Option 3, Option 4" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter options separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name={`questions.${index}.correctAnswer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correct Answer</FormLabel>
                        {form.watch(`questions.${index}.type`) === "multiple-choice" ? (
                          <FormControl>
                            <Input 
                              placeholder="Enter the correct option" 
                              {...field} 
                            />
                          </FormControl>
                        ) : form.watch(`questions.${index}.type`) === "true-false" ? (
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id={`true-${index}`} />
                              <Label htmlFor={`true-${index}`}>True</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id={`false-${index}`} />
                              <Label htmlFor={`false-${index}`}>False</Label>
                            </div>
                          </RadioGroup>
                        ) : (
                          <FormControl>
                            <Input 
                              placeholder="Enter the correct answer" 
                              {...field} 
                            />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addQuestion}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Question
            </Button>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("basic")}
              >
                Back to Basic Info
              </Button>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {quizToEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  quizToEdit ? "Update Quiz" : "Create Quiz"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

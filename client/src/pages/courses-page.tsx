import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeftRight, Book, Edit, FileText, Loader2, Plus, Trash, User } from "lucide-react";

// Mock data for development
const COURSES = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript basics for web development.",
    fee: 99.99,
    enrolledStudents: 24,
    materials: 12,
    quizzes: 5
  },
  {
    id: 2,
    title: "Advanced React & Redux",
    description: "Master modern React.js with Redux state management.",
    fee: 129.99,
    enrolledStudents: 18,
    materials: 15,
    quizzes: 8
  },
  {
    id: 3,
    title: "Full Stack Development",
    description: "Build complete web applications with front-end and back-end technologies.",
    fee: 149.99,
    enrolledStudents: 15,
    materials: 20,
    quizzes: 10
  },
  {
    id: 4,
    title: "UX/UI Design Principles",
    description: "Learn design thinking and create user-friendly interfaces.",
    fee: 89.99,
    enrolledStudents: 30,
    materials: 18,
    quizzes: 6
  }
];

// Form schema for adding/editing courses
const courseSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  fee: z.coerce.number().positive({
    message: "Fee must be a positive number",
  }),
});

type CourseFormValues = z.infer<typeof courseSchema>;

import MainLayout from "../components/layout/main-layout";

export default function CoursesPage() {
  const [courses, setCourses] = useState(COURSES);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<typeof COURSES[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fee: 0,
    },
  });

  function resetForm() {
    form.reset({
      title: "",
      description: "",
      fee: 0,
    });
    setEditingCourse(null);
  }

  function onSubmit(values: CourseFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingCourse) {
        // Update existing course
        setCourses(courses.map(course => 
          course.id === editingCourse.id 
            ? { ...course, ...values } 
            : course
        ));
      } else {
        // Add new course
        const newCourse = {
          id: courses.length + 1,
          ...values,
          enrolledStudents: 0,
          materials: 0,
          quizzes: 0
        };
        setCourses([...courses, newCourse]);
      }
      
      setIsSubmitting(false);
      setIsAddingCourse(false);
      resetForm();
    }, 1000);
  }

  function handleEditCourse(course: typeof COURSES[0]) {
    form.reset({
      title: course.title,
      description: course.description,
      fee: course.fee,
    });
    setEditingCourse(course);
    setIsAddingCourse(true);
  }

  function handleDeleteCourse(courseId: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Manage your educational courses and materials</p>
          </div>
          <Dialog open={isAddingCourse} onOpenChange={setIsAddingCourse}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                <DialogDescription>
                  {editingCourse 
                    ? 'Edit the details of the existing course.' 
                    : 'Fill out the form below to create a new course.'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Web Development Fundamentals" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a detailed description of the course" 
                            className="h-24" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Fee ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="99.99" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      setIsAddingCourse(false);
                      resetForm();
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingCourse ? 'Saving...' : 'Creating...'}
                        </>
                      ) : (
                        editingCourse ? 'Save Changes' : 'Create Course'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="bg-muted">
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>${course.fee.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">{course.description}</p>
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{course.enrolledStudents} students</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{course.materials} materials</span>
                  </div>
                  <div className="flex items-center">
                    <Book className="h-4 w-4 mr-1" />
                    <span>{course.quizzes} quizzes</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
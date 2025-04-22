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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().optional(),
  fee: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Fee must be a positive number",
  }),
  instructorId: z.number().optional(),
});

interface CourseFormProps {
  onSuccess: () => void;
  instructors?: any[];
  courseToEdit?: any;
}

export default function CourseForm({ onSuccess, instructors = [], courseToEdit }: CourseFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: courseToEdit?.title || "",
      description: courseToEdit?.description || "",
      fee: courseToEdit?.fee ? courseToEdit.fee.toString() : "",
      instructorId: courseToEdit?.instructorId || undefined,
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof courseSchema>) => {
      const payload = {
        ...data,
        fee: parseFloat(data.fee),
        instructorId: data.instructorId || (user?.role === UserRole.INSTRUCTOR ? user.id : undefined),
      };
      
      if (courseToEdit) {
        await apiRequest("PUT", `/api/courses/${courseToEdit.id}`, payload);
      } else {
        await apiRequest("POST", "/api/courses", payload);
      }
    },
    onSuccess: () => {
      toast({
        title: courseToEdit ? "Course updated" : "Course created",
        description: courseToEdit
          ? "The course has been updated successfully"
          : "New course has been created successfully",
      });
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${courseToEdit ? "update" : "create"} course: ${error.message}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof courseSchema>) {
    setIsSubmitting(true);
    createCourseMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title" {...field} />
              </FormControl>
              <FormDescription>
                The name of the course as it will appear to students
              </FormDescription>
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
                  placeholder="Enter course description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A brief description of what students will learn
              </FormDescription>
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
                <Input placeholder="99.99" {...field} />
              </FormControl>
              <FormDescription>
                The monthly subscription fee for this course
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {user?.role === UserRole.ADMIN && instructors && instructors.length > 0 && (
          <FormField
            control={form.control}
            name="instructorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an instructor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id.toString()}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Assign an instructor to this course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {courseToEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            courseToEdit ? "Update Course" : "Create Course"
          )}
        </Button>
      </form>
    </Form>
  );
}

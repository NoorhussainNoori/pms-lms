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
import { Loader2 } from "lucide-react";

const studentSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  courseId: z.string().min(1, { message: "Please select a course" }),
  paymentStatus: z.enum(["completed", "pending", "partial"]),
  amountPaid: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Amount must be a positive number",
  }),
});

interface StudentFormProps {
  onSuccess: () => void;
  courses?: any[];
  studentToEdit?: any;
}

export default function StudentForm({ onSuccess, courses = [], studentToEdit }: StudentFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: studentToEdit?.name || "",
      email: studentToEdit?.email || "",
      courseId: studentToEdit?.courseId?.toString() || "",
      paymentStatus: studentToEdit?.paymentStatus || "pending",
      amountPaid: studentToEdit?.amountPaid?.toString() || "0",
    },
  });

  const studentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof studentSchema>) => {
      // First create/register the student as a user
      const registerData = {
        name: data.name,
        email: data.email,
        username: data.email.split('@')[0], // Simple username generation
        password: "password123", // Default password that should be changed
        role: UserRole.STUDENT,
      };
      
      const userResponse = await apiRequest("POST", "/api/register", registerData);
      const userData = await userResponse.json();
      
      // Then create the enrollment
      const enrollmentData = {
        studentId: userData.id,
        courseId: parseInt(data.courseId),
        paymentStatus: data.paymentStatus,
        amountPaid: parseFloat(data.amountPaid),
        enrollmentDate: new Date().toISOString(),
      };
      
      await apiRequest("POST", "/api/enrollments", enrollmentData);
    },
    onSuccess: () => {
      toast({
        title: studentToEdit ? "Student updated" : "Student added",
        description: studentToEdit
          ? "The student information has been updated successfully"
          : "New student has been added and enrolled successfully",
      });
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users?role=student"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${studentToEdit ? "update" : "add"} student: ${error.message}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof studentSchema>) {
    setIsSubmitting(true);
    studentMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter student name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" type="email" {...field} />
              </FormControl>
              <FormDescription>
                This will also be used as the login username
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Course</FormLabel>
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
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amountPaid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid ($)</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {studentToEdit ? "Updating..." : "Adding..."}
            </>
          ) : (
            studentToEdit ? "Update Student" : "Add Student"
          )}
        </Button>
      </form>
    </Form>
  );
}

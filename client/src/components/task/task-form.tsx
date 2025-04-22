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

const taskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().optional(),
  projectId: z.string().min(1, { message: "Please select a project" }),
  milestoneId: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum(["assigned", "in-progress", "completed"]),
  dueDate: z.string().min(1, { message: "Due date is required" }),
});

interface TaskFormProps {
  onSuccess: () => void;
  projects?: any[];
  employees?: any[];
  taskToEdit?: any;
}

export default function TaskForm({ onSuccess, projects = [], employees = [], taskToEdit }: TaskFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sample for demonstration - in real implementation, this would come from API
  const milestones = [
    { id: 1, title: "Design Phase", projectId: 1 },
    { id: 2, title: "Development Phase", projectId: 1 },
    { id: 3, title: "Testing Phase", projectId: 1 },
    { id: 4, title: "Launch", projectId: 1 },
    { id: 5, title: "Initial Research", projectId: 2 },
    { id: 6, title: "Development", projectId: 2 },
  ];

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      projectId: taskToEdit?.projectId?.toString() || "",
      milestoneId: taskToEdit?.milestoneId?.toString() || "",
      assignedTo: taskToEdit?.assignedTo?.toString() || "",
      status: taskToEdit?.status || "assigned",
      dueDate: taskToEdit?.dueDate ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10) : "",
    },
  });

  const taskMutation = useMutation({
    mutationFn: async (data: z.infer<typeof taskSchema>) => {
      const payload = {
        ...data,
        projectId: parseInt(data.projectId),
        milestoneId: data.milestoneId ? parseInt(data.milestoneId) : undefined,
        assignedTo: data.assignedTo ? parseInt(data.assignedTo) : undefined,
        dueDate: new Date(data.dueDate).toISOString(),
      };
      
      if (taskToEdit) {
        await apiRequest("PUT", `/api/tasks/${taskToEdit.id}`, payload);
      } else {
        await apiRequest("POST", "/api/tasks", payload);
      }
    },
    onSuccess: () => {
      toast({
        title: taskToEdit ? "Task updated" : "Task created",
        description: taskToEdit
          ? "The task has been updated successfully"
          : "New task has been created successfully",
      });
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${taskToEdit ? "update" : "create"} task: ${error.message}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof taskSchema>) {
    setIsSubmitting(true);
    taskMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
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
                  placeholder="Enter task description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.title}
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
          name="milestoneId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Milestone (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a milestone (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {milestones
                    .filter(milestone => !form.getValues("projectId") || milestone.projectId.toString() === form.getValues("projectId"))
                    .map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id.toString()}>
                        {milestone.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Optionally associate this task with a project milestone
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign To</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
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
                    <SelectItem value="assigned">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
              {taskToEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            taskToEdit ? "Update Task" : "Create Task"
          )}
        </Button>
      </form>
    </Form>
  );
}

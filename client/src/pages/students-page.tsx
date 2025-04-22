import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, Loader2, MoreHorizontal, Plus, Search, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MainLayout from "../components/layout/main-layout";

// Mock student data for development
const STUDENTS = [
  {
    id: 1,
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
    enrollmentDate: "2023-09-15",
    status: "active",
    enrolledCourses: 2
  },
  {
    id: 2,
    name: "Liam Wilson",
    email: "liam.wilson@example.com",
    enrollmentDate: "2023-10-02",
    status: "active",
    enrolledCourses: 1
  },
  {
    id: 3,
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    enrollmentDate: "2023-08-20",
    status: "inactive",
    enrolledCourses: 0
  },
  {
    id: 4,
    name: "Noah Thompson",
    email: "noah.thompson@example.com",
    enrollmentDate: "2023-09-28",
    status: "active",
    enrolledCourses: 3
  },
  {
    id: 5,
    name: "Ava Garcia",
    email: "ava.garcia@example.com",
    enrollmentDate: "2023-07-12",
    status: "active",
    enrolledCourses: 2
  },
  {
    id: 6,
    name: "William Brown",
    email: "william.brown@example.com",
    enrollmentDate: "2023-10-10",
    status: "active",
    enrolledCourses: 1
  },
  {
    id: 7,
    name: "Sophia Davis",
    email: "sophia.davis@example.com",
    enrollmentDate: "2023-06-15",
    status: "inactive",
    enrolledCourses: 0
  },
  {
    id: 8,
    name: "James Miller",
    email: "james.miller@example.com",
    enrollmentDate: "2023-09-05",
    status: "active",
    enrolledCourses: 2
  }
];

// Form schema for student registration
const studentSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  status: z.enum(["active", "inactive"]),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function StudentsPage() {
  const [students, setStudents] = useState(STUDENTS);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtered students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Summary stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "active").length;
  const inactiveStudents = students.filter(s => s.status === "inactive").length;
  const totalEnrollments = students.reduce((sum, student) => sum + student.enrolledCourses, 0);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      status: "active",
    },
  });

  function onSubmit(values: StudentFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newStudent = {
        id: students.length + 1,
        ...values,
        enrollmentDate: new Date().toISOString().split('T')[0],
        enrolledCourses: 0
      };
      
      setStudents([...students, newStudent]);
      setIsSubmitting(false);
      setIsAddingStudent(false);
      form.reset();
    }, 1000);
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">
              Manage student accounts and enrollments
            </p>
          </div>
        
        <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Register a new student to the system. They can be enrolled in courses later.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Smith" {...field} />
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
                        <Input placeholder="john.smith@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsAddingStudent(false);
                    form.reset();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register Student"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Students table */}
      <div className="bg-card rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No students found. Try a different search or add a new student.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.enrollmentDate}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "active" ? "default" : "secondary"} className={student.status === "active" ? "bg-green-100 text-green-800" : ""}>
                      {student.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.enrolledCourses}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="mr-2 h-4 w-4" /> Enroll in Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
    </MainLayout>
  );
}
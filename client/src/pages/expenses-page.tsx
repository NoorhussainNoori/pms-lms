import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@shared/schema";
import MainLayout from "@/components/layout/main-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  PieChart, 
  ArrowUpRight, 
  Receipt, 
  DollarSign, 
  Calendar,
  Search,
  Download,
  Plus,
  Tag,
  FileText
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const expenseSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(2, { message: "Category is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().optional(),
});

export default function ExpensesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newCategory, setNewCategory] = useState("");

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof expenseSchema>) => {
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
        date: new Date(data.date).toISOString(),
      };
      await apiRequest("POST", "/api/expenses", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense has been recorded successfully",
      });
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record expense: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const canManageExpenses = user && (user.role === UserRole.ADMIN || user.role === UserRole.FINANCE);

  function onSubmit(values: z.infer<typeof expenseSchema>) {
    createExpenseMutation.mutate(values);
  }

  function addCategory() {
    if (newCategory.trim() !== "") {
      toast({
        title: "Success",
        description: `Category "${newCategory}" has been added`,
      });
      setIsAddCategoryOpen(false);
      setNewCategory("");
    } else {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
    }
  }

  // Sample data for the static view
  const categories = [
    "Operating Expense",
    "Payroll",
    "Technology",
    "Marketing",
    "Utilities",
    "Rent",
    "Office Supplies",
    "Travel",
    "Training"
  ];

  const sampleExpenses = [
    {
      id: 1,
      title: "Office Supplies",
      amount: 423.45,
      category: "Operating Expense",
      date: "2023-10-08",
      description: "Paper, pens, and other office supplies"
    },
    {
      id: 2,
      title: "Instructor Salaries",
      amount: 5842.30,
      category: "Payroll",
      date: "2023-10-05",
      description: "Monthly salaries for 3 instructors"
    },
    {
      id: 3,
      title: "Software Subscriptions",
      amount: 1256.99,
      category: "Technology",
      date: "2023-10-01",
      description: "Monthly SaaS subscriptions for design and development tools"
    },
    {
      id: 4,
      title: "Digital Advertising",
      amount: 750.00,
      category: "Marketing",
      date: "2023-09-28",
      description: "Facebook and Google Ads for course promotions"
    },
    {
      id: 5,
      title: "Electricity Bill",
      amount: 342.67,
      category: "Utilities",
      date: "2023-09-25",
      description: "Monthly electricity bill for office space"
    }
  ];

  const filteredExpenses = sampleExpenses
    .filter(expense => {
      // Filter by search term
      const matchSearch = 
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      if (categoryFilter !== "all") {
        return matchSearch && expense.category === categoryFilter;
      }
      
      return matchSearch;
    });

  // Calculate total expenses
  const totalExpenses = sampleExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by category for chart
  const expensesByCategory = {};
  sampleExpenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });

  // Calculate top expense category
  let topCategory = { name: "", amount: 0 };
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    if (amount > topCategory.amount) {
      topCategory = { name: category, amount: amount as number };
    }
  });

  return (
    <MainLayout module="finance">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-6">Expenses</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
                  <p className="text-2xl font-medium">${totalExpenses.toFixed(2)}</p>
                  <p className="text-xs text-error flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>8% increase from last month</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Top Expense Category</p>
                  <p className="text-2xl font-medium">{topCategory.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ${topCategory.amount.toFixed(2)} ({(topCategory.amount / totalExpenses * 100).toFixed(0)}% of total)
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">This Month's Expenses</p>
                  <p className="text-2xl font-medium">
                    ${sampleExpenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth())
                      .reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-error flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>5% increase from last month</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Distribution of expenses across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <PieChart className="h-16 w-16 mx-auto mb-2" />
                  <p>Expense Breakdown Chart</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Displaying expenses by category</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Expense Details</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search expenses..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            {canManageExpenses && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Record New Expense</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expense Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter expense title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount ($)</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <div className="flex space-x-2">
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsAddCategoryOpen(true)}
                                className="flex-shrink-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
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
                              <Input placeholder="Enter description (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={createExpenseMutation.isPending}>
                          {createExpenseMutation.isPending ? "Saving..." : "Save Expense"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="font-medium">{expense.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-red-600 dark:text-red-400 font-medium">
                        -${expense.amount.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {expense.description}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Search className="h-10 w-10 mb-2" />
                        <p>No expenses found</p>
                        <p className="text-sm">Try adjusting your search terms or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Category Name
              </Label>
              <Input
                id="name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={addCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

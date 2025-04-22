import { useState } from "react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@shared/schema";

export default function TempAuthPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple demo login with timeout to simulate API call
    setTimeout(() => {
      localStorage.setItem("demoUser", JSON.stringify({
        id: 1,
        username,
        name: "Demo User",
        email: "demo@example.com",
        role: UserRole.ADMIN
      }));
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 1000);
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Left side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter any credentials to access the demo application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Enter any username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter any password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !username || !password}
              >
                {isLoading ? "Logging in..." : "Login to Demo"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              This is a demo application. Any username and password will work.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side - Hero section */}
      <div className="hidden lg:flex lg:flex-1 bg-primary p-10 text-white items-center justify-center">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-4">Learning & Project Management System</h1>
          <p className="text-lg mb-6">
            An all-in-one platform for educational institutions and project teams to manage courses, 
            projects, and finances efficiently.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="material-icons mt-0.5">school</span>
              <div>
                <h3 className="text-lg font-semibold">Learning Management</h3>
                <p>Create and manage courses, track student progress, and automate quizzes.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-icons mt-0.5">work</span>
              <div>
                <h3 className="text-lg font-semibold">Project Management</h3>
                <p>Plan projects, assign tasks, and monitor progress for effective collaboration.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="material-icons mt-0.5">payments</span>
              <div>
                <h3 className="text-lg font-semibold">Financial Tracking</h3>
                <p>Keep track of payments, income, and expenses all in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
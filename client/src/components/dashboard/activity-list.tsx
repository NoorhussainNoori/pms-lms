import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string | number;
  title: string;
  description: string;
  date: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  avatarText?: string;
}

interface ActivityListProps {
  title: string;
  items: ActivityItem[];
  emptyMessage?: string;
  viewAllUrl?: string;
  isLoading?: boolean;
}

export default function ActivityList({
  title,
  items,
  emptyMessage = "No items to display",
  viewAllUrl,
  isLoading = false,
}: ActivityListProps) {
  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader className="border-b flex justify-between items-center py-4">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {viewAllUrl && (
          <Button variant="link" size="sm" className="text-primary">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <ul>
            {items.map((item, index) => (
              <li 
                key={item.id} 
                className={cn(
                  "flex items-center py-3 px-4",
                  index !== items.length - 1 && "border-b"
                )}
              >
                <div className="flex items-center flex-1">
                  <Avatar className="w-8 h-8 mr-3 bg-gray-200">
                    <AvatarFallback className="text-sm text-gray-500">
                      {item.avatarText || (item.title[0] + (item.title.split(' ')[1]?.[0] || ''))}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status && (
                    <Badge variant="outline" className={getStatusClass(item.status)}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  )}
                  <div className="text-xs text-gray-500">{item.date}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

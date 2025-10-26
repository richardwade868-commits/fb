import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Pin, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { ROUTES } from "@shared/const";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to RecipeAutoPub. Monitor your publishing queue and statistics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ready to publish</p>
          </CardContent>
        </Card>

        {/* Pending Pins */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pins</CardTitle>
            <Pin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Awaiting upload</p>
          </CardContent>
        </Card>

        {/* Published Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Posts and pins</p>
          </CardContent>
        </Card>

        {/* Total Published */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Published</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started by setting up your publishing workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setLocation(ROUTES.WEBSITES)}
            variant="outline"
            className="justify-start"
          >
            <Globe className="mr-2 h-4 w-4" />
            Add Websites
          </Button>
          <Button
            onClick={() => setLocation(ROUTES.PINTEREST)}
            variant="outline"
            className="justify-start"
          >
            <Pin className="mr-2 h-4 w-4" />
            Connect Pinterest
          </Button>
          <Button
            onClick={() => setLocation(ROUTES.ADD_TITLES)}
            variant="outline"
            className="justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            Add Blog Titles
          </Button>
        </CardContent>
      </Card>

      {/* Publishing Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Queue</CardTitle>
          <CardDescription>
            No posts in queue. Add blog titles to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              Your publishing queue is empty
            </p>
            <Button onClick={() => setLocation(ROUTES.ADD_TITLES)}>
              Add Blog Titles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import missing icon
import { Globe } from "lucide-react";


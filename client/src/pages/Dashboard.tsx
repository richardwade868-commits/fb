import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

interface DashboardStats {
  totalPublished: number;
  totalGenerated: number;
  totalFailed: number;
  successRate: number;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const statsQuery = trpc.settings.getDashboardStats.useQuery();

  useEffect(() => {
    if (statsQuery.data?.stats) {
      setStats(statsQuery.data.stats);
    }
  }, [statsQuery.data]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to RecipeAutoPub - Your automated content publishing platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {statsQuery.isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    stats?.totalPublished || 0
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">posts & pins</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {statsQuery.isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    stats?.totalGenerated || 0
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">by AI</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {statsQuery.isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    `${stats?.successRate || 0}%`
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">success</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">
                  {statsQuery.isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    stats?.totalFailed || 0
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-1">items</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with your content publishing workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => navigate("/add-titles")}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Add Blog Titles
            </Button>
            <Button
              onClick={() => navigate("/websites")}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage WordPress Sites
            </Button>
            <Button
              onClick={() => navigate("/pinterest")}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Connect Pinterest
            </Button>
            <Button
              onClick={() => navigate("/settings")}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Configure Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">Add Blog Titles</p>
              <p>Enter recipe blog post titles or upload a CSV file</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">AI Generates Content</p>
              <p>Gemini AI creates full blog posts with recipes and ingredients</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Auto-Publish</p>
              <p>Posts are automatically published to WordPress and Pinterest</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              4
            </div>
            <div>
              <p className="font-medium text-foreground">Track & Monitor</p>
              <p>Monitor publishing status and view activity logs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

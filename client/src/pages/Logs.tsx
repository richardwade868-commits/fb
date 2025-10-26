import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { CheckCircle, AlertCircle, Clock, Download, Loader2 } from "lucide-react";

export default function Logs() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const logsQuery = trpc.settings.getActivityLogs.useQuery({ limit: 100 });

  const getStatusIcon = (status: string | null) => {
    return status === "success" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusColor = (status: string | null) => {
    return status === "success"
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
  };

  const filteredLogs = logsQuery.data?.logs?.filter((log) => {
    const matchesFilter = filter === "all" || log.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.message ? log.message.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    return matchesFilter && matchesSearch;
  }) || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground">
          View all publishing activities and status updates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search</label>
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {logsQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredLogs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>{filteredLogs.length} activities found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      Action
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{log.action}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-xs">{log.resourceType}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              log.status
                            )}`}
                          >
                            {log.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                        {log.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No activity logs yet</p>
            <p className="text-sm text-muted-foreground">
              Your publishing activities will appear here once you start using RecipeAutoPub
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {logsQuery.isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                logsQuery.data?.logs?.length || 0
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {logsQuery.isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                logsQuery.data?.logs?.filter((l) => l.status === "success").length || 0
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {logsQuery.isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                logsQuery.data?.logs?.filter((l) => l.status === "failure").length || 0
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

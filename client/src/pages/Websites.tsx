import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Globe, Plus, Loader2, CheckCircle, Trash2 } from "lucide-react";

interface FormData {
  name: string;
  url: string;
  username: string;
  appPassword: string;
}

export default function Websites() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    url: "",
    username: "",
    appPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const sitesQuery = trpc.websites.getWordPressSites.useQuery();
  const addSiteMutation = trpc.websites.addWordPressSite.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.url || !formData.username || !formData.appPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await addSiteMutation.mutateAsync({
        name: formData.name,
        url: formData.url,
        username: formData.username,
        appPassword: formData.appPassword,
      });

      toast.success("WordPress site added successfully!");
      setFormData({ name: "", url: "", username: "", appPassword: "" });
      setShowForm(false);
      sitesQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add site");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">WordPress Sites</h1>
        <p className="text-muted-foreground">
          Manage your WordPress sites for automated publishing
        </p>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add WordPress Site</CardTitle>
            <CardDescription>
              Connect your WordPress site for automated publishing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Site Name</label>
              <Input
                name="name"
                placeholder="My Recipe Blog"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Site URL</label>
              <Input
                name="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Username</label>
              <Input
                name="username"
                placeholder="admin"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">App Password</label>
              <Input
                name="appPassword"
                type="password"
                placeholder="Enter your WordPress app password"
                value={formData.appPassword}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Generate this in WordPress: Settings → App Passwords
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Site"
                )}
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add WordPress Site
        </Button>
      )}

      {sitesQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sitesQuery.data && sitesQuery.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sitesQuery.data.map((site) => (
            <Card key={site.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <CardDescription className="text-xs">{site.url}</CardDescription>
                    </div>
                  </div>
                  {site.isActive && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900">
                      <CheckCircle className="h-3 w-3 text-green-700 dark:text-green-300" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">
                        Active
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-muted-foreground">Username: {site.username}</p>
                  {site.lastSyncedAt && (
                    <p className="text-muted-foreground">
                      Last synced: {new Date(site.lastSyncedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-12 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No WordPress sites added yet</p>
            <Button onClick={() => setShowForm(true)}>Add Your First Site</Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How to Get App Password</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. Log in to your WordPress admin dashboard</p>
          <p>2. Go to Users → Your Profile</p>
          <p>3. Scroll down to "Application Passwords"</p>
          <p>4. Enter an app name (e.g., "RecipeAutoPub")</p>
          <p>5. Click "Generate Application Password"</p>
          <p>6. Copy the generated password and paste it above</p>
        </CardContent>
      </Card>
    </div>
  );
}

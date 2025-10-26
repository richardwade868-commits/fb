import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Globe } from "lucide-react";

interface Website {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export default function Websites() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    username: "",
    appPassword: "",
  });

  const handleAddWebsite = () => {
    if (!formData.name || !formData.url) {
      toast.error("Please fill in all fields");
      return;
    }

    const newWebsite: Website = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      isActive: true,
    };

    setWebsites([...websites, newWebsite]);
    setFormData({ name: "", url: "", username: "", appPassword: "" });
    setShowForm(false);
    toast.success("Website added");
  };

  const handleRemoveWebsite = (id: string) => {
    setWebsites(websites.filter((w) => w.id !== id));
    toast.success("Website removed");
  };

  const handleToggleActive = (id: string) => {
    setWebsites(
      websites.map((w) =>
        w.id === id ? { ...w, isActive: !w.isActive } : w
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">WordPress Sites</h1>
        <p className="text-muted-foreground">
          Manage your WordPress websites for automated publishing
        </p>
      </div>

      {/* Add Website Form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add WordPress Website</CardTitle>
            <CardDescription>
              Enter your WordPress site credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Site Name
                </label>
                <Input
                  placeholder="My Recipe Blog"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Site URL
                </label>
                <Input
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Username
                </label>
                <Input
                  placeholder="admin"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  App Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter app password"
                  value={formData.appPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, appPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddWebsite} className="flex-1">
                Add Website
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: "", url: "", username: "", appPassword: "" });
                }}
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

      {/* Websites List */}
      {websites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {websites.map((website) => (
            <Card key={website.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-accent" />
                    <div>
                      <CardTitle className="text-lg">{website.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {website.url}
                      </CardDescription>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      website.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {website.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleToggleActive(website.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {website.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleRemoveWebsite(website.id)}
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-12 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              No WordPress sites added yet
            </p>
            <Button onClick={() => setShowForm(true)}>
              Add Your First Site
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How to Get App Password</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            1. Log in to your WordPress site as an administrator
          </p>
          <p>
            2. Go to Users → Your Profile
          </p>
          <p>
            3. Scroll down to "Application Passwords"
          </p>
          <p>
            4. Enter "RecipeAutoPub" as the application name and click "Create Application Password"
          </p>
          <p>
            5. Copy the generated password and paste it above
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


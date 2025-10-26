import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Plus, Upload, Loader2 } from "lucide-react";

export default function AddTitles() {
  const [titles, setTitles] = useState<string[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sitesQuery = trpc.websites.getWordPressSites.useQuery();
  const addTitlesMutation = trpc.content.addTitlesToQueue.useMutation();

  const handleAddTitle = () => {
    if (!currentTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (titles.includes(currentTitle)) {
      toast.error("This title already exists");
      return;
    }

    setTitles([...titles, currentTitle]);
    setCurrentTitle("");
    toast.success("Title added");
  };

  const handleRemoveTitle = (index: number) => {
    setTitles(titles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedSiteId) {
      toast.error("Please select a WordPress site");
      return;
    }

    if (titles.length === 0) {
      toast.error("Please add at least one title");
      return;
    }

    setIsLoading(true);
    try {
      await addTitlesMutation.mutateAsync({
        titles,
        wordpressSiteId: selectedSiteId,
      });

      toast.success(`${titles.length} titles added to queue!`);
      setTitles([]);
      setSelectedSiteId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add titles");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteCSV = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const newTitles = text
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && !titles.includes(t));

    setTitles([...titles, ...newTitles]);
    toast.success(`${newTitles.length} titles pasted`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Add Blog Titles</h1>
        <p className="text-muted-foreground">
          Add recipe blog post titles to generate content automatically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Titles</CardTitle>
              <CardDescription>
                Enter titles one by one or paste multiple titles separated by newlines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Easy Chocolate Chip Cookies Recipe"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTitle()}
                />
                <Button onClick={handleAddTitle} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <textarea
                placeholder="Paste multiple titles (one per line)..."
                className="w-full h-32 px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onPaste={handlePasteCSV}
              />
            </CardContent>
          </Card>

          {titles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Added Titles ({titles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {titles.map((title, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <p className="text-sm text-foreground">{title}</p>
                      <Button
                        onClick={() => handleRemoveTitle(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select WordPress Site</CardTitle>
              <CardDescription>
                Choose which site to publish to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sitesQuery.isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : sitesQuery.data && sitesQuery.data.length > 0 ? (
                <>
                  {sitesQuery.data.map((site) => (
                    <button
                      key={site.id}
                      onClick={() => setSelectedSiteId(site.id)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                        selectedSiteId === site.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <p className="font-medium text-sm">{site.name}</p>
                      <p className="text-xs text-muted-foreground">{site.url}</p>
                    </button>
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No WordPress sites configured. Go to Websites section to add one.
                </p>
              )}
            </CardContent>
          </Card>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || titles.length === 0 || !selectedSiteId}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Add {titles.length} Titles to Queue
              </>
            )}
          </Button>

          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs">Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>✓ Titles will be queued for content generation</p>
              <p>✓ AI will create full blog posts with recipes</p>
              <p>✓ Posts will be automatically published</p>
              <p>✓ Check Activity Logs for status updates</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

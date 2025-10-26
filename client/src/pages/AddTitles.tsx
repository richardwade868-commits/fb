import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, Plus, Trash2 } from "lucide-react";

export default function AddTitles() {
  const [titles, setTitles] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [showBulkInput, setShowBulkInput] = useState(false);

  const addTitle = () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (titles.includes(newTitle.trim())) {
      toast.error("This title already exists");
      return;
    }
    setTitles([...titles, newTitle.trim()]);
    setNewTitle("");
    toast.success("Title added");
  };

  const removeTitle = (index: number) => {
    setTitles(titles.filter((_, i) => i !== index));
    toast.success("Title removed");
  };

  const handleBulkAdd = () => {
    const newTitles = bulkText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t && !titles.includes(t));

    if (newTitles.length === 0) {
      toast.error("No new titles to add");
      return;
    }

    setTitles([...titles, ...newTitles]);
    setBulkText("");
    setShowBulkInput(false);
    toast.success(`Added ${newTitles.length} titles`);
  };

  const handleSubmit = async () => {
    if (titles.length === 0) {
      toast.error("Please add at least one title");
      return;
    }

    try {
      // TODO: Implement actual submission to backend
      toast.info("Publishing queue feature coming soon");
      console.log("Submitting titles:", titles);
    } catch (error) {
      toast.error("Failed to add titles");
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Add Blog Titles</h1>
        <p className="text-muted-foreground">
          Add blog post titles for AI to generate recipes and content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Single Title Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Single Title</CardTitle>
              <CardDescription>
                Enter a blog post title and click Add
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Easy Chocolate Chip Cookie Recipe"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTitle()}
                  className="flex-1"
                />
                <Button onClick={addTitle} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bulk Add Titles</CardTitle>
              <CardDescription>
                Add multiple titles at once (one per line)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showBulkInput ? (
                <Button
                  onClick={() => setShowBulkInput(true)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Bulk Add or Upload CSV
                </Button>
              ) : (
                <>
                  <textarea
                    placeholder="Paste titles here (one per line)..."
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    className="w-full h-32 p-3 border border-input rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleBulkAdd} className="flex-1">
                      Add Titles
                    </Button>
                    <Button
                      onClick={() => {
                        setShowBulkInput(false);
                        setBulkText("");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Titles</p>
                <p className="text-3xl font-bold text-accent">{titles.length}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Max titles per batch: 100</p>
                <p>Remaining: {Math.max(0, 100 - titles.length)}</p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={titles.length === 0}
                className="w-full"
              >
                Submit for Publishing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Titles List */}
      {titles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Titles ({titles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {titles.map((title, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <span className="text-sm text-foreground flex-1">{title}</span>
                  <button
                    onClick={() => removeTitle(index)}
                    className="text-destructive hover:text-destructive/80 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


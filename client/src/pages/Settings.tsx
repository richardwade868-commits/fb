import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2, Save, Sun } from "lucide-react";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    postsPerDay: 30,
    pinsPerDay: 30,
    publishTime: "09:00",
    timezone: "UTC",
    isActive: true,
  });

  const scheduleQuery = trpc.settings.getPublishingSchedule.useQuery();
  const updateScheduleMutation = trpc.settings.updatePublishingSchedule.useMutation();

  useEffect(() => {
    if (scheduleQuery.data?.schedule) {
      setFormData({
        postsPerDay: scheduleQuery.data.schedule.postsPerDay || 30,
        pinsPerDay: scheduleQuery.data.schedule.pinsPerDay || 30,
        publishTime: scheduleQuery.data.schedule.publishTime || "09:00",
        timezone: scheduleQuery.data.schedule.timezone || "UTC",
        isActive: scheduleQuery.data.schedule.isActive !== false,
      });
    }
  }, [scheduleQuery.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateScheduleMutation.mutateAsync({
        postsPerDay: parseInt(formData.postsPerDay.toString()),
        pinsPerDay: parseInt(formData.pinsPerDay.toString()),
        publishTime: formData.publishTime,
        timezone: formData.timezone,
        isActive: formData.isActive,
      });

      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your publishing schedule and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Schedule</CardTitle>
              <CardDescription>
                Set how many posts and pins to publish daily
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduleQuery.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Posts Per Day
                      </label>
                      <Input
                        name="postsPerDay"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.postsPerDay}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Pins Per Day
                      </label>
                      <Input
                        name="pinsPerDay"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.pinsPerDay}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Publish Time
                      </label>
                      <Input
                        name="publishTime"
                        type="time"
                        value={formData.publishTime}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">EST (Eastern)</option>
                        <option value="CST">CST (Central)</option>
                        <option value="MST">MST (Mountain)</option>
                        <option value="PST">PST (Pacific)</option>
                        <option value="GMT">GMT</option>
                        <option value="IST">IST (India)</option>
                        <option value="PKT">PKT (Pakistan)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-foreground">
                      Enable Automatic Publishing
                    </label>
                  </div>

                  <Button onClick={handleSave} disabled={isLoading} className="w-full gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Schedule
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how RecipeAutoPub looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Theme</p>
                    <p className="text-sm text-muted-foreground">
                      Light and dark modes supported
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Daily Posts</p>
                <p className="text-2xl font-bold text-foreground">{formData.postsPerDay}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Daily Pins</p>
                <p className="text-2xl font-bold text-foreground">{formData.pinsPerDay}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Publish Time</p>
                <p className="text-2xl font-bold text-foreground">{formData.publishTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      formData.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <p className="font-medium text-foreground">
                    {formData.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-xs">Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>✓ Changes save automatically</p>
              <p>✓ Timezone affects publish times</p>
              <p>✓ Disable to pause publishing</p>
              <p>✓ Check Activity Logs for details</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

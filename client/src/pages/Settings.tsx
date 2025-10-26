import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Clock, Bell, Palette, Lock } from "lucide-react";

export default function Settings() {
  const [schedule, setSchedule] = useState({
    postsPerDay: 30,
    pinsPerDay: 30,
    publishTime: "09:00",
    timezone: "America/New_York",
  });

  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    emailOnPublish: true,
    emailOnError: true,
    dailyDigest: false,
  });

  const handleScheduleChange = (field: string, value: string | number) => {
    setSchedule({ ...schedule, [field]: value });
  };

  const handleNotificationChange = (field: string) => {
    setNotifications({
      ...notifications,
      [field]: !notifications[field as keyof typeof notifications],
    });
  };

  const handleSaveSchedule = () => {
    // TODO: Implement actual save logic
    toast.info("Schedule settings coming soon");
    console.log("Saving schedule:", schedule);
  };

  const handleSaveNotifications = () => {
    // TODO: Implement actual save logic
    toast.info("Notification settings coming soon");
    console.log("Saving notifications:", notifications);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your publishing schedule and preferences
        </p>
      </div>

      {/* Publishing Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <div>
              <CardTitle>Publishing Schedule</CardTitle>
              <CardDescription>
                Set how many posts and pins to publish daily
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Posts Per Day
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={schedule.postsPerDay}
                onChange={(e) =>
                  handleScheduleChange("postsPerDay", parseInt(e.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Maximum 100 posts per day
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Pins Per Day
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={schedule.pinsPerDay}
                onChange={(e) =>
                  handleScheduleChange("pinsPerDay", parseInt(e.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                Maximum 100 pins per day
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Publish Time (Daily)
              </label>
              <Input
                type="time"
                value={schedule.publishTime}
                onChange={(e) =>
                  handleScheduleChange("publishTime", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Timezone
              </label>
              <select
                value={schedule.timezone}
                onChange={(e) =>
                  handleScheduleChange("timezone", e.target.value)
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Australia/Sydney">Sydney</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSaveSchedule} className="w-full">
            Save Schedule
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" />
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              {
                key: "emailOnPublish",
                label: "Email when posts are published",
                description: "Get notified every time a post or pin is published",
              },
              {
                key: "emailOnError",
                label: "Email on publishing errors",
                description: "Get alerted if something goes wrong",
              },
              {
                key: "dailyDigest",
                label: "Daily digest email",
                description: "Receive a daily summary of publishing activity",
              },
            ].map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={
                    notifications[option.key as keyof typeof notifications]
                  }
                  onChange={() => handleNotificationChange(option.key)}
                  className="w-5 h-5 rounded border-input cursor-pointer"
                />
              </div>
            ))}
          </div>
          <Button onClick={handleSaveNotifications} className="w-full">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-accent" />
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Choose your preferred theme
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  theme === option.value
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <p className="text-sm font-medium">{option.label}</p>
              </button>
            ))}
          </div>
          <Button className="w-full">Save Theme</Button>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            <div>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


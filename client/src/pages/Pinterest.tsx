import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Pin, Trash2, CheckCircle } from "lucide-react";

interface PinterestAccount {
  id: string;
  accountName: string;
  isConnected: boolean;
}

export default function Pinterest() {
  const [accounts, setAccounts] = useState<PinterestAccount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [accountName, setAccountName] = useState("");

  const handleConnect = () => {
    if (!accountName.trim()) {
      toast.error("Please enter an account name");
      return;
    }

    const newAccount: PinterestAccount = {
      id: Date.now().toString(),
      accountName: accountName.trim(),
      isConnected: true,
    };

    setAccounts([...accounts, newAccount]);
    setAccountName("");
    setShowForm(false);
    toast.success("Pinterest account connected");
  };

  const handleDisconnect = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
    toast.success("Account disconnected");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Pinterest Integration</h1>
        <p className="text-muted-foreground">
          Connect your Pinterest account to automatically upload pin designs
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                accounts.length > 0 ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium">
              {accounts.length > 0
                ? `${accounts.length} account(s) connected`
                : "No accounts connected"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Connect Account Form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Pinterest Account</CardTitle>
            <CardDescription>
              Enter your Pinterest account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Account Name
              </label>
              <Input
                placeholder="My Recipe Board"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleConnect()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleConnect} className="flex-1">
                Connect Account
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setAccountName("");
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
          <Pin className="h-4 w-4" />
          Connect Pinterest Account
        </Button>
      )}

      {/* Connected Accounts */}
      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Pin className="h-5 w-5 text-red-500" />
                    <div>
                      <CardTitle className="text-lg">
                        {account.accountName}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Pinterest Account
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle className="h-3 w-3 text-green-700 dark:text-green-300" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Connected
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleDisconnect(account.id)}
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-12 text-center">
            <Pin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              No Pinterest accounts connected yet
            </p>
            <Button onClick={() => setShowForm(true)}>
              Connect Your Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Features Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Pinterest Integration Features</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✓ Automatic pin design generation with AI</p>
          <p>✓ Daily pin uploads to your Pinterest boards</p>
          <p>✓ Customizable pin templates and text overlays</p>
          <p>✓ Link pins directly to published blog posts</p>
          <p>✓ Track pin performance and engagement</p>
        </CardContent>
      </Card>
    </div>
  );
}


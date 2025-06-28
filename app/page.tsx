"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { initiateLightspeedAuth } from "@/app/actions";

export default function Home() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await initiateLightspeedAuth();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Lightspeed API Auth
          </h1>
          <p className="text-muted-foreground mt-2">
            Secure authentication for Lightspeed API integration
          </p>
          <Badge variant="secondary" className="mt-4">
            Next.js + shadcn/ui
          </Badge>
        </div>

        <Separator className="my-8" />

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Authentication Card */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Connect to Lightspeed API with secure OAuth flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Click the button below to start the authentication process
                  with Lightspeed.
                </p>
                <form onSubmit={handleSubmit}>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                >
                  Connect to Lightspeed
                </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Current authentication status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Not connected</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You need to authenticate with Lightspeed to access the API.
              </p>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                What you can do with this integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Secure OAuth</h4>
                  <p className="text-sm text-muted-foreground">
                    Industry-standard OAuth 2.0 authentication flow
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">API Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Full access to Lightspeed API endpoints
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Token Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic token refresh and secure storage
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Separator className="my-8" />
        <div className="text-center text-sm text-muted-foreground">
          <p>Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui</p>
        </div>
      </div>
    </div>
  );
}

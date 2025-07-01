// Components
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
import AuthButton from "@/components/home-page/auth-button";


export default async function Home() {


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
        <div>
          {/* Authentication Card */}
          <Card className="mb-6">
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
              </div>
              <AuthButton />
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

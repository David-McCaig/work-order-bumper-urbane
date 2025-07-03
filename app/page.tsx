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
            Work Order Bumper
          </h1>
          <p className="text-muted-foreground mt-2">
            Quickly update multiple work orders to a selected date.
          </p>
        </div>

        <Separator className="my-8" />

        {/* Main Content */}
        <div>
          {/* Authentication Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in with your Lightspeed account to access the work
                order bumper
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  This application requires authentication to access your
                  Lightspeed work orders. Click the button below to sign in and
                  get started.
                </p>
              </div>
              <AuthButton />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

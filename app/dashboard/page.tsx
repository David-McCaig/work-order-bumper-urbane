import { getAccountDetails } from "@/app/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function page() {
  const accountDetails = await getAccountDetails();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Account Information</span>
            <Badge variant="secondary">Lightspeed</Badge>
          </CardTitle>
          <CardDescription>Your Lightspeed account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Account ID:
              </span>
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {accountDetails?.Account?.accountID}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Account Name:
              </span>
              <span className="font-semibold">
                {accountDetails?.Account?.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

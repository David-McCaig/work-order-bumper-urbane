"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <p className="text-center">{error?.message}</p>
      <Link href="/work-order-bump">
        <Button className="mt-4 rounded-md px-4 py-2 text-sm text-white transition-colors ">
          Try again
        </Button>
      </Link>
    </main>
  );
}

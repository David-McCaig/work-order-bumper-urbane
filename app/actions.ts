"use server";

import { redirect } from "next/navigation";
import axios from "axios";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Initiates the OAuth flow with Lightspeed
 * @param redirectUrl - The URL to redirect to after authentication
 */
export async function initiateLightspeedAuth(state: string) {
  const clientId = process.env.LIGHTSPEED_CLIENT_ID;

  const authUrl = `https://cloud.lightspeedapp.com/auth/oauth/authorize?response_type=code&client_id=${clientId}&scope=employee:register+employee:inventory+employee:workbench&state=${state}`;

  // Redirect to the authorization URL
  redirect(authUrl);
}

interface WorkOrderBumpResult {
  workOrderId: string;
  success: boolean;
  data?: unknown;
  error?: unknown;
  bucketInfo?: { current: number; total: number; dripRate: number } | null;
}

export async function bumpWorkOrders(workOrders: string[], toDate: Date) {
  const cookieStore = await cookies();
  const token = cookieStore.get("lightspeed_token")?.value;
  const accountId = cookieStore.get("lightspeed_account_id")?.value;

  if (!token || !accountId) {
    throw new Error("No token or account ID found");
  }

  const lightSpeedApiUrl = process?.env?.LIGHTSPEED_API_URL;

  if (!lightSpeedApiUrl) {
    throw new Error("LIGHTSPEED_API_URL environment variable not found");
  }

  // Helper function to parse bucket level from response headers
  function parseBucketLevel(
    headers: Record<string, unknown>
  ): { current: number; total: number; dripRate: number } | null {
    const bucketLevel = headers["x-ls-api-bucket-level"];
    const dripRate = headers["x-ls-api-drip-rate"];

    if (!bucketLevel || Array.isArray(bucketLevel) || typeof bucketLevel !== "string") return null;

    const [current, total] = bucketLevel.split("/").map(Number);

    return {
      current: current || 0,
      total: total || 60,
      dripRate: parseFloat(dripRate as string) || 1,
    };
  }

  // Helper function to calculate wait time needed
  function calculateWaitTime(
    bucketInfo: { current: number; total: number; dripRate: number },
    requestCost: number = 10
  ): number {
    const availableSpace = bucketInfo.total - bucketInfo.current;

    if (availableSpace >= requestCost) {
      return 0; // No wait needed
    }

    const unitsNeeded = requestCost - availableSpace;
    const waitTimeSeconds = unitsNeeded / bucketInfo.dripRate;
    return Math.ceil(waitTimeSeconds * 1000); // Convert to milliseconds and round up
  }

  // Helper function to make a single request with smart rate limiting
  async function makeRequest(
    workOrderId: string,
    requestData: Record<string, string>
  ): Promise<WorkOrderBumpResult> {
    try {
      const res = await axios.put(
        `${lightSpeedApiUrl}/API/V3/Account/${accountId}/Workorder/${workOrderId}.json`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Parse bucket info from successful response headers
      const bucketInfo = parseBucketLevel(res.headers);

      return {
        workOrderId,
        success: true,
        data: res.data,
        bucketInfo,
      } as WorkOrderBumpResult;
    } catch (error: unknown) {
      console.error(`Failed to update work order ${workOrderId}:`, error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: unknown;
            headers?: Record<string, string | string[] | undefined>;
          };
        };
        console.error(
          `Error Response Status for ${workOrderId}:`,
          axiosError.response?.status
        );
        console.error(
          `Error Response Data for ${workOrderId}:`,
          JSON.stringify(axiosError.response?.data, null, 2)
        );

        // If it's a 429 error, log the bucket info
        if (
          axiosError.response?.status === 429 &&
          axiosError.response?.headers
        ) {
          const bucketInfo = parseBucketLevel(axiosError.response.headers);

          if (bucketInfo) {
            console.error(
              `Rate limited! Bucket: ${bucketInfo.current}/${bucketInfo.total}, Drip Rate: ${bucketInfo.dripRate}/sec`
            );
          }
        }
      }
      return { workOrderId, success: false, error } as WorkOrderBumpResult;
    }
  }

  // Process work orders sequentially with smart rate limiting
  const results: WorkOrderBumpResult[] = [];
  let lastBucketInfo: {
    current: number;
    total: number;
    dripRate: number;
  } | null = null;

  console.log(
    `Processing ${workOrders.length} work orders with smart rate limiting...`
  );

  for (let i = 0; i < workOrders.length; i++) {
    const workOrderId = workOrders[i];
    const requestData = {
      etaOut: toDate.toISOString().replace(/\.\d{3}Z$/, "+00:00"),
    };

    // Calculate wait time based on bucket info
    if (lastBucketInfo) {
      const waitTime = calculateWaitTime(lastBucketInfo, 10); // PUT request costs 10 units
      if (waitTime > 0) {
        console.log(
          `Work order ${i + 1}/${
            workOrders.length
          }: Waiting ${waitTime}ms for bucket to refill...`
        );

        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    console.log(
      `Work order ${i + 1}/${workOrders.length}: Processing ${workOrderId}...`
    );
    console.log((i + 1) / workOrders.length * 100, "percentComplete")
    const result = await makeRequest(workOrderId, requestData);
    results.push(result);

    // Update bucket info from the response (if successful)
    if (result.success && result.bucketInfo) {
      // Use the actual bucket info from the response
      lastBucketInfo = result.bucketInfo;
      console.log(
        `Updated bucket info from response: ${lastBucketInfo.current}/${lastBucketInfo.total}`
      );
    } else if (result.success) {
      // If successful but no bucket info, assume we used 10 units
      if (lastBucketInfo) {
        lastBucketInfo.current = Math.min(
          lastBucketInfo.current + 10,
          lastBucketInfo.total
        );
      } else {
        lastBucketInfo = { current: 10, total: 60, dripRate: 1 };
      }
    }

    console.log(
      `Bucket level after request: ${lastBucketInfo?.current || 0}/${
        lastBucketInfo?.total || 60
      }`
    );
  }
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  revalidatePath("/work-order-bump");
  return {
    total: workOrders.length,
    successful,
    failed,
    results,
  };
}

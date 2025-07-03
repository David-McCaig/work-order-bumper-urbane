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
  redirect(authUrl)
}


export async function bumpWorkOrders(workOrders: any, toDate: Date) {

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

  const results = await Promise.all(
    workOrders.map(async (workOrderId: any) => {
      const requestData = {
        etaOut: toDate.toISOString().replace(/\.\d{3}Z$/, '+00:00')
      };

      try {
        const res = await axios.put(
          `${lightSpeedApiUrl}/API/V3/Account/${accountId}/Workorder/${workOrderId}.json`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        return { workOrderId, success: true, data: res.data };
      } catch (error: any) {
        console.error(`Failed to update work order ${workOrderId}:`, error);
        if (error.response) {
          console.error(`Error Response Status for ${workOrderId}:`, error.response.status);
          console.error(`Error Response Data for ${workOrderId}:`, JSON.stringify(error.response.data, null, 2));
        }
        return { workOrderId, success: false, error };
      }
    })
  );

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  revalidatePath("/work-order-bump")
  return {
    total: workOrders.length,
    successful,
    failed,
    results
  };
}
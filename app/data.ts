"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function getAccountId(token: string) {
  const lightSpeedApiUrl = process?.env?.LIGHTSPEED_API_URL;

  if (!token) {
    throw new Error("No token found");
  }

  // Fetch account ID if not cached
  const response = await axios.get(`${lightSpeedApiUrl}/API/V3/Account.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const accountId = response?.data?.Account?.accountID;
  // Store account ID in an HTTP-only cookie

  return accountId;
}

/**
 * Checks if the current Lightspeed token is still valid
 * @returns Promise<boolean> - true if token is valid, false otherwise
 */
export async function isTokenValid(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("lightspeed_token")?.value;
    const lightSpeedApiUrl = process?.env?.LIGHTSPEED_API_URL;
    if (!token) {
      return false;
    }

    // Make a simple API call to test if the token is still valid
    // Using the Account endpoint as it's lightweight and commonly used
    await axios.get(`${lightSpeedApiUrl}/API/V3/Account.json`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If the request succeeds, the token is valid
    return true;
  } catch {
    return false;
  }
}

export async function getAccountDetails() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lightspeed_token")?.value;

  if (!token) {
    throw new Error("No token found");
  }

  const lightSpeedApiUrl = process?.env?.LIGHTSPEED_API_URL;

  const response = await axios.get(`${lightSpeedApiUrl}/API/V3/Account.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response?.data;
}

export async function getWorkOrders(date?: Date) {
  const cookieStore = await cookies();
  const token = cookieStore.get("lightspeed_token")?.value;

  if (!token) {
    throw new Error("No token found");
  }

  const accountId = cookieStore.get("lightspeed_account_id")?.value;

  if (!accountId) {
    throw new Error("No account ID found");
  }

  const lightSpeedApiUrl = process?.env?.LIGHTSPEED_API_URL;

  if (!lightSpeedApiUrl) {
    throw new Error("LIGHTSPEED_API_URL environment variable not found");
  }

  try {
    // Format the date for the API query
    let queryParams = "";
    if (date) {
      // Fix timezone issue by creating dates in local timezone
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
      
      const startISO = startOfDay.toISOString();
      const endISO = endOfDay.toISOString();
      
      // URL encode the date range parameters
      queryParams = `?etaOut=%3E%3C%2C${encodeURIComponent(startISO)}%2C${encodeURIComponent(endISO)}`;
    }

    const response = await axios.get(
      `${lightSpeedApiUrl}/API/V3/Account/${accountId}/Workorder.json${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data || { Workorder: [] };
  } catch (error) {
    console.error("Error fetching work orders:", error);
    
    // Return empty data instead of null to prevent rendering errors
    return { Workorder: [] };
  }
}


export async function getWorkorderStatuses () {
    const cookieStore = await cookies();
    const token = cookieStore.get("lightspeed_token")?.value;
    const accountId = cookieStore.get("lightspeed_account_id")?.value;
    
    if (!token) {
        throw new Error("No token found");
    }

    if (!accountId) {
        throw new Error("No account ID found");
    }

    const lightSpeedApiUrl = process?.env?.LIGHTSPEED_API_URL;

    try{
      const response = await axios.get(`${lightSpeedApiUrl}/API/V3/Account/${accountId}/WorkorderStatus.json`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response?.data?.WorkorderStatus || [];
    } catch (error) {
      console.error("Error fetching work order statuses:", error);
      return [];
    }
}

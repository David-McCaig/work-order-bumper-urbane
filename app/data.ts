"use server";

import axios from "axios";
import { cookies } from "next/headers";

export async function getAccountId(token: string) {
    const cookieStore = await cookies();
    const lightSpeedApiUrl = process?.env?.LIGHTSPEED_API_URL;
    const storedAccountId = cookieStore.get("lightspeed_account_id")?.value;

    if (!token) {
        throw new Error("No token found");
    }


    // Fetch account ID if not cached
    const response = await axios.get(`${lightSpeedApiUrl}/API/V3/Account.json`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
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
                "Authorization": `Bearer ${token}`
            }
        });

        // If the request succeeds, the token is valid
        return true;
    } catch (error) {
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

  const response = await axios.get(
    `${lightSpeedApiUrl}/API/V3/Account.json`,
    {
      headers: {
      Authorization: `Bearer ${token}`,
    },
  });

    return response?.data;
}
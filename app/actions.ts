"use server";

import { redirect } from "next/navigation";

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


import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/error`);
  }

  const clientId = process.env.LIGHTSPEED_CLIENT_ID;
  const clientSecret = process.env.LIGHTSPEED_CLIENT_SECRET;
  
  try {
    const tokenResponse = await axios.post("https://cloud.lightspeedapp.com/auth/oauth/token", {
        "client_id": clientId,
        "client_secret": clientSecret,
        "grant_type": "authorization_code",
        "code": code,
    });

    const data = JSON.parse(tokenResponse.data);
    const accessToken = data.access_token;  
    const refreshToken = data.refresh_token;

    const newAccessTokenResponse = await axios.post("https://cloud.lightspeedapp.com/auth/oauth/token", {
       "client_id": clientId,
    "client_secret": clientSecret,
    "grant_type": "refresh_token",
    "refresh_token": refreshToken
    });

    const newAccessTokenData = JSON.parse(newAccessTokenResponse.data);
    const newAccessToken = newAccessTokenData.access_token;


    // Set HTTP-only cookie with the access token
    const response = NextResponse.redirect(`${origin}/work-orders`);
    response.cookies.set('lightspeed_token', newAccessToken, {
      httpOnly: true, // Makes cookie inaccessible to client-side JS
      secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
      sameSite: 'lax', // Protects against CSRF
    });

  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${origin}/error`);
  }

  return NextResponse.redirect(`${origin}/work-orders`);
}
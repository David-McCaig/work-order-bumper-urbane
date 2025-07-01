"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {Button} from "@/components/ui/button"

//utils
import { generateState } from "@/lib/utils";

// Actions
import { initiateLightspeedAuth } from "@/app/actions";


//data
import { isTokenValid } from "@/app/data";

export default function AuthButton() {
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const state = generateState();
        sessionStorage.setItem("state", state);
        await initiateLightspeedAuth(state);
      };

      useEffect(() => {
        const checkTokenValidity = async () => {
            const tokenValid = await isTokenValid();
            if (tokenValid) {
                router.push("/dashboard");
            }
        }
        checkTokenValidity();
      },[])

    return (
        <form onSubmit={handleSubmit}>
        <Button
          type="submit"
          className="w-full cursor-pointer"
        >
          Connect to Lightspeed
        </Button>
        </form>
    )
}
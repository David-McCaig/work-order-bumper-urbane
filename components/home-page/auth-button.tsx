"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {Button} from "@/components/ui/button"
import { ClientOnly } from "@/components/ui/client-only"

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
        // Only access sessionStorage on client side
        if (typeof window !== 'undefined') {
            sessionStorage.setItem("state", state);
        }
        await initiateLightspeedAuth(state);
    };

    useEffect(() => {
        const checkTokenValidity = async () => {
            const tokenValid = await isTokenValid();
            if (tokenValid) {
                router.push("/work-order-bump");
            }
        }
        checkTokenValidity();
    },[router])

    return (
        <ClientOnly fallback={
            <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled
            >
                Loading...
            </Button>
        }>
            <form onSubmit={handleSubmit}>
                <Button
                    type="submit"
                    className="w-full cursor-pointer"
                >
                    Connect to Lightspeed
                </Button>
            </form>
        </ClientOnly>
    )
}
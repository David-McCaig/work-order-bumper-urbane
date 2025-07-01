

import { isTokenValid } from "@/app/data";

export default async function page () {
   
    const tokenValid = await isTokenValid();
    console.log(tokenValid, "token valid")

    return (
        <div>
            <h1>dashboard</h1>
        </div>
    )
}
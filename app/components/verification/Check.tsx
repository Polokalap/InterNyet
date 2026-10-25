"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export default function Check({ action }: { action: string }) {

    return (

        <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            options={{
                theme: "light",
                size: "normal",
                action,
            }}
            onError={(code) => console.error("Turnstile error", code)}
        />

    );

}
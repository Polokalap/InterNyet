"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export default function Check({ action, setFinished }: { action: string, setFinished?: (finished: boolean) => void; }) {

    return (

        <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            options={{
                theme: "light",
                size: "invisible",
                action,
            }}
            onSuccess={() => setFinished?.(true)}
            onError={(code) => console.error("Turnstile error", code)}
        />

    );

}
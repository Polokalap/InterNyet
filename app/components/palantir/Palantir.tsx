"use client"

import { useEffect } from "react";

export default function Palantir() {

    useEffect(() => {

        (async () => {

            const nav: any = navigator;
            const highEntropy = await nav.userAgentData?.getHighEntropyValues?.([
                "architecture", "bitness", "model", "platformVersion", "fullVersionList",
            ]).catch(() => null);

            const info = {

                screen: { w: screen.width, h: screen.height, availW: screen.availWidth, availH: screen.availHeight },
                viewport: { w: innerWidth, h: innerHeight },
                pixelRatio: devicePixelRatio,
                colorDepth: screen.colorDepth,
                orientation: screen.orientation?.type,
                hdr: matchMedia("(dynamic-range: high)").matches,
                wideGamut: matchMedia("(color-gamut: p3)").matches,

                platform: nav.userAgentData?.platform ?? nav.platform,
                highEntropy,
                cores: nav.hardwareConcurrency,
                memoryGB: nav.deviceMemory,
                touchPoints: nav.maxTouchPoints,
                gpu: getGPU(),

                language: nav.language,
                languages: nav.languages,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                tzOffset: new Date().getTimezoneOffset(),
                darkMode: matchMedia("(prefers-color-scheme: dark)").matches,
                reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,

                connection: nav.connection && {
                    type: nav.connection.effectiveType,
                    downlinkMbps: nav.connection.downlink,
                    rttMs: nav.connection.rtt,
                    saveData: nav.connection.saveData,
                },

            };

            fetch("/api/client-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info),
            }).catch(() => {});

        })();

    }, []);

    return null;

}

function getGPU() {

    try {

        const gl = document.createElement("canvas").getContext("webgl");
        const ext = gl?.getExtension("WEBGL_debug_renderer_info");
        return ext && gl
            ? {
                vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
            }
            : null;

    } catch { return null; }

}
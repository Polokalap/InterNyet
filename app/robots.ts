import { MetadataRoute } from "next";

const clankers = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
    'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
    'meta-externalagent', 'meta-externalfetch', 'FacebookBot',
    'Google-Extended', 'Applebot-Extended', 'PerplexityBot',
    'Perplexity-User', 'CCBot', 'Bytespider', 'Amazonbot',
    'cohere-ai', 'Diffbot', 'DuckAssistBot', 'MistralAI-User',
]

export default function robot(): MetadataRoute.Robots {

    return {
        rules: [
            { userAgent: '*', allow: '/' },
            { userAgent: clankers, allow: '/$', disallow: '/' },
        ]
    }

}
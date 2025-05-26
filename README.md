# Text to Image API (Cloudflare Workers)

Generate images from text prompts using HuggingFace Stable Diffusion.

## Endpoint

GET https://<your-worker>.workers.dev/?prompt=your+text+here

### Response

```json
{
  "status": "success",
  "user_id": "uuid",
  "prompt": "your prompt",
  "model": "sd-3.5-large",
  "image_url": "data:image/png;base64,...",
  "timestamp": "2025-05-26T..."
}
```

## Setup

1. You already have a HuggingFace Token.
2. Install Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/install/
3. Run:

```bash
npm install -g wrangler
wrangler publish
```

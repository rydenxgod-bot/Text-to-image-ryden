export default {
  async fetch(request, env, ctx) {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get("prompt");

    if (!prompt) {
      return new Response(JSON.stringify({
        status: "error",
        message: "Missing 'prompt' parameter"
      }), {
        headers: { "Content-Type": "application/json" },
        status: 400
      });
    }

    try {
      const inference = await fetch(`https://api-inference.huggingface.co/models/${env.HF_MODEL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      });

      if (!inference.ok) {
        const err = await inference.json();
        throw new Error(err.error || "Image generation failed.");
      }

      const buffer = await inference.arrayBuffer();
      const base64Image = btoa(String.fromCharCode(...new Uint8Array(buffer)));

      const image_url = `data:image/png;base64,${base64Image}`;
      const user_id = crypto.randomUUID();
      const timestamp = new Date().toISOString();

      return new Response(JSON.stringify({
        status: "success",
        user_id,
        prompt,
        model: env.MODEL_NAME,
        image_url,
        timestamp
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({
        status: "error",
        message: err.message || "Unexpected error"
      }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    }
  }
}

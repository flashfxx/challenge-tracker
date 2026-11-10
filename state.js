export async function onRequest({ request, env }) {
  const k = new URL(request.url).searchParams.get("k") || "";
  if (k.length < 6) return new Response("code too short", { status: 400 });
  const key = "s:" + k;
  if (request.method === "GET") {
    const v = await env.STATE.get(key);
    return new Response(v || "null", { headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "PUT") {
    const body = await request.text();
    if (body.length > 200000) return new Response("too big", { status: 413 });
    await env.STATE.put(key, body);
    return new Response("ok");
  }
  return new Response("method not allowed", { status: 405 });
}

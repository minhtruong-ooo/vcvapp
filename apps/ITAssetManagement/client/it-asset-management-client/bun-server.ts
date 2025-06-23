import { serve } from "bun";
import { join, extname } from "path";
import { readFile } from "fs/promises";

const distDir = join(import.meta.dir, "dist");

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = join(distDir, url.pathname === "/" ? "/index.html" : url.pathname);
    let ext = extname(filePath);

    try {
      const data = await readFile(filePath);
      const contentType = mimeTypes[ext] || "application/octet-stream";

      return new Response(data, {
        headers: { "Content-Type": contentType },
      });
    } catch {
      // fallback: return index.html for SPA routing
      const fallback = await readFile(join(distDir, "index.html"));
      return new Response(fallback, {
        headers: { "Content-Type": "text/html" },
      });
    }
  },
});

console.log("🚀 Bun server is running at http://localhost:3000");

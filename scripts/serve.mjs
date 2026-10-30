import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const host = "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "8765", 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
}

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".woff2": "font/woff2",
    ".txt": "text/plain; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon"
};

function resolveRequestPath(rawUrl) {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(rawUrl, "http://localhost").pathname);
    } catch (error) {
        // Malformed URLs and invalid percent-encoding are client errors, not server failures.
        return null;
    }
    if (pathname.includes("\0")) return null;

    const candidate = resolve(projectRoot, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (candidate !== projectRoot && !candidate.startsWith(`${projectRoot}${sep}`)) return null;
    return candidate;
}

const server = createServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" });
        response.end("Method not allowed");
        return;
    }

    const candidate = resolveRequestPath(request.url ?? "/");
    if (!candidate) {
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Bad request");
        return;
    }

    try {
        // Resolving the real path prevents symlinks from escaping the project root.
        const realPath = await realpath(candidate);
        if (realPath !== projectRoot && !realPath.startsWith(`${projectRoot}${sep}`)) {
            throw Object.assign(new Error("Outside project root"), { code: "ENOENT" });
        }
        const fileStat = await stat(realPath);
        if (!fileStat.isFile()) {
            throw Object.assign(new Error("Not a file"), { code: "ENOENT" });
        }

        const headers = {
            "Content-Type": contentTypes[extname(realPath).toLowerCase()] ?? "application/octet-stream",
            "Content-Length": fileStat.size,
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff"
        };
        response.writeHead(200, headers);
        if (request.method === "HEAD") {
            response.end();
            return;
        }
        const stream = createReadStream(realPath);
        stream.on("error", (error) => {
            console.error(`Failed to stream ${request.url}:`, error);
            response.destroy(error);
        });
        stream.pipe(response);
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "ENOTDIR") {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Not found");
            return;
        }
        console.error(`Failed to serve ${request.url}:`, error);
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Internal server error");
    }
});

server.listen(port, host, () => {
    console.log(`Business × Organization Atlas: http://${host}:${server.address().port}/`);
});

// Turns a finished `next build` into what gets uploaded to Namecheap:
//   dist/namecheap/app.js    the startup file
//   dist/namecheap/bundle/   the standalone server with its static files and public/
//   dist/bslctr-namecheap.tar.gz   both of the above, for cPanel's File Manager
// Run through `npm run build:namecheap`.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const standalone = path.join(root, ".next", "standalone");
const dist = path.join(root, "dist");
const out = path.join(dist, "namecheap");
const bundle = path.join(out, "bundle");
const archive = "bslctr-namecheap.tar.gz";

if (!existsSync(path.join(standalone, "server.js"))) {
    console.error("No standalone build in .next/standalone. Run `npm run build:namecheap`.");
    process.exit(1);
}

rmSync(out, { recursive: true, force: true });
rmSync(path.join(dist, archive), { force: true });
mkdirSync(out, { recursive: true });

// The standalone folder leaves out the two things the server does not import.
cpSync(standalone, bundle, { recursive: true });
cpSync(path.join(root, ".next", "static"), path.join(bundle, ".next", "static"), { recursive: true });
cpSync(path.join(root, "public"), path.join(bundle, "public"), { recursive: true });
cpSync(path.join(here, "app.js"), path.join(out, "app.js"));

// `next build` copies this machine's .env files into the standalone folder. They hold the
// database URL and the admin passwords, and the server reads its own .env beside app.js,
// so they do not go into something that gets uploaded and passed around.
for (const name of readdirSync(bundle)) {
    if (name.startsWith(".env")) rmSync(path.join(bundle, name));
}

// A native binary is built for one platform, and the host is Linux whatever this machine is.
// The build always traces in sharp's (node_modules/@img) for the image optimiser, which
// next.config.ts turns off; anything else native is a dependency that needs a decision.
rmSync(path.join(bundle, "node_modules", "@img"), { recursive: true, force: true });
const native = readdirSync(bundle, { recursive: true }).filter((f) => f.endsWith(".node"));
if (native.length > 0) {
    console.error("The bundle contains native binaries that will not load on the host:");
    for (const f of native) console.error(`  ${f}`);
    process.exit(1);
}

// Relative names only: GNU tar reads a drive letter in a path as a remote host.
execFileSync("tar", ["-czf", `../${archive}`, "app.js", "bundle"], {
    cwd: out,
    stdio: "inherit",
});

const megabytes = (statSync(path.join(dist, archive)).size / 1024 / 1024).toFixed(1);
console.log(`\nWrote dist/${archive} (${megabytes} MB). Upload steps: docs/deploy-namecheap.md`);

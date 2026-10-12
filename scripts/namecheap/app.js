/* eslint-disable @typescript-eslint/no-require-imports */
// Startup file for cPanel's "Setup Node.js App" (Phusion Passenger) on Namecheap shared
// hosting. Passenger loads it with require(), so it stays CommonJS. It sits in the
// application root beside bundle/, which holds the built site (see docs/deploy-namecheap.md).
const fs = require("node:fs");
const path = require("node:path");

// cPanel's version list starts at Node 6 and does not preselect a new one. On an old
// version the site dies inside a dependency with an error that names none of this.
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && minor < 19)) {
    throw new Error(
        `This site needs Node.js 20.19 or newer, and this is ${process.versions.node}. ` +
            'Choose a newer version in cPanel under "Setup Node.js App".'
    );
}

// Settings live beside this file and not in bundle/, which is replaced on every deploy.
// A variable set in cPanel wins over the same one in the file.
const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

// Uploaded files stay out of bundle/ for the same reason.
process.env.UPLOAD_DIR ||= path.join(__dirname, "uploads");

require("./bundle/server.js");

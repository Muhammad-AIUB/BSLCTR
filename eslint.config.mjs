import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15 is still an eslintrc-style config, so it is loaded through FlatCompat.
const compat = new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
    {
        // .claude/ holds whole worktree copies of the repo, .gstack/ QA reports and the
        // scripts that produced them, and dist/ the built bundle; uploads/ and public/ are
        // not source.
        ignores: [
            ".next/**",
            ".claude/**",
            ".gstack/**",
            "dist/**",
            "next-env.d.ts",
            "uploads/**",
            "public/**",
        ],
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import i18next from "eslint-plugin-i18next";
import warsha from "./eslint-rules/index.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Localization rules. They fail the build. See CLAUDE.md.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { i18next, warsha },
    rules: {
      // No user-facing text inside components. Put it in messages/<locale>.json.
      "i18next/no-literal-string": ["error", { mode: "jsx-text-only" }],
      "warsha/no-physical-direction": "error",
      "warsha/no-manual-format": "error",
    },
  },
  {
    // The locale formatter itself and shadcn's generated components may use these freely.
    files: ["src/i18n/**", "src/components/ui/**"],
    rules: { "warsha/no-manual-format": "off", "i18next/no-literal-string": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "playwright-report/**", "test-results/**"]),
]);

export default eslintConfig;

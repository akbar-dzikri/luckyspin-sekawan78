import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable specific TypeScript ESLint rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      
      // Disable React hooks rules
      "react-hooks/exhaustive-deps": "off",
      
      // Disable Next.js specific rules
      "@next/next/no-img-element": "off",
      
      // Other common rules you might want to disable
      "prefer-const": "off",
      "no-console": "off",
    },
  },
 ];

export default eslintConfig;

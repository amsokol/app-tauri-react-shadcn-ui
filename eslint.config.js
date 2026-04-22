import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import importXPlugin from "eslint-plugin-import-x"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import {defineConfig} from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig(
  {ignores: ["dist", "src-tauri/target"]},
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{js,cjs,mjs}"],
    ...tseslint.configs.disableTypeChecked,
  },
  importXPlugin.flatConfigs.recommended,
  importXPlugin.flatConfigs.typescript,
  {
    files: ["src/**/*.{tsx,jsx}"],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {jsx: true},
      },
    },
    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        {allowConstantExport: true},
      ],
    },
    settings: {
      react: {
        version: "19.2",
      },
    },
  },
  {
    files: ["vite.config.ts", "vite-app.vite.config.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["src/main.tsx"],
    rules: {
      "import-x/no-named-as-default": "off",
    },
  },
  {
    files: ["src/components/ui/button.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["**/eslint.config.js"],
    rules: {
      "import-x/no-named-as-default": "off",
      "import-x/no-named-as-default-member": "off",
    },
  },
  eslintConfigPrettier
)

// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier, {
    extends: ["plugin:vue/recommended", "plugin:prettier-vue/recommended"],
    rules: {
        "prettier-vue/prettier": [
            "error",
            {
                // Override all options of `prettier` here
                // @see https://prettier.io/docs/en/options.html
                printWidth: 140,
                singleQuote: true,
                semi: false,
                trailingComma: "es5",
            },
        ],
    },
});

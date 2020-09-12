module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    "@typescript-eslint/no-angle-bracket-type-assertion": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        semi: false,
        trailingComma: "es5",
        singleQuote: false,
        printWidth: 100,
      },
    ],
  },
  overrides: [
    // Override some TypeScript rules just for .js files
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/camelcase": "off",
      },
    },
  ],
}

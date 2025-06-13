module.exports = [
  {
    files: ["src/**/*.ts"],
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      // 可根据需要添加规则
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "off",
      "no-undef": "off"
    },
  },
]; 
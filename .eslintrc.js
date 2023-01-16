module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parser: "@babel/eslint-parser",
  env: {
    es6: true,
    browser: false,
    node: true,
  },
  overrides: [
    {
      files: "test/*.js",
      env: {
        jest: true,
      },
    },
  ],
};

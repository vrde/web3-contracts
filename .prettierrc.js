module.exports = {
  overrides: [
    {
      files: ["*.ts", ".js"],
      options: {
        plugins: [require("@trivago/prettier-plugin-sort-imports")],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
        importOrder: ["^../typechain", "^[./]"],
      },
    },
    {
      files: "*.sol",
      options: {
        plugins: [require("prettier-plugin-solidity")],
        printWidth: 80,
        tabWidth: 4,
        useTabs: false,
        singleQuote: false,
        bracketSpacing: true,
      },
    },
    {
      files: "*.json",
      options: {
        printWidth: 0, // trick to have one item per line
      },
    },
  ],
};

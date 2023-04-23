module.exports = {
  plugins: [require("@trivago/prettier-plugin-sort-imports")],
  endOfLine: "lf",
  printWidth: 120,
  tabWidth: 2,
  trailingComma: "all",
  importOrder: ["^react", "^@/lib/(.*)$", "^@/store/(.*)$", "^@/components/(.*)$", "^@/hooks/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

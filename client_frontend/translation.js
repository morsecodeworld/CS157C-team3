const fs = require("fs");
const path = require("path");
const glob = require("glob"); // npm install glob

const extractKeys = (fileContent) => {
  // Simple regex to match t('key') or t("key"). This might need to be more complex depending on your use cases.
  const regex = /t\(['"](.+?)['"]\)/g;
  let match;
  const keys = new Set();

  while ((match = regex.exec(fileContent))) {
    keys.add(match[1]);
  }

  return Array.from(keys);
};

const scanFiles = () => {
  const files = glob.sync("src/**/*.jsx", {
    ignore: ["**/node_modules/**", "**/__tests__/**"],
  });

  const allKeys = new Set();

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf8");
    const keys = extractKeys(content);
    keys.forEach((key) => allKeys.add(key));
  });

  return Array.from(allKeys);
};

const generateJSON = (keys) => {
  const translations = {};
  keys.forEach((key) => (translations[key] = key));
  return JSON.stringify(translations, null, 2);
};

const main = () => {
  const keys = scanFiles();
  const json = generateJSON(keys);
  //fs.writeFileSync("translations.json", json);
  // Ensure directory exists
  const dir = path.join(__dirname, "public/locales/en");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(path.join(dir, "translation.json"), json);
};

main();

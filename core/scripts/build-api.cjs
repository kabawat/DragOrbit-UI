// API is dependency-free native ESM; produce the Electron CommonJS entry from it.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const apiRoot = path.resolve(__dirname, "../src/api");
const source = fs.readFileSync(path.join(apiRoot, "index.js"), "utf8");
const exportsMatch = /export\s*\{([\s\S]*?)\};?\s*$/.exec(source);
if (!exportsMatch) throw new Error("API entry must end with a named export block.");
const names = exportsMatch[1].split(",").map(name => name.trim()).filter(Boolean);
if (!names.length || names.some(name => !/^[A-Za-z_$][\w$]*$/.test(name))) {
  throw new Error("API CommonJS generation supports plain named exports only.");
}
const body = source.slice(0, exportsMatch.index);
const output = "// Generated from index.js by scripts/build-api.cjs. Do not edit directly.\n" +
  body + "module.exports = { " + names.join(", ") + " };\n";
new vm.Script(output); // Fail before writing if imports or unsupported ESM are introduced.
fs.writeFileSync(path.join(apiRoot, "runtime.cjs"), output);

import process from "node:child_process";
import fs from "node:fs/promises";
import moduleJson from "../src/module.json" with { type: "json" };
import pkgJson from "../package.json" with { type: "json" };

moduleJson.version = pkgJson.version;
const output = JSON.stringify(moduleJson, undefined, 2);
await fs.writeFile("src/module.json", output);
process.execSync("git add src/module.json");

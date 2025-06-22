#!/usr/bin/env node
import child from "node:child_process";
import fs from "node:fs";
import path from "node:path";

if (process.env.CI) process.exit(0);

// Remove old link
try {
  fs.rmSync("foundry");
} catch (e) {
  if (e.code === "ERR_FS_EISDIR") {
    console.log("foundry dir exists as a real directory instead of a symlink");
    process.exit(0);
  }
}

const installPath = child
  .execSync("npx fvtt --config ./fvttrc.yml configure get installPath")
  .toString()
  .trim();
if ((installPath || "undefined") === "undefined") {
  console.error("Could not determine foundry install path.  Ensure the cli is properly configured");
  process.exit(0);
}
const electronDir = path.relative(".", path.join(installPath, "resources", "app"));
const foundryDir = fs.existsSync(path.join(electronDir, "main.js"))
  ? electronDir
  : path.relative(".", installPath);
fs.symlinkSync(foundryDir, "foundry", "dir");

const dataPath = child
  .execSync("npx fvtt --config ./fvttrc.yml configure get dataPath")
  .toString()
  .trim();
if ((dataPath || "undefined") !== "undefined") {
  const moduleDir = path.resolve(dataPath, "Data", "modules", "quick-status-select");
  try {
    fs.symlinkSync(path.resolve("src"), moduleDir);
  } catch (e) {
    if (e.code === "ENOENT")
      console.log(`Foundry moduledata dir missing: ${path.normalize(path.join(e.dest, ".."))}`);
    if (e.code === "EEXIST") console.log("System directory or symlink already exists");
  }
}

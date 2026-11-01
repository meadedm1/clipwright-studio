#!/usr/bin/env node
/**
 * Command-line runner for the Clipwright Studio self-tests.
 * Loads the core logic directly from clipwright-studio.html, so the tests
 * always run against the shipped file. Exits with code 1 if any test fails.
 */
const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

const start = html.indexOf("/*CORE-START*/");
const end = html.indexOf("/*CORE-END*/");
if (start === -1 || end === -1) {
  console.error("Could not find CORE-START / CORE-END markers in clipwright-studio.html");
  process.exit(1);
}
const core = html.slice(start, end);
const api = new Function(core + "; return { runTests };")();

const results = api.runTests();
let passed = 0;
for (const r of results) {
  if (r.pass) passed++;
  const detail = r.detail ? ` (${r.detail})` : "";
  console.log(`${r.pass ? "PASS" : "FAIL"}: ${r.name}${detail}`);
}
console.log(`\n${passed} of ${results.length} tests passed`);
process.exit(passed === results.length ? 0 : 1);

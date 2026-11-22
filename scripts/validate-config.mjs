// Validates Warsha project configs against config/warsha.schema.json.
// Usage: node scripts/validate-config.mjs [file ...]
// Without arguments it validates every *.warsha.yaml under examples/.
// It also checks that pipeline/stages.yaml and pipeline/effort.yaml use the schema's stage keys.

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { parse } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(readFileSync(join(root, "config/warsha.schema.json"), "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

let failed = false;
const fail = (msg) => {
  failed = true;
  console.error(`FAIL ${msg}`);
};

const files = process.argv.slice(2);
if (files.length === 0) {
  for (const name of readdirSync(join(root, "examples"))) {
    if (name.endsWith(".warsha.yaml")) files.push(join(root, "examples", name));
  }
}

for (const file of files) {
  const config = parse(readFileSync(file, "utf8"));
  if (validate(config)) {
    console.log(`ok   ${file}`);
  } else {
    for (const err of validate.errors) fail(`${file} ${err.instancePath || "/"} ${err.message}`);
  }
}

const stageKeys = schema.$defs.stage.enum;
const stages = parse(readFileSync(join(root, "pipeline/stages.yaml"), "utf8")).stages.map((s) => s.key);
if (stages.join() !== stageKeys.join()) {
  fail(`pipeline/stages.yaml keys [${stages}] do not match schema keys [${stageKeys}]`);
}

const effort = parse(readFileSync(join(root, "pipeline/effort.yaml"), "utf8"));
for (const [preset, dials] of Object.entries(effort.presets)) {
  const keys = Object.keys(dials);
  if (keys.join() !== stageKeys.join()) fail(`pipeline/effort.yaml preset ${preset} does not set every stage in order`);
  for (const [stage, level] of Object.entries(dials)) {
    if (!Number.isInteger(level) || level < 1 || level > 5) fail(`preset ${preset} stage ${stage} has dial ${level}`);
  }
}
const presetEnum = schema.properties.effort.properties.preset.enum;
if (Object.keys(effort.presets).join() !== presetEnum.join()) {
  fail(`pipeline/effort.yaml presets do not match schema presets [${presetEnum}]`);
}

if (failed) process.exit(1);
console.log("ok   pipeline/stages.yaml and pipeline/effort.yaml match the schema");

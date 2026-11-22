// Stage 0 intake, the minimal v0 version. Creates a project in Linear and its config file.
// Usage:
//   npm run intake -- --name "Acme booking" --type client --client "Acme" --idea "Online booking for clinics"
//   npm run intake -- --name "Warsha test" --type internal --idea "..." --out <dir>
// What it does:
//   1. Writes <out>/projects/<slug>/warsha.yaml from defaults and validates it.
//   2. Creates the Linear project (status Intake, teams Ideas and Delivery) and a project brief document.
//   3. Opens an intake decision issue for the CEO listing the fields that are still missing.
//   4. Checks that the decision issue shows up in the CEO decisions view.
// Needs config/linear.json from `npm run linear:setup`.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { execFileSync } from "node:child_process";
import { stringify } from "yaml";
import { linearClient, root } from "./lib/linear.mjs";

const { values: args } = parseArgs({
  options: {
    name: { type: "string" },
    type: { type: "string", default: "internal" },
    idea: { type: "string" },
    client: { type: "string" },
    preset: { type: "string", default: "standard" },
    out: { type: "string", default: process.cwd() },
  },
});
if (!args.name || !args.idea) {
  console.error('Usage: npm run intake -- --name "<name>" --idea "<idea>" [--type client|internal] [--client "<name>"] [--preset standard] [--out <dir>]');
  process.exit(1);
}

const linearConfigPath = join(root, "config/linear.json");
if (!existsSync(linearConfigPath)) {
  console.error("config/linear.json is missing. Run npm run linear:setup first.");
  process.exit(1);
}
const ids = JSON.parse(readFileSync(linearConfigPath, "utf8"));
const slug = args.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// 1. Config file
const config = {
  project: slug,
  type: args.type,
  ...(args.type === "client" ? { client: { name: args.client ?? "TBD", contact: "ceo" } } : {}),
  refs: { competitors: [], ui_liked: [], ui_disliked: [] },
  effort: { preset: args.preset },
  autopilot: { default: "gate", always_gate: { first_production_deploy: true, client_messages: true }, undo_window_hours: 24 },
  stack: { profile: "web" },
  i18n: { locales: ["en"], default: "en" },
  monitoring: { sentry_project: slug, posthog_project: slug, ship_gate: ["events", "errors", "replay", "alerts", "privacy"] },
};
const dir = join(args.out, "projects", slug);
mkdirSync(join(dir, "pipeline", "intake"), { recursive: true });
const configPath = join(dir, "warsha.yaml");
writeFileSync(configPath, "# yaml-language-server: $schema=https://raw.githubusercontent.com/eslam-nasser/warsha-ai/main/config/warsha.schema.json\n" + stringify(config));
execFileSync(process.execPath, [join(root, "scripts/validate-config.mjs"), configPath], { stdio: "inherit" });

// The orchestrator always asks for refs, even if the answer is none.
const missing = ["Competitor refs (links), or none", "UI refs the client likes, or none", "UI the client dislikes, or none", "Must-have features and hard limits"];
if (args.type === "client") missing.push("Client contact", "Deadline and budget");

const brief = `# Project brief: ${args.name}

**Idea.** ${args.idea}

**Type.** ${args.type}${args.client ? `, for ${args.client}` : ""}

**Effort preset.** ${args.preset}. **Autopilot.** gate on every stage.

**Config.** \`projects/${slug}/warsha.yaml\`

## Still missing

${missing.map((m) => `- ${m}`).join("\n")}
`;
writeFileSync(join(dir, "pipeline", "intake", "brief.md"), brief);

// 2. Linear project and brief document
const linear = linearClient();
const projectRes = await linear.createProject({
  name: args.name,
  description: args.idea.slice(0, 255),
  teamIds: [ids.teams.Ideas.id, ids.teams.Delivery.id],
  leadId: ids.ceo.id,
  statusId: ids.projectStatuses.Intake,
});
const project = await projectRes.project;
await linear.createDocument({ title: `Project brief: ${args.name}`, content: brief, projectId: project.id });
console.log(`Created Linear project ${project.name}: ${project.url}`);

// 3. Intake decision issue, in the fixed decision format
const answerBy = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
const issueRes = await linear.createIssue({
  teamId: ids.teams.Ideas.id,
  projectId: project.id,
  assigneeId: ids.ceo.id,
  labelIds: [ids.labels.decision, ids.labels.gate],
  dueDate: answerBy,
  title: `Intake: confirm the brief for ${args.name}`,
  description: `**Summary.** ${args.name} is in Intake. Clarify cannot start until the missing fields below are answered.

## Options

- **A. Answer the missing fields.** Upside: Clarify starts with real refs. Risk: none.
- **B. Answer "none" for the refs.** Upside: faster start. Risk: research and the taste board start from the problem statement only.
- **C. Kill the idea.** Upside: no spend. Risk: the idea is lost.

## Missing

${missing.map((m) => `- ${m}`).join("\n")}

## Recommendation

A. Refs make Research and UI concepts much better.

## Evidence

- Project brief document on this project
- Config: \`projects/${slug}/warsha.yaml\`

## Answer by

${answerBy}. If there is no answer by then, the project stays in Intake.`,
});
const issue = await issueRes.issue;
console.log(`Opened decision issue ${issue.identifier}: ${issue.url}`);

// 4. Exit check: the decision shows up in the CEO decisions view
const view = await linear.customView(ids.views["CEO decisions"]);
const inView = (await view.issues({ first: 100 })).nodes.some((i) => i.id === issue.id);
console.log(inView ? `ok   ${issue.identifier} shows in the CEO decisions view` : `FAIL ${issue.identifier} is not in the CEO decisions view`);
if (!inView) process.exit(1);

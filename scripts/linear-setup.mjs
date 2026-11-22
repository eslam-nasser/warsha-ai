// Sets up a Linear workspace for Warsha: teams, project statuses, labels and views.
// Usage: npm run linear:setup
// Reads LINEAR_API_KEY from .env.local. Safe to run again: it skips anything that already exists by name.
// Writes the ids it finds or creates to config/linear.json, which run-stage and intake read.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { linearClient, root, TEAMS, PROJECT_STATUSES, LABEL_GROUPS, views, all } from "./lib/linear.mjs";

const linear = linearClient();
const viewer = await linear.viewer;
const org = await linear.organization;
console.log(`Workspace: ${org.name} (${org.urlKey}). CEO: ${viewer.name}.`);

const out = { workspace: { id: org.id, urlKey: org.urlKey }, ceo: { id: viewer.id, name: viewer.name }, teams: {}, projectStatuses: {}, labels: {}, views: {} };
const log = (verb, what) => console.log(`${verb.padEnd(7)} ${what}`);

// Teams
const teams = await all(linear.teams());
for (const t of TEAMS) {
  let team = teams.find((x) => x.name === t.name || x.key === t.key);
  if (team) log("exists", `team ${team.name}`);
  else {
    const res = await linear.createTeam({ name: t.name, key: t.key, description: t.description });
    team = await res.team;
    log("created", `team ${team.name} (${team.key})`);
  }
  out.teams[t.name] = { id: team.id, key: team.key };
}

// Project statuses
const statuses = await all(linear.projectStatuses());
let position = Math.max(0, ...statuses.map((s) => s.position ?? 0));
for (const s of PROJECT_STATUSES) {
  let status = statuses.find((x) => x.name === s.name);
  if (status) log("exists", `project status ${s.name}`);
  else {
    position += 1;
    const res = await linear.createProjectStatus({ name: s.name, type: s.type, color: s.color, position });
    status = await res.status;
    log("created", `project status ${s.name} (${s.type})`);
  }
  out.projectStatuses[s.name] = status.id;
}

// Labels: workspace-level groups with their values
const labels = await all(linear.issueLabels({ includeArchived: false }));
for (const g of LABEL_GROUPS) {
  let group = labels.find((x) => x.name === g.name && x.isGroup);
  if (group) log("exists", `label group ${g.name}`);
  else {
    const res = await linear.createIssueLabel({ name: g.name, color: g.color, isGroup: true, description: g.description });
    group = await res.issueLabel;
    log("created", `label group ${g.name}`);
  }
  for (const v of g.values) {
    let lbl = labels.find((x) => x.name === v && !x.isGroup);
    if (lbl) log("exists", `label ${g.name}/${v}`);
    else {
      const res = await linear.createIssueLabel({ name: v, color: g.color, parentId: group.id });
      lbl = await res.issueLabel;
      log("created", `label ${g.name}/${v}`);
    }
    out.labels[v] = lbl.id;
  }
}

// Views
const existingViews = await all(linear.customViews());
for (const v of views({ ceoId: viewer.id, deliveryTeamId: out.teams.Delivery.id })) {
  let view = existingViews.find((x) => x.name === v.name);
  if (view) log("exists", `view ${v.name}`);
  else {
    const res = await linear.createCustomView({ ...v, shared: true });
    view = await res.customView;
    log("created", `view ${v.name}`);
  }
  out.views[v.name] = view.id;
}

writeFileSync(join(root, "config/linear.json"), JSON.stringify(out, null, 2) + "\n");
console.log("\nWrote config/linear.json. Next: npm run intake -- --name \"Warsha test\" --type internal --idea \"...\"");

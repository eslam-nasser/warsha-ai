// Shared Linear client and the Warsha workspace layout from docs/spec.md, section GUI: Linear setup.
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LinearClient } from "@linear/sdk";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function linearClient() {
  const envFile = join(root, ".env.local");
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const apiKey = process.env.LINEAR_API_KEY?.trim();
  if (!apiKey) {
    console.error("LINEAR_API_KEY is empty. Paste your key into .env.local, then run this again.");
    process.exit(1);
  }
  return new LinearClient({ apiKey });
}

export const TEAMS = [
  { key: "IDEA", name: "Ideas", description: "Intake. One issue per new idea or client request." },
  { key: "DEL", name: "Delivery", description: "All build work, across projects." },
];

// Project statuses are the pipeline stages. Type decides where Linear groups them.
export const PROJECT_STATUSES = [
  { name: "Intake", type: "backlog", color: "#95A2B3" },
  { name: "Clarify", type: "planned", color: "#5E6AD2" },
  { name: "Research", type: "planned", color: "#5E6AD2" },
  { name: "Edge", type: "planned", color: "#5E6AD2" },
  { name: "UI concepts", type: "planned", color: "#5E6AD2" },
  { name: "Spec", type: "planned", color: "#5E6AD2" },
  { name: "Build", type: "started", color: "#F2C94C" },
  { name: "Review", type: "started", color: "#F2994A" },
  { name: "Ship", type: "started", color: "#26B5CE" },
  { name: "Live", type: "completed", color: "#4CB782" },
  { name: "Killed", type: "canceled", color: "#EB5757" },
];

export const LABEL_GROUPS = [
  { name: "Type", color: "#5E6AD2", values: ["decision", "build", "review-finding", "bug-from-sentry", "client-request"] },
  { name: "Decision kind", color: "#F2994A", values: ["go-kill", "edge", "design", "ship", "unstick"] },
  { name: "Risk", color: "#EB5757", values: ["high-risk"], description: "Payments, auth, permissions, data deletion" },
  { name: "Mode", color: "#4CB782", values: ["gate", "notify", "autopilot"] },
];

const open = { state: { type: { nin: ["completed", "canceled"] } } };
const label = (name) => ({ labels: { some: { name: { eq: name } } } });

// `ceoId` and `deliveryTeamId` are filled in at run time.
export function views({ ceoId, deliveryTeamId }) {
  return [
    {
      name: "CEO decisions",
      description: "Open decision issues assigned to the CEO. The only view the CEO needs.",
      filterData: { and: [label("decision"), { assignee: { id: { eq: ceoId } } }, open] },
    },
    {
      name: "Portfolio",
      description: "All projects by status.",
      projectFilterData: { status: { type: { nin: ["canceled"] } } },
    },
    {
      name: "Notify feed",
      description: "Decisions taken in Notify mode in the last 7 days. Optional reading.",
      filterData: { and: [label("decision"), label("notify"), { createdAt: { gt: "-P7D" } }] },
    },
    {
      name: "Engine room",
      description: "All Delivery issues by project. For agents and engineers.",
      filterData: { team: { id: { eq: deliveryTeamId } } },
    },
    {
      name: "Stuck",
      description: "Unstick decisions: stages past the round cap or budget guard.",
      filterData: { and: [label("unstick"), open] },
    },
  ];
}

export async function all(connectionPromise) {
  // The SDK's fetchNext appends the next page to the same connection's nodes.
  const connection = await connectionPromise;
  while (connection.pageInfo.hasNextPage) await connection.fetchNext();
  return connection.nodes;
}

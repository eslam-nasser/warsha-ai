# Getting started

How to set up and run the Warsha framework from this repo. The full design is in [spec.md](spec.md).

## Repo layout

| Path | What it is |
|---|---|
| [docs/spec.md](spec.md) | The full build spec |
| [config/warsha.schema.json](../config/warsha.schema.json) | JSON Schema for a project's `warsha.yaml` |
| [config/linear.json](../config/linear.json) | Linear ids written by `npm run linear:setup` |
| [examples/](../examples/) | Example configs for a client project and an internal Spike run |
| [pipeline/stages.yaml](../pipeline/stages.yaml) | The eleven stages, their outputs and gates |
| [pipeline/effort.yaml](../pipeline/effort.yaml) | Dial levels and presets |
| [skills/run-stage/](../skills/run-stage/SKILL.md) | The v0 orchestrator skill (draft) |
| [templates/](../templates/) | Decision issue and experiment log templates |
| [scripts/](../scripts/) | `validate`, `linear:setup` and `intake` |
| [starter/](../starter/README.md) | The product starter template |

## Check the configs

Run `npm install` once, then `npm run validate`. It checks every example config and the pipeline files against the schema. CI runs the same check on every push.

## Set up a Linear workspace

1. Copy `.env.example` to `.env.local` and paste a Linear personal API key after `LINEAR_API_KEY=`. Git ignores `.env.local`.
2. Run `npm run linear:setup`. It creates the Ideas and Delivery teams, the stage statuses, the label groups and the five views. It skips anything that already exists, so it is safe to run again. On Linear's free plan, which allows two teams, it renames the workspace's default team to Delivery.
3. Run `npm run intake -- --name "My idea" --idea "..."` to start a project. It writes `projects/<slug>/warsha.yaml`, creates the Linear project and brief, and opens an intake decision issue. The issue lands in the CEO decisions view.

## Start a product

The starter lives in [starter/](../starter/README.md). Copy it into a new repo, fill in `.env.local` from its `.env.example`, then run `npm ci` and `npm run dev`. Run `npm run check` before every push.

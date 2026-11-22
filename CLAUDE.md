# Warsha

Warsha is a framework that takes a vague idea to a live, monitored product with Claude agents. This repo holds the framework itself: the spec, the config schema, the stage definitions, the skills and the templates. Products built with Warsha live in their own repos.

## Where things are

| Path | What it is |
| --- | --- |
| `docs/spec.md` | The full build spec. Exported from the Claude Docs doc linked at its top. The doc is the source of truth. |
| `config/warsha.schema.json` | JSON Schema for a project's `warsha.yaml`. |
| `examples/` | Example project configs. They must validate. |
| `pipeline/stages.yaml` | The eleven stages: order, inputs, outputs, decision kind, fail target. |
| `pipeline/effort.yaml` | Dial levels and presets. |
| `skills/` | Claude skills. `run-stage` is the v0 orchestrator. |
| `templates/` | Decision issue and experiment log templates. |
| `scripts/validate-config.mjs` | Validates configs against the schema. |

## Working rules

- Keep the repo synced. After each finished change, commit it and push to `origin main`. Do not leave work uncommitted at the end of a session.
- When the spec changes, update `docs/spec.md` and every file that copies a value from it (schema, `pipeline/*.yaml`, examples) in the same commit.
- Run `npm run validate` before committing a change to the schema, `pipeline/` or `examples/`.
- Stage keys are fixed: intake, clarify, research, edge, ui, spec, build, review, security, ship, monitor. Use them everywhere.
- Write prose in plain, short sentences. No em dashes.

---
name: run-stage
description: Warsha v0 orchestrator. Runs the next pipeline stage for one Warsha project. Reads the project config and Linear status, checks the gate, runs the stage at its effort dial, saves the output, applies the autopilot mode, and logs one experiment row. Use when the user says "run stage", "next stage", "run <stage> for <project>", or names a Warsha project and asks to move it forward.
---

# run-stage

Status: draft for v0. The CEO runs this by hand in Claude Code. Source of truth for behaviour is `docs/spec.md`, sections Orchestrator engine, Autopilot, Effort dials and Decision gates.

## Inputs

- `project`: the project slug. It names `projects/<slug>/warsha.yaml` in the product repo.
- `stage` (optional): a stage key from `pipeline/stages.yaml`. Without it, run the stage that matches the Linear project status.

## Files this skill reads

| File | What it gives |
| --- | --- |
| `projects/<slug>/warsha.yaml` | The project config. Validate it against `config/warsha.schema.json` first. |
| `pipeline/stages.yaml` | Stage order, inputs, outputs, decision kind, fail target. |
| `pipeline/effort.yaml` | Dial levels, presets and what each dial changes. |
| `projects/<slug>/pipeline/<previous stage>/` | The previous stage's saved output. Never chat history. |

## Steps

1. Load and validate the config. Stop with the validation errors if it fails.
2. Read the Linear project status through the Linear connector. Pick the stage.
3. Check the gate. If a decision issue for this project is open and unanswered, stop and report its link.
4. Work out the dial: the preset value from `pipeline/effort.yaml`, replaced by `effort.overrides.<stage>` when set. Map the level to models through config `models`.
5. Run the stage's agents at that dial. Builders never review their own work: reviewers run in fresh sessions.
6. Watch the budget. At `limits.stage_budget_alert` of the stage budget without finishing, open an unstick decision and stop.
7. Save the output in two places: a Linear project document, and `projects/<slug>/pipeline/<stage>/` in the repo.
8. Apply the mode: `autopilot.stages.<stage>`, else `autopilot.default`.
    - Gate: open a decision issue from `templates/decision-issue.md` and stop.
    - Notify: continue with the agent's pick and post a summary. The undo window is `autopilot.undo_window_hours`.
    - Autopilot: continue and record the pick with its reasons.
9. Force Gate when any of these hold: the round cap was hit, the budget guard fired, a reviewer flagged a high-risk change, this is the first production deploy and `always_gate.first_production_deploy` is true, or the output goes to a client and `always_gate.client_messages` is true.
10. Move the Linear status to the next stage's `linear_status`.
11. Append one row to `projects/<slug>/experiment-log.csv` using the columns in `templates/experiment-log.csv`.

## Rules

- Every stage is safe to run again. A rerun overwrites that stage's output folder and adds a new log row.
- Agents never message clients directly in v1. Client-facing output goes to the CEO or the named account contact.
- Build agents never get production credentials.
- Deterministic steps (lint, test, push) run as plain scripts, not as agent choices.

## Not built yet

- The per-stage agent prompts. Stage 1 to 3 reuse gstack and BMAD as they are for the first manual run.
- Cost capture per stage. Log human minutes and model spend by hand until this exists.

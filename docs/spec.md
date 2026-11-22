# Product Pipeline Framework: Build Spec

Source: [Build Spec doc](https://claude.ai/artifact/RUingkBXvvDEMK8Y2qZHc6). Exported Nov 22, 2026. Edit the doc first, then re-export here.

## Summary

This framework takes a vague idea and turns it into a deployed, monitored product, using Claude agents for almost all the work. One person, acting as CEO, makes five kinds of decisions and sees nothing else.

It is built for a software agency experiment. So it must work for client projects and internal products, track cost per project, and record enough data to show which stages can run without a human.

**Goals**

- Idea to live product with the CEO spending minutes, not days, per project
- Design quality close to award-level sites on public pages, and fast, minimal admin screens
- Every product ships with full error tracking and full usage tracking
- Effort is tunable per stage, so money goes where it matters for that project
- Each stage can move from human-gated to full autopilot as trust grows

**Not goals for version 1**

- A custom GUI. Linear is the GUI until two projects have run end to end.
- Removing human code review everywhere. Review depth follows risk.

- Mobile apps. Web only for now. Flutter apps are a later phase.
- Maintaining existing products. This version only starts new ones.
- Pricing and contracts. These come after the framework is proven.

**The stack in one line:** Linear for control, Claude and Claude Code for the work, Claude Design for UI, Vercel for hosting, Sentry and PostHog for monitoring.

## Principles and roles

**Principles**

1. **The CEO sees decisions, not work.** Anything that is not one of the five decision types stays out of the CEO's view.
2. **Every stage ends in a written output.** The next stage reads that output, not the chat history.
3. **Builders never review their own work.** Review runs in a fresh session, and at higher effort on a different model.
4. **Effort is a setting, not a habit.** Model choice, number of options and review rounds all come from the effort dial.
5. **Autopilot is earned.** A stage starts gated, moves to notify, then to autopilot once the log shows it is safe.
6. **No product ships blind.** Sentry and PostHog coverage is a ship condition, not a nice-to-have.
7. **References before design.** No screen is drawn until real examples have been collected and chosen.

**Roles**

| Role | Who | Does |
| --- | --- | --- |
| CEO | You | Sets effort and autopilot, answers decision issues |
| Client | Agency customer | Gives brief and refs, approves design and launch |
| Orchestrator | Claude | Runs the pipeline, opens decision issues, tracks cost |
| Stage agents | Claude Code agents | Research, design, plan, build |
| Review agents | Separate Claude sessions | Code, UX, security, tracking coverage |
| Human specialist | Optional, on call | Designer pass at high effort. The CEO is the on-call engineer in version 1 |

## Pipeline stages

&#91;embedded content: pipeline flow · 11 stages, what happens in each, 4 CEO gates\]

Work moves top to bottom. Review and the security check send failed work back to Build, and live errors re-enter as new issues.

| # | Stage | Input | Who works | Output | Default gate |
| --- | --- | --- | --- | --- | --- |
| 0 | Intake | Vague idea, refs, settings | Orchestrator asks, CEO answers | Project brief and config file | None |
| 1 | Clarify | Brief | Clarify agent, question rounds | Problem statement, users, scope, success measures | None |
| 2 | Research | Problem statement, competitor refs | Research agents | Market brief with sources | CEO: go or kill |
| 3 | Edge | Market brief | Strategy agent plus a critic | 2 to 3 edge options with a recommendation | CEO: pick the edge |
| 4 | UI concepts | Edge, UI refs, galleries | Design agent in Claude Design, design critic, copy and image agents | Taste board, design system, concepts with real copy and images | CEO, then client: pick the design |
| 5 | Spec and plan | Chosen edge and design | PM, architect and planner agents | PRD, architecture, event plan, Linear issues | None |
| 6 | Build | Linear issues | Claude Code agents, one issue each | Pull requests with tests | None |
| 7 | Review loop | Pull requests, staging link | Code, UX, tracking, content and SEO reviewers | Reviewer findings, fix issues | None, unless stuck |
| 8 | Security check | Reviewed code on staging | Security reviewers and scanners | Security report | None. Any blocker stops the ship. |
| 9 | Ship | Passing scorecard | Release agent | Production deploy, release notes | CEO, then client: ship or not |
| 10 | Monitor | Live product | Sentry, PostHog, triage agent | New issues, weekly health note | None |

**Stage notes**

- **0 Intake.** The orchestrator asks only for what is missing. It always asks for refs. See Kickoff intake.
- **1 Clarify.** Question rounds are capped by the effort dial. Questions go to the CEO only if they change scope or price. The rest get a stated assumption.
- **2 Research.** Starts from the competitor refs, then widens. Every claim carries a source link. For client work the output also covers a price and timeline estimate.
- **3 Edge.** For internal products: what makes us win. For client work: the client's goals, success measures and the one thing the product must do better than the refs.
- **4 UI concepts.** Comes before the task plan because the design changes scope. Concepts use real copy and real images, never filler. Full rules are in the UI quality and Content sections.
- **5 Spec and plan.** The plan includes a PostHog event plan and a Sentry plan as first-class parts, not add-ons.
- **6 Build.** Each agent works in its own branch on one issue. Agents get a small, fixed tool set. Lint and tests run locally before any push.
- **7 Review loop.** Reviewers run in fresh sessions and score against fixed checklists. Failed items go back to Build. The loop stops at the round cap and opens a decision issue.
- **8 Security check.** Runs on the reviewed code before anything reaches production. Blockers go back to Build. See Security check.
- **9 Ship.** The first production deploy of a project is always gated, even on full autopilot, until the CEO turns that off.
- **10 Monitor.** A new Sentry error opens a Linear issue. The triage agent labels it and a build agent picks it up.

## Kickoff intake

Every project starts with one short intake. The orchestrator fills what it can from the idea text and asks only for the gaps. It always asks for refs, even if the answer is "none".

| Field | Required | Used by |
| --- | --- | --- |
| Idea, in any form | Yes | Clarify |
| Project type: client or internal | Yes | Gates, cost tracking, outputs |
| Client name and contact | Client only | Client gates, reports |
| Competitor refs (links) | Ask always | Research starts here |
| UI refs the client likes (links, screenshots) | Ask always | Seeds the taste board |
| UI the client dislikes | Ask always | Design critic's reject list |
| Brand assets: logo, colours, fonts | If they exist | Design system |
| Must-have features and hard limits | If known | Clarify, Spec |
| Deadline and budget | Client only | Effort preset, plan |
| Effort preset and per-stage overrides | Yes, defaults offered | Every stage |
| Autopilot mode, project and per stage | Yes, defaults offered | Every stage |

**How refs are used**

- **Competitor refs** are studied first: features, pricing, reviews, weak points. Research then looks for players the client did not name.
- **Liked UI refs** go straight onto the taste board. The design agent adds gallery examples in the same style so there is a wider set to pick from.
- **Disliked UI refs** become rules the design critic checks against.
- **No refs given:** the design agent builds the whole taste board from the galleries, and research starts from the problem statement.

The intake produces two things: a project brief in Linear and a config file in the repo. See Project config.

## Effort dials

Each stage has its own dial from 1 to 5. A preset fills every dial, then any single dial can be overridden. Example: preset Standard with UI at 5 and Research at 2.

**What a dial level means**

| Level | Models | Options produced | Review rounds | Extras |
| --- | --- | --- | --- | --- |
| 1 | Haiku | 1 | 1 | None |
| 2 | Sonnet | 1 to 2 | 1 | None |
| 3 | Sonnet, Opus for planning and review | 3 | Up to 3 | Critic agent |
| 4 | Opus | 4 | Up to 4 | Critic plus second reviewer |
| 5 | Opus, Fable for the hardest calls | 5 or more, two rounds | Up to 5 | Second-model check, optional human specialist |

Model names are tiers, not fixed versions. The config maps each tier to the current model, so a new release is a one-line change.

**What the dial changes in each stage**

| Stage | Low (1 to 2) | Mid (3) | High (4 to 5) |
| --- | --- | --- | --- |
| Clarify | 1 question round | 2 rounds | 3 rounds plus a challenge pass on the idea |
| Research | One pass, named competitors only | Deep research | Deep research plus comparable markets |
| Edge | 1 recommendation | 3 options | 3 options, each attacked by a critic |
| UI concepts | 1 concept, 10 refs | 3 concepts, 15 to 20 refs | 5 concepts, two rounds, human designer pass |
| Spec and plan | Short spec | PRD and architecture | PRD, architecture, risk review |
| Build | One agent per issue | Same, plus test coverage target | Same, plus a second agent on hard issues |
| Review loop | Code review only | Code, UX, security | All reviewers, different model, browser QA on every flow |

**Presets**

| Preset | Dials | Use for |
| --- | --- | --- |
| Spike | All at 1 to 2 | Throwaway prototypes, idea tests |
| Standard | All at 3 | Most client work |
| Flagship | All at 4 to 5 | Showcase products, high-value clients |
| Design-led | UI at 5, the rest at 2 to 3 | Marketing sites, brand-heavy work |
| Admin tool | UI at 2, Build and Review at 4 | Internal dashboards, back-office tools |

**Budget guard.** Each stage has a token budget that comes from its dial. When a stage hits 80% of budget without finishing, the orchestrator opens a decision issue: raise effort, cut scope, or stop.

## Autopilot

Every stage runs in one of three modes. A project-level default sets all stages, and any stage can override it.

| Mode | What happens at the end of the stage | CEO effort |
| --- | --- | --- |
| Gate | Work stops. A decision issue is opened and waits. | Answer required |
| Notify | Work continues with the agent's recommendation. A summary is sent. | Read if you want, undo within the window |
| Autopilot | Work continues silently. Everything is logged. | None |

**Rules**

- In Notify mode the CEO has an undo window (default 24 hours) before work built on that choice is treated as final.
- On Autopilot, the agent's recommendation is taken as the decision and recorded with its reasons.
- Two actions stay gated by default even on full autopilot: the first production deploy of a project, and anything sent to a client. Each can be switched off per project.
- Any stage drops back to Gate on its own when it hits the round cap, the budget guard, or a reviewer flags a high-risk change (payments, auth, data deletion).

**Earning autopilot**

A stage is ready to move up a mode when the experiment log shows, over the last 5 projects:

- The CEO accepted the agent's recommendation without changes at least 4 times out of 5
- No rollback or client complaint traced back to that stage

These numbers are starting points. Tune them after the first few projects.

## Decision gates

The CEO makes five kinds of decisions. Each arrives as one Linear issue in a fixed format.

| # | Decision | When | What the CEO gets |
| --- | --- | --- | --- |
| 1 | Go or kill | After Research | Market size, top competitors, risks, price estimate for client work |
| 2 | Pick the edge | After Edge | 2 to 3 options, each with the case for and against |
| 3 | Pick the design | After UI concepts | Taste board and concepts, side by side, with the critic's scores |
| 4 | Ship or not | After Review | One-page scorecard and a staging link |
| 5 | Unstick | Any time a stage hits a cap | What is stuck, cost so far, three ways forward |

**Decision issue format**

- **Title:** the question in one line
- **Summary:** three sentences at most
- **Options:** two or three, each with one line of upside and one of risk
- **Recommendation:** the agent's pick and why
- **Evidence:** links to the full output, for when the CEO wants to dig
- **Answer by:** a date, and what happens if there is no answer

The CEO answers with one comment: an option letter, or a short instruction.

**Client gates**

Client projects add a second layer on two decisions. The order is always CEO first, then client.

| Gate | CEO sees | Client sees |
| --- | --- | --- |
| Design | All concepts and scores | Only the concepts the CEO approved |
| Ship | Full scorecard | Staging link, summary of what was built, known limits |

Client answers come back through the CEO or a named account contact in version 1. Agents do not message clients directly.

## GUI: Linear setup

Linear is the whole GUI for version 1. The CEO uses one view. Agents and any human engineers use the rest.

**Structure**

| Linear object | Used for |
| --- | --- |
| Workspace | The agency |
| Team: Ideas | Intake. One issue per new idea or client request. |
| Team: Delivery | All build work, across projects |
| Project | One per product. Holds the brief, config link and all documents. |
| Initiative | One per client, grouping that client's projects |
| Project documents | Market brief, edge thesis, PRD, scorecards |
| Issues | Build tasks, review findings, Sentry errors, decision issues |

**Project statuses (the pipeline stages)**

Intake, Clarify, Research, Edge, UI concepts, Spec, Build, Review, Ship, Live, Killed.

**Labels**

| Label group | Values |
| --- | --- |
| Type | decision, build, review-finding, bug-from-sentry, client-request |
| Decision kind | go-kill, edge, design, ship, unstick |
| Risk | high-risk (payments, auth, data deletion) |
| Mode | gate, notify, autopilot |

**Views**

| View | Filter | For |
| --- | --- | --- |
| CEO decisions | Label decision, assigned to CEO, open | The CEO. This is the only view the CEO needs. |
| Portfolio | All projects by status | CEO, at a glance |
| Notify feed | Label decision, mode notify, last 7 days | CEO, optional reading |
| Engine room | All Delivery issues by project | Agents and engineers |
| Stuck | Issues past the round cap or budget guard | Whoever is on call |

**How agents plug in**

- The orchestrator reads and writes Linear through the Linear connector: creates projects, moves statuses, opens decision issues.
- Build issues are delegated to a coding agent. Linear's own agent can run Claude Code in the cloud and return a draft pull request. Claude Code on our own machines is the fallback.
- The CEO gets a phone notification for each decision issue from the Linear mobile app.

**When to build a custom cockpit**

Only after two full projects. The likely gaps are side-by-side design comparison and an effort and autopilot control panel. If those hurt in practice, build a small web app on top of the same Linear data. Do not replace Linear.

## Claude stack

Claude does every stage. Other tools only hold state (Linear), host (Vercel) or monitor (Sentry, PostHog).

| Stage | Claude surface | Agent or skill | Reuse from |
| --- | --- | --- | --- |
| Intake, orchestration | Claude with the Linear connector | Orchestrator skill (new) | None |
| Clarify | Claude Code | Clarify skill | gstack office-hours as a base |
| Research | Claude deep research | Research skill, comparable-market-scan skill | Existing skill |
| Edge | Claude Code | Strategy agent, critic agent | gstack CEO review as a base |
| UI concepts | Claude Design | Reference scout, design agent, design critic | New |
| Spec and plan | Claude Code | PM, architect, planner agents | BMAD planning workflows |
| Build | Claude Code, cloud or local | Build agents, one per issue | Standard Claude Code |
| Review loop | Claude Code, fresh sessions | Code, UX, security, tracking reviewers | gstack review, QA and security skills |
| Ship | Claude Code with the Vercel connector | Release agent | gstack ship as a base |
| Monitor | Scheduled Claude tasks with Sentry and PostHog connectors | Triage agent, weekly health note | New |

**Skills to write ourselves**

1. Orchestrator: reads the config, runs stages, applies effort and autopilot, opens decision issues, logs cost
2. Reference scout: collects gallery examples and builds the taste board
3. Design critic: scores screens against the taste board from screenshots
4. Tracking reviewer: checks Sentry and PostHog coverage against the spec
5. Scorecard: merges all reviewer results into the one-page ship decision
6. Client pack: proposal, weekly status, handover

**Project starter template**

One repo template that every product starts from: Next.js on Vercel, Sentry and PostHog already wired, a design-token file, the admin layout shell, CI with lint, tests and performance checks, and the rule files the agents read.

**Stack profiles and database**

The template comes in two profiles. The architect agent picks one in stage 5 and records the reason. A switch after Build has started is an Unstick decision.

|  | Web profile (default) | Backend-heavy profile |
| --- | --- | --- |
| Use when | Mostly screens and simple data: sites, dashboards, CRUD apps | Long-running jobs, heavy integrations, data processing, real-time, complex business rules |
| Frontend | Next.js on Vercel | Next.js on Vercel |
| Backend | Next.js server routes | A separate API service, plus background workers and a job queue |
| Backend hosting | Vercel | A container host, one per product |
| Database | Managed Postgres | Managed Postgres, plus Redis for queues and caching |
| Sentry and PostHog | Frontend and server routes | Frontend, API service and every worker |

**Database rules, both profiles**

- Postgres is the default. Another database needs a written reason in the architecture doc.
- Every schema change is a migration file in the repo. No manual changes to a live database.
- Each product gets separate databases for preview, staging and production. Build agents never get production credentials.
- Any migration that drops or rewrites data is labelled high-risk and always gated.
- Automatic backups are on before the first production deploy, and a restore is tested once per product.
- At Build dial 4 and above, a database reviewer checks schema, indexes and slow queries.

**Chosen stack**

One language everywhere, common tools that agents know well, and nothing that locks a client in.

| Layer | Choice | Why |
| --- | --- | --- |
| Language | TypeScript, frontend and backend | One language for every agent and reviewer |
| Frontend | Next.js, React, Tailwind, shadcn/ui | Most common modern setup, easy to restyle per design system |
| Frontend hosting | Vercel | Preview link for every pull request |
| Database | Postgres on Supabase | Database, login and file storage in one service |
| Schema and migrations | Drizzle | Plain SQL underneath, so the database can move to any Postgres host |
| Login | Supabase Auth | Comes with the database, covers email and social login |
| Validation | Zod | Same rules shared by frontend and backend |
| Backend service (backend-heavy only) | Node with Fastify | Small, fast, no heavy framework to fight |
| Jobs and queue (backend-heavy only) | BullMQ on Redis | Standard for background jobs in Node |
| Backend hosting (backend-heavy only) | Railway | Simple container hosting with workers and Redis |
| Tests | Vitest for code, Playwright for browser flows | Fast, and the QA agent already drives a browser |
| Email and payments, when needed | Resend for email. Payments: Moyasar in Saudi Arabia, Paymob in Egypt | Local processors, so customers get the local payment methods they expect |

A client can ask for a different stack. That is recorded in the project config and priced in at stage 2.

**Agent rules**

- Small, fixed tool set per agent.
- Deterministic steps (lint, test, push) run as plain scripts, not as agent choices.
- Each build agent works in an isolated environment with no production access.
- A hard cap on CI retries per task, then hand off.

## Orchestrator engine

The orchestrator is built in three versions. Move up only when the version below starts to hurt.

| Version | What triggers a stage | What it needs | When to use |
| --- | --- | --- | --- |
| v0 | The CEO runs one skill, `run-stage`, in Claude Code | Nothing extra | Now, for all manual testing |
| v1 | A scheduled Claude task checks Linear every hour and runs whatever is ready | A scheduled task | When pressing the button becomes the bottleneck |
| v2 | Linear webhooks start agents at once | A small always-on service | Only if the hourly wait is a real problem |

**What `run-stage` does**

1. Reads the project config and the Linear project status.
2. Checks the gate: if a decision issue is open and unanswered, it stops.
3. Runs the agents for that stage at the effort the config sets.
4. Saves the output as a Linear document and in the repo under `pipeline/<stage>/`.
5. Opens a decision issue, sends a notify summary, or moves on, depending on the autopilot mode.
6. Moves the Linear status and writes one row to the experiment log.

**State rules**

- Linear holds the status, decisions and documents. The repo holds the config and stage outputs. Nothing lives only in a chat session.
- Every stage is safe to run again. A crash or a bad run is fixed by running the stage again.
- A stage never reads chat history. It reads the previous stage's saved output.

## Localization

Every product is built ready for more languages, even when it ships in English only. English is just the first locale. Adding Arabic later means adding one translation file and turning on right-to-left.

**Rules in the starter template**

- All user-facing text lives in message files, loaded with next-intl. No text is written inside components.
- Layout uses start and end, never left and right, so the whole interface flips for right-to-left with one setting.
- Dates, numbers and currency go through the locale formatter.
- Fonts must cover Arabic as well as Latin.
- Icons that point in a direction (arrows, back buttons) flip with the layout.
- Images carry no text, so they never need translating.

**Lint rules, enforced in CI**

| Rule | Tool | Fails the build when |
| --- | --- | --- |
| No hardcoded text | eslint-plugin-i18next | A component contains literal user-facing text |
| No left or right styling | Custom ESLint rule on class names | A class like `ml-`, `pr-`, `left-` or `text-left` is used |
| No manual date or number formatting | Custom ESLint rule | Code formats dates or numbers without the locale formatter |
| Message keys in sync | Script in CI | A key exists in one locale file but not another |

The same rules are written into the agents' rule files, so build agents follow them before lint has to catch them. When a product has an Arabic locale, the UX reviewer checks every screen in both directions.

## UI quality system

The rule: no screen is designed from a blank prompt. Every design starts from real, chosen references and is judged against them by a separate critic.

**Step by step**

1. **Collect.** The reference scout gathers 15 to 20 real examples (10 at low effort). Client refs come first, galleries fill the rest.
2. **Taste board.** The CEO picks 2 to 3 references. This is part of the design gate. The pick is recorded with the reasons.
3. **Design system.** The design agent turns the taste board into tokens in Claude Design: colour, type scale, spacing, radius, motion, component rules.
4. **Concepts.** The agent produces the number of concepts the UI dial asks for, on the key screens only.
5. **Critic.** A separate agent scores each concept against the taste board from screenshots, and rejects anything on the slop list.
6. **Gate.** CEO picks one direction. For client work the client then confirms.
7. **Carry forward.** Design tokens and screen specs become build issues of their own. The UX reviewer checks the built screens against the chosen concept.

Step 7 exists because agents tend to drop the design direction between planning and code unless it is turned into build tasks.

**Galleries to pull from**

| Surface | Sources |
| --- | --- |
| Public and marketing pages | Awwwards, Godly, Land-book, SaaS Landing Page |
| App screens and flows | Mobbin, Refero |
| Admin and dashboards | Linear, Vercel and Stripe dashboards as the style bar |

Some galleries need a paid login to see full flows. Budget one Mobbin or Refero seat.

**Slop list (auto-reject)**

- Default purple or blue gradients and glowing blobs
- Stock three-column feature grid with generic icons
- Emoji used as icons
- Centered hero with a vague headline and two buttons, when the taste board shows something else
- Mixed corner radii, shadows or spacing that do not match the tokens
- Placeholder copy or fake testimonials

**Two tracks**

|  | Public track | Admin track |
| --- | --- | --- |
| Goal | Award-level look and feel | Minimal, dense, very fast |
| Motion | Allowed, part of the brief | Almost none |
| Layout | Custom per product | One shared shell across all products |
| Components | Built to the design system | One fixed component set, no new ones without a reason |
| Speed targets | Page load under 2.5 s on mobile | Page load under 1.5 s, clicks respond under 100 ms |
| Checked by | Design critic, UX reviewer | Performance check on every pull request, UX reviewer |

The speed targets are starting points to adjust per project.

**Honest limit**

Agents with strong references and a hard critic get close to award level, but not reliably. At UI dial 5, plan for a human designer pass on the key public pages.

## Content: copy and images

Claude writes all copy and makes all images. Both follow the same pattern as design: good inputs first, then a separate reviewer on the output. Nothing generic ships.

**Copy**

- **Input:** a product context file built from stages 1 to 3: who the user is, the problem, the edge, the tone, words to use and words to avoid.
- **Writer:** the copy agent uses the copywriting and copy-editing skills from [marketingskills](https://github.com/coreyhaines31/marketingskills). The unslop skill runs over every draft.
- **Timing:** first draft with the UI concepts in stage 4, so designs are judged with real words. Final copy in Build.
- **Copy reviewer checks:** every claim is backed by the spec, no invented numbers, customers or testimonials, one clear action per page, plain words, and all text sits in message files.

**Images: inputs**

The order of preference is fixed, because the fastest way to look generated is to generate everything.

1. Real assets from the client: product photos, team photos, brand graphics.
2. Real screenshots of the product itself.
3. Type, layout, colour and motion doing the work, with no image at all.
4. Generated images, only where the design calls for one.

Every generated image starts from a written image brief, not a one-line prompt:

| Brief field | Comes from |
| --- | --- |
| Purpose on the page | The screen spec |
| Subject and composition | The design concept |
| Style references | The taste board, attached as reference images |
| Colour palette | The design tokens |
| Lighting, mood, level of detail | The taste board |
| Size and aspect ratio | The layout |
| What to avoid | The image slop list below |

One style brief is written per product and reused for every image, so the set looks like one hand made it.

**Images: generation**

- Model: GPT Image by default, set in the config so it can be swapped in one line.
- Candidates per image follow the UI dial: 2 at low effort, 4 at mid, 8 at high.
- No text inside images. Text is added in the layout so it can be translated.
- No generated people presented as real customers, staff or testimonials.

**Images: review**

A separate image reviewer scores every candidate against the taste board and the brief. It never sees the prompt, only the image, the brief and the page it sits on.

| Check | Reject when |
| --- | --- |
| Style match | It does not look like it belongs with the taste board |
| Set consistency | It does not match the other images on the product |
| Palette | Colours fall outside the design tokens |
| Detail quality | Warped hands, faces, objects, or garbled shapes and letters |
| Generated look | Waxy skin, glossy plastic surfaces, over-smooth lighting, stock-photo poses |
| Subject | Generic scene that could sit on any website |
| Fit | Wrong crop, or the focal point fights the text on the page |

Rejected images are regenerated with the reviewer's notes, up to the round cap. If none pass, the reviewer recommends dropping the image and using option 3. Final image sets are shown in the design gate with the concepts.

**No API key**

Without an image model key, the pipeline uses clearly labelled placeholder images. Each placeholder is listed on the scorecard, so it cannot reach production unnoticed.

## Scorecard and ship rule

This is the simple version, built to cover most problems with little setup. Tune it after real runs.

**Reviewer output**

Every reviewer returns the same three lists.

| Level | Meaning | Effect |
| --- | --- | --- |
| Blocker | Broken, unsafe, or wrong for the user | Must be fixed. Stops the ship. |
| Major | Clearly worse than it should be | Fixed if rounds remain. Counted on the scorecard. |
| Minor | Polish | Logged as a Linear issue for later |

**Ship rule:** zero blockers, and at most three majors in total.

**Scorecard lines**

Each line is pass or fail. The CEO sees this one page at the ship gate.

| Line | Passes when | Checked by |
| --- | --- | --- |
| Build and tests | CI is green, tests cover the core flows | CI |
| Core flows | Every flow in the spec works in a real browser on staging | QA reviewer |
| Code quality | No blockers from code review | Code reviewer |
| Security | No blockers from the security check | Stage 8 |
| Design and content | Design critic, copy reviewer and image reviewer all pass. No placeholders left. | Stage 7 reviewers |
| Tracking | Sentry and PostHog ship gate checks pass | Tracking reviewer |
| Speed | Speed targets for each track are met | Performance check |
| Localization | Lint rules pass. Both directions checked if Arabic is on. | CI, UX reviewer |
| SEO and AEO | Checklist passes on every public page | SEO reviewer |

## Security check

Stage 8 runs after the review loop and before any production deploy. It has three layers.

| Layer | When | Tool | Finds |
| --- | --- | --- | --- |
| Pull request review | Every pull request, during Build | [Claude Code security review](https://github.com/anthropics/claude-code-security-review) as a GitHub action | Injection, broken auth, unsafe data handling in the changed code |
| Deep audit | Stage 8, on the whole product | Code audit skills from [Trail of Bits](https://github.com/trailofbits/skills): static analysis and a review of everything that changed | Deeper flaws that only show across files |
| Scanners | Every pull request and stage 8 | Secret scanner and dependency scanner in CI | Leaked keys, known-vulnerable packages |

**Rules**

- Any blocker stops the ship and goes back to Build. The round cap applies.
- Only the code audit skills from Trail of Bits are installed. Their smart contract and malware skills are not needed.
- Changes to payments, login, permissions and data deletion are high-risk. They get the deep audit even at low effort, and the CEO sees them listed on the scorecard.
- The security reviewer checks the basics by hand as well: every route checks who the user is, database access rules are on, secrets are only in the host's secret store, and error messages leak nothing.
- Security skills are installed from their official repos only, and pinned to a version.
- The security report is saved with the project and included in the client handover pack.

## SEO and AEO

Required on every public page. SEO is for search engines. AEO is for AI assistants that answer questions and quote sources. The SEO reviewer checks this list in stage 7.

| Area | Check |
| --- | --- |
| Rendering | Public pages are server-rendered, so content is in the HTML |
| Metadata | Unique title and description per page, social share image |
| Structure | One main heading per page, headings in order, descriptive link text |
| Structured data | Schema markup for the organization, product, FAQ and articles where they apply |
| Crawling | Sitemap, robots file, canonical links, no broken links |
| Speed | Public track speed targets met |
| Answers | Key pages state plainly what the product is, who it is for, and what it costs |
| Questions | Real customer questions answered in short, direct paragraphs |
| AI access | An llms.txt file, and AI crawlers are not blocked by accident |
| Languages | Language tags set per locale, ready for Arabic pages |

Admin screens and logged-in pages are excluded and marked as not indexable.

## Sentry and PostHog standards

Both tools are in the starter template, so no product can start without them. Coverage is checked before every ship.

**Sentry: required setup**

- Error capture on frontend, backend, API routes and background jobs
- Performance tracing on every request and key user action
- Session replay on errors
- Source maps uploaded on every build, so stack traces are readable
- Release tracking, so each error is tied to a deploy
- User and project context on every event, with personal data scrubbed
- Alerts: new error type, error spike, slow endpoint
- A separate Sentry project per client product

**PostHog: required setup**

- Autocapture for clicks, page views and form submits
- Session replay, with sensitive fields masked
- A named event for every action in the spec's event plan
- User identification after login, and group analytics for accounts where relevant
- Funnels for the core flows defined in the spec
- Feature flags for anything risky, so it can be turned off without a deploy
- A separate PostHog project per client product

**The event plan**

Written in stage 5, as a table in the PRD: user action, event name, properties, which funnel it belongs to. Build agents implement it. The tracking reviewer checks it.

**Ship gate checks**

| Check | Pass condition |
| --- | --- |
| Event coverage | Every action in the event plan fires its event on staging |
| Error coverage | A forced test error on each layer shows up in Sentry with a readable stack trace |
| Replay | A staging session is viewable in both tools |
| Alerts | Alert rules exist and route to Linear |
| Privacy | Masking rules are on, no personal data in event properties |

**After launch**

- A new Sentry error opens a Linear issue with the label bug-from-sentry.
- The triage agent groups duplicates, sets priority and delegates to a build agent.
- A weekly health note per product goes to the Notify feed: error count, slowest pages, funnel drop-offs.

**What this does not catch**

Sentry sees crashes and thrown errors. It does not see wrong behaviour that runs without failing, such as a bad price calculation. Those are covered by the QA reviewer's flow tests before ship and by PostHog funnels after.

## Agency layer

The pipeline is an agency experiment, so each project must answer three questions: did the client get what they paid for, did we make money, and what did we learn.

**Client vs internal projects**

|  | Client project | Internal product |
| --- | --- | --- |
| Stage 2 gate | Take the job, and at what price | Go or kill |
| Stage 3 | Client goals and success measures | Our edge in the market |
| Design and ship gates | CEO, then client | CEO only |
| Outputs | Proposal, weekly status, handover pack | None extra |
| Ownership | Own repo, Sentry and PostHog projects, handed over at the end | Ours |

**Cost tracking**

The orchestrator logs, per stage: model spend, tool costs, human minutes (CEO and any specialist). At the end of each project it reports total cost against the price charged.

**Client outputs, generated from pipeline data**

- **Proposal:** scope, timeline, price, from stages 1 and 2
- **Weekly status:** what shipped, what is next, decisions needed from the client
- **Handover pack:** repo access, architecture summary, event plan, runbook, monitoring logins

**Experiment log**

One row per stage per project. This is the data that tells us what to tune and which stages have earned autopilot.

| Measure | Why it matters |
| --- | --- |
| Time in stage | Finds the slow stages |
| Cost in stage | Finds where effort is wasted |
| Review rounds used | Shows if the build quality is improving |
| CEO interventions and overrides | The main signal for autopilot readiness |
| Recommendation accepted as-is, yes or no | Same |
| Defects found after ship | Shows what review is missing |
| Client change requests after the design gate | Shows if clarify and design are working |
| Margin per project | The business result |

Keep the log in a simple table to start. Move it to a dashboard once there are five or more projects.

## Project config

One file per project, stored in the repo and linked from the Linear project. The orchestrator reads it before every stage. Changing a value takes effect at the next stage.

```yaml
project: acme-booking
type: client            # client | internal
client:
  name: Acme
  contact: account-lead

refs:
  competitors:
    - https://example.com/competitor-a
    - https://example.com/competitor-b
  ui_liked:
    - https://example.com/site-they-love
  ui_disliked:
    - https://example.com/site-they-hate
  brand_assets: ./brand/

constraints:
  deadline: 2027-01-31
  budget_usd: 12000

effort:
  preset: standard       # spike | standard | flagship | design-led | admin-tool
  overrides:
    ui: 5
    research: 2

autopilot:
  default: notify        # gate | notify | autopilot
  stages:
    research: gate
    edge: gate
    ui: gate
    ship: gate
  always_gate:
    first_production_deploy: true
    client_messages: true
  undo_window_hours: 24

limits:
  review_round_cap: 3    # set by the review dial unless stated
  ci_retry_cap: 2
  stage_budget_alert: 0.8

models:                  # tier to model, one place to update
  fast: haiku
  mid: sonnet
  top: opus
  peak: fable

ui:
  tracks: [public, admin]
  galleries: [awwwards, godly, mobbin, refero]
  human_designer_pass: true

stack:
  profile: web           # web | backend-heavy

i18n:
  locales: [en]          # add ar to turn on Arabic and right-to-left
  default: en

content:
  image_model: gpt-image # swap in one line
  image_api_key_set: false   # false means labelled placeholders

security:
  pr_review: true
  deep_audit: true
  scanners: [secrets, dependencies]

seo_aeo: true            # required on public pages

monitoring:
  sentry_project: acme-booking
  posthog_project: acme-booking
  ship_gate: [events, errors, replay, alerts, privacy]
```

The links, dates and amounts above are placeholders.

## Build plan

Build in five steps. Each step has an exit condition. Do not start the next step until the current one meets it.

1. **Foundations.** Set up the Linear workspace (teams, statuses, labels, views). Create the starter repo with Sentry, PostHog, CI and the admin shell. Agree the config schema.
   - Exit: a test project can be created from intake and shows up in the CEO decisions view.
2. **Manual run on an internal idea.** Run one small internal product through all eleven stages at the Spike preset, using gstack and BMAD as they are, with Claude acting as orchestrator by hand. Log every point where it breaks or needs you.
   - Exit: a live product, plus a written list of gaps.
3. **Write the custom skills.** Orchestrator, reference scout, design critic, tracking reviewer, scorecard. Build them in the order the gap list says hurt most.
   - Exit: the same internal product can be rebuilt with the CEO touching only decision issues.
4. **First client project.** Standard preset, every stage on Gate, human engineer on call for review. Add the client pack skill. Fill the experiment log.
   - Exit: client accepts the product, and the project shows a positive margin.
5. **Tune and loosen.** Review the experiment log. Move the safest stages to Notify. Decide on the custom cockpit based on what hurt in Linear.
   - Exit: second client project runs with fewer CEO interventions than the first.

**What to buy or set up**

- Linear plan with agents enabled, connected to GitHub
- Claude plan with Claude Code and Claude Design for everyone who runs the pipeline
- Vercel, Sentry and PostHog accounts with one project per product
- One paid gallery seat (Mobbin or Refero)

* An image model API key. Optional: without it the pipeline uses labelled placeholders.

## Open questions

- [ ] Do we use Linear's cloud coding agent, Claude Code on our own machines, or both?
- [ ] What is the monthly model budget for the experiment?
- [ ] Who talks to clients in version 1: the CEO, or an account lead?
- [ ] Which internal idea do we use for the first manual run?

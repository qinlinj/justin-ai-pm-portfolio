# Agent instructions

## Scope and source of truth

- Preserve this existing portfolio and its clean technical visual language. Do not replace it with a starter.
- GitHub main is the editorial source of truth. Pull before editing. Work on a scoped branch and submit a PR; do not overwrite unrelated work.
- Keep code, comments, identifiers, README, agent instructions, documentation and commit/PR messages in English. Chinese is allowed in localized UI content and generated translations only.
- Edit Chinese resources, not generated zh.html or data.zh.js. Run the locale generator after content changes and commit its output.

## Content integrity

- Display name: Justin Jia. Never substitute another personal name.
- Never invent employment, clients, scale, dates, metrics, or shipped work. Keep verified experience, independent projects, method examples, and design studies distinguishable.
- Preserve all supplied metrics and their exact meanings: checkout operations +4.2%, authentication failures reduced by 40%, 27 endpoints, checkout conversion +15%, manual database management time -35%, 5TB+, millions of transactions, 1TB+, query performance +40%.
- GTSP: Software Engineer, SVIG, Nov 2024 – Present. Confirmed customer support Agent work includes document Q&A and refund/order-change workflows. Architecture notes do not imply every described component was deployed.
- Remex: Founder, May 2026 – Present, early-stage AI Agent venture with 1–2 completed projects. Trip planning Agent work is completed; text-to-video Agent work is in development. Preserve Propose → Approve → Record and named human approval before irreversible actions. Four desk examples are method examples, not four client engagements.
- Cloud Crafters: Founder, Mar 2024 – Oct 2024, earlier one-person engineering consulting business, not an AI Agent venture. Do not force unrelated links to agents.
- DeFiner: Software Development Engineer Intern, Jun 2023 – Sep 2023.
- Independent projects: SpringCloud platform, Jun 2024 – Oct 2024; Twitter analytics, Oct 2023 – Feb 2024. Proposed improvements to past projects must not be called shipped features.
- Education: M.S. Information Systems Management, Carnegie Mellon University, Aug 2022 – Dec 2023; B.S. Management Information Systems, Beijing Jiaotong University and Rochester Institute of Technology joint program, Aug 2018 – Jun 2022.
- Preserve nine architecture notes, their depth, and the How I Think framework. Five standalone studies remain explicitly design work; allocated notes retain scope caveats.
- Contact destinations remain about:blank until explicitly supplied for publication. Do not infer personal contact details from GitHub authentication or resume handles.

## UI requirements

- English default, working EN / Chinese switcher, natural professional Chinese rather than literal translation.
- Preserve sticky top:0 navigation, accurate section targets, reduced-motion support and accessible disclosure controls.
- Profile and reflection panels expand together. Center logo, framework arrows, and contact content. Keep mobile touch targets generous and prevent horizontal overflow.
- Use restrained cream, dark green, rounded glass cards; no purple gradients or stock AI imagery.

## Verification and delivery

Run `python3 scripts/build-locales.py` and `python3 scripts/check.py`. Confirm regenerated outputs are committed. For UI changes, inspect both languages on desktop and mobile, section jumps, disclosure animation, and profile synchronization. Report any verification limits honestly.

Use task branches and independent worktrees for multiple agents. Assign disjoint file ownership, review diffs centrally, and use one publication controller. Do not force-push main.

Publish only the reviewed latest GitHub main snapshot using the Sites skill and existing project identity. Check the head again before deployment and skip stale or already-deployed work. Preserve public access; private GitHub does not imply private hosting. If checks fail, keep the current site live. Never put secrets in source, logs, build artifacts, or documentation. Report exact GitHub source SHA, deployment status, and remaining blockers.

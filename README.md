# Justin Jia — AI PM Portfolio

Bilingual, buildless portfolio for technical AI PM and AI systems roles. This private repository is the editorial source of truth. The existing public site is https://justin-ai-system-design.justin-1091.chatgpt.site/.

## Run locally

Install Git, Python 3, and Node.js (Node is used for syntax checks only).

```bash
git clone https://github.com/qinlinj/justin-ai-pm-portfolio.git
cd justin-ai-pm-portfolio
python3 scripts/build-locales.py
python3 scripts/check.py
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 for English and http://localhost:8000/zh.html for Chinese. Authenticate to GitHub using your own Git client; never commit credentials. No npm install is required.

## Source map

| Path | Responsibility |
| --- | --- |
| `dist/index.html` | English page layout and primary copy |
| `content/*.en.html` | English experience, projects, and insights fragments, inserted by the generator |
| `content/*.zh.html` | Native Chinese counterparts |
| `dist/studies.js` | English architecture cases and case renderer |
| `locales/zh-*.json` | Chinese static copy, studies, accessibility and interaction labels |
| `dist/motion.js`, `dist/navigation.js` | Disclosure, animation, language and navigation behavior |
| `dist/*.css` | Existing visual system; preserve stylesheet order |
| `dist/zh.html`, `dist/data.zh.js` | Generated Chinese output; do not edit directly |
| `.openai/hosting.json` | Existing Sites project identity; not a credential |

## Development workflow

1. Update local `main`, then create a task branch.
2. Make scoped changes. Keep implementation, comments, documentation, commits and PR descriptions in English. Chinese belongs only in UI content and localization resources.
3. Run the locale generator and checks. Inspect desktop and mobile in both languages for UI changes.
4. Commit all relevant sources and generated output, push the branch, and open a PR.
5. Review and merge into `main`. The configured ChatGPT GitHub merge automation can validate and publish the latest `main` to the existing Sites project. Direct pushes do not trigger that webhook; request a manual publish after a direct push.

```bash
git switch main
git pull --ff-only
git switch -c feat/short-description
python3 scripts/build-locales.py
python3 scripts/check.py
git add .
git commit -m "Describe the change"
git push -u origin HEAD
```

Use independent branches/worktrees for parallel agents. Assign file ownership to avoid overlapping edits. One integrator reviews changes, merges, and controls publication. Never force-push shared branches or discard someone else's changes.

## Publication contract

GitHub stores source and history. Sites hosts a deployed snapshot; it is not automatically linked by a Git remote or GitHub Actions. The merge-triggered ChatGPT task is the bridge. Its successful registration is reported in the setup conversation; a future run must still succeed before publication is confirmed.

The publication controller must read the Sites skill, retrieve the latest `main` SHA, run checks, and copy the reviewed source into the managed Sites checkout. Preserve project `appgprj_6ae3e83013c881918b549970ced39a2c` and its public audience. Use the Sites source helper to package, save, and deploy. GitHub and Sites commits can have different SHAs. Record the GitHub source SHA in deployment metadata (`dist/build-info.json`) and report the deployed source SHA with the live URL. Do not store credentials in the repository or public assets.

Before publishing, recheck `main`; abort stale work if it advanced. Skip a SHA already deployed. If checks or publication fail, retain the existing live version and report the blocker. Do not publish uncommitted edits or rebuild the portfolio from scratch. Manual requests to publish latest main use the same checks and process. The webhook starts work after a merged PR; it is not a guaranteed instant deployment.

## Initial import

Imported from the existing Sites snapshot at source commit `8f4273127de67ef0d9db290f1177ec9efd7bc75f`. GitHub history starts with this import rather than copying the managed hosting repository history. Repository privacy does not change the website's public audience.

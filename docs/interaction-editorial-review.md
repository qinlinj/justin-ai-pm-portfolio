# Editorial and interaction review — November 2, 2026

## Review basis

The original goal is a readable recruiting portfolio for technical AI PM and agent product roles: a differentiated introduction, a coherent path from background and judgment to actual delivery, and deeper architecture material on demand. Preserve the existing cream/green visual system and the distinction between experience, proposed extensions, and independent studies.

The live page inspected at the start of this review includes the confirmed GTSP and Remex contribution panels from the previous update. The Sites connector still returns `project_not_found` for the tracked project; this review does not infer a deployed SHA from visible content.

## Findings and decisions

| Lens | Finding | Implemented response |
| --- | --- | --- |
| Hiring reviewer | The headline reads as a literal list of technologies, while repeated reading instructions distract from contribution. | Reframe the introduction around engineering-to-product work; retain commerce/data delivery and support/trip agents immediately underneath. Replace section instructions with substantive descriptions and direct case titles. |
| Product reviewer | Seven top-level destinations and a second study index compete for attention. New detail pages would add navigation cost without a separate reader task. | Keep one continuous page, five primary navigation destinations (profile, perspective, experience, projects, studies), and the local architecture index. Projects remain adjacent to their extensions; methodology follows the studies. Case links still open and align the intended note. |
| Interaction designer | Plus/minus controls, diagonal text arrows, vertical text arrows, and SVG arrows represent overlapping actions. | Use a shared chevron for every disclosure, downward arrows for in-page jumps, and one straight vector arrow for process connections. All use matching geometry and stroke weight. |
| Visual designer | Language state is weak, typography inherits several conflicting styles, and repeated nested surfaces make details busy. | Use a raised segmented EN/Chinese selector, two font roles, three text colors, consistent panel radii, uniform diagram labels, and fewer duplicate summaries. Preserve the established glass treatment. |
| Mobile reader | Small control labels, inconsistent arrow orientation, and long title phrases create avoidable friction. | Keep 44px language/menu targets, vertical process flows, complete phrase wrapping in the hero, and visible chevrons on full-width summaries. |
| Keyboard reader | Anchor activation scrolls but does not move focus; programmatic case expansion can leave disclosure metadata stale. | Exclude hidden contact navigation from active-section tracking. Move focus to keyboard-activated destinations and synchronize `aria-expanded` for every disclosure, including deep-linked notes. Preserve Escape-to-close menu behavior. |

## Typography and component contract

- Display role: Space Grotesk for English H1/H2; native Chinese sans-serif for Chinese H1/H2. Body role: DM Sans with PingFang SC/Microsoft YaHei fallbacks for cards, diagrams, navigation, labels, and body copy. Numerical steps use tabular figures, not a separate monospaced typeface.
- Primary text `#25392c`, body text `#42543f`, supporting text `#5d6b58`. Calculated contrast against solid panel color `#f4f7ed`: 11.39, 7.53, and 5.22 respectively. Translucent surfaces still require visual checks; these calculations are not a full accessibility certification.
- Main prose is 16px, hero prose 17px desktop/16px mobile, component labels 14px, metadata 12–13px. Headings scale with available width. Compact summary text can use 15px on mobile.
- All disclosures use the same 34px chevron within a larger clickable summary. Language/menu controls are at least 44px in each dimension. Static diagrams are not styled as buttons.
- Straight arrows rotate with flow direction: horizontal on desktop, vertical on narrow screens. Chevron rotation means expanded/collapsed; it never means page navigation.
- Hero text no longer fades or scales during scrolling. Existing reveal/disclosure motion and reduced-motion support remain.

## Content boundary

Production copy uses direct statements and substantive titles. Removed reading instructions such as opening a case to see the content, obsolete profile cues, and 127 unused historical translation entries. State labels such as in development, design proposal, and not deployed remain because they describe facts. Awaiting confirmation is a workflow state, not an editorial placeholder. No dates, achievements, metrics, or contacts were invented.

All nine architecture notes, original outcomes, actual contribution panels, independent project extensions, method examples, and the six-step framework remain. The unpublished contact destinations remain disabled under the owner's standing instruction. Their section and navigation link are hidden until actual destinations are supplied, avoiding an empty recruiting action. Remove the hidden attributes when enabling real contact destinations.

## Acceptance checklist

- [x] Locale generation, repository validation, and whitespace checks pass; generated output is included.
- [x] Shared SVG assets resolve locally; repository validation now checks CSS asset references.
- [x] English and Chinese desktop hero, language state, case expansion, and process layout inspected.
- [x] 390px and 320px embedded mobile layouts inspected (375px and 305px content widths with scrollbars); both languages checked; no horizontal document overflow observed in inspected states.
- [x] Keyboard menu activation, Escape dismissal, case focus, and language switching with the selected case retained checked.
- [x] Profile and research reflections expand/collapse together; disclosure state matches `aria-expanded`.
- [x] Direct case navigation opens the target and aligns approximately 24px below the sticky header.
- [x] Existing reduced-motion branches retained and reviewed in source.
- [ ] Physical-device and reduced-motion browser-preference testing: not performed in this session.
- [ ] Recruiting-reader comprehension and mainland-network testing: outside this implementation verification.
- [ ] Production deployment of this revision: requires the existing Sites project's availability to the publishing connection or a separately verified automatic publication.

## Remaining recruiting gaps

The visual and editorial corrections improve comprehension; they do not replace inspectable evidence. The next substantive improvements remain two sanitized case artifacts, measured AI task outcomes with their baseline/sample/time window, a real prioritization-and-iteration story, and an owner-approved contact/resume path. The prior [hiring review](hiring-review-next-iteration.md) defines those acceptance gates. No extra pages, chat simulation, or decorative interaction are needed to address them.

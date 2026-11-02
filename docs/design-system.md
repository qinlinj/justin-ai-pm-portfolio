# Portfolio design system

## Reading hierarchy

The first screen establishes positioning and links to delivered work. Experience cards expose employer, role, dates, and a short outcome summary; GTSP and Remex detail containers start closed. Their acceptance material and architecture notes remain available inside. A direct case URL opens all enclosing disclosures before aligning the case beneath the sticky header.

The five future proposals are planning/research material. Use the future-project label and concise introduction rather than repeatedly contrasting them with production work. Keep their architecture depth and evaluation plans. Existing experience and proposed extensions retain their factual scope.

## Type and emphasis

| Role | Typeface | Size | Weight and treatment |
| --- | --- | --- | --- |
| H1/H2 | Space Grotesk in English; native Chinese sans-serif in Chinese | Responsive H1; 26–42px H2 | 600; primary ink, with one green hero line |
| Body | DM Sans, PingFang SC, Microsoft YaHei, sans-serif | 16px; hero 17px desktop | 400; 1.85 line height |
| Card heading | Body family | 18–20px | 600; primary ink |
| Control/diagram label | Body family | 14–16px | 500–600; consistent across diagrams |
| Metadata | Body family | 12–13px | 400–500; muted green-gray |
| Step number | Body family, tabular figures | 12px | 600; same size/weight across numbered components |
| Key phrase | Body family | Inherits paragraph size | 600, `#2e603f`; short phrases only |

Use primary ink `#25392c`, body `#42543f`, and supporting text `#5d6b58`. Use green emphasis for specific responsibilities, boundaries, and results, never full paragraphs. Preserve metric meaning. Underlines identify text links; do not use underlines for headings or emphasis. Buttons and disclosure rows use their surfaces and icons to communicate interaction.

## Surfaces, symmetry, and icons

- Cream background, restrained green, rounded glass cards. Main cards use a 26px radius; nested panels use 18px.
- Center the primary action within the hero text column. Its SVG icon is decorative; the link text remains its accessible name.
- Give all three hero steps equal surfaces and equal numerical markers. Color does not imply that the third step is selected.
- Use the same chevron for every disclosure. It points down when closed and up when open. The whole summary is clickable; language/menu controls have at least 44px touch targets.
- A straight SVG arrow represents a real process connection. Four-node diagrams reserve explicit 24px tracks between equal-width nodes, with arrows centered horizontally and vertically. On mobile these tracks become vertical.
- The six-step design framework uses numbered cards without arrows. Numbers already establish reading order.

## Profile behavior

Desktop background and research cards share grid tracks, aligning intros, summary bars, and open outer bounds without fixed content heights. Each uses the same heading/body/control styling.

The background control opens or closes both panels, preserving the established linked interaction. Research has its own independent control. Mobile stacks the cards in reading order; below 380px decorative profile marks are hidden to leave room for labels. This behavior supersedes the earlier requirement that every research toggle also follow background state.

## Motion and language navigation

- Disclosures animate height for 280ms. Reduced-motion preferences bypass animation.
- Language switching fades out for 120ms and fades in for 180ms. It retains expanded panel IDs and a section-relative reading position using temporary URL parameters, then removes those parameters from the destination address. No personal information or persistent storage is involved.
- A directly selected open case remains the selected case after switching language. Ordinary links still work without JavaScript or with modifier-click; state restoration and animation are enhancements.
- The navigation controller waits for initial layout/font readiness and opens all enclosing disclosures before measuring a deep link. Keyboard anchor activation moves focus to the destination.

## Verification checklist

- Fresh English and Chinese loads: profile/research and GTSP/Remex detail containers are closed.
- Background toggles both profile cards; research toggles independently; `aria-expanded` agrees with rendered state.
- Deep-linked studies open their enclosing experience card and land approximately 24px below navigation.
- Language switching preserves nested open panels and returns to a clean URL; reduced-motion source paths bypass fades.
- Desktop profile summaries and open outer bounds align; process arrows sit at the midpoint between adjacent boxes.
- Mobile EN/Chinese at 320/390px: readable labels, 44px navigation targets, no document overflow.
- Locale generation and repository checks pass; CSS assets resolve and all nine architecture notes remain.

Browser checks cover responsive embedded viewports, not physical phones or mainland networks. OS-level reduced-motion emulation and cross-browser transition timing remain unverified. Publication must still be verified separately against the latest reviewed GitHub main.

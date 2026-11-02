# Portfolio design system

## Reading hierarchy

The hero states full-stack engineering and agent delivery, supported by one concrete sentence about commerce, data platforms, support, and travel planning. The main navigation provides section access; no separate hero action repeats those destinations.

Profile introduces background and ongoing questions. Perspective connects each judgment to a case. Experience presents delivered responsibilities and outcomes; independent projects retain their own dates and proposed extensions. Five future project proposals share a direction overview and an expandable validation sequence, followed by the existing architecture depth. The contact section remains visible; unpublished destinations remain disabled `about:blank` links.

GTSP starts closed. On expansion, payments, authentication, migration, and their exact metrics come first. The support integration is a nested disclosure. Remex starts closed and presents delivered and in-development projects before the approval method and service examples. Keep all nine architecture notes and distinguish proposed extensions from delivered functionality.

## Type, color, and emphasis

| Role | Typeface | Size | Treatment |
| --- | --- | --- | --- |
| Hero | Local system sans-serif | English 32–60px; Chinese 30–48px | 650; black first line, dark green second line |
| Section heading | Local system sans-serif | 30–42px | 600; primary ink |
| Card heading | Local system sans-serif | 18–28px | 600; primary ink |
| Body | Local system sans-serif | 16px; hero 18px desktop | 400; English 1.7 line height, Chinese 1.85 |
| Control / diagram | Local system sans-serif | 14–16px | 500–600 |
| Metadata | Local system sans-serif | 12–13px | 400–500; muted neutral |
| Number | Local system sans-serif, tabular figures | 12px | 600; green |
| Key phrase | Body font | Inherited | 600; dark green, short phrases only |

Use primary ink `#19211f`, body `#3e4844`, and supporting text `#626d66`. Green `#285b44` identifies accents and interaction states. Body text uses neutral tones rather than green throughout. Use underlines for text links, not headings or arbitrary emphasis. Preserve metric wording and numerical meaning.

`polish.css` is the final presentation layer after the retained stylesheets. No remote font request is required. English tracking is restrained and text width is bounded. Avoid text blur or opacity-based scroll reveals.

## Surfaces and connectors

- Warm cream base with localized sage gradients; white cards and green process surfaces create depth.
- Glass treatment is concentrated on navigation and the hero diagram. Reading areas use more opaque surfaces and no nested backdrop blur.
- All three hero steps use equal numerical markers and surfaces. Their SVG arrows are absolutely centered in the connector tracks.
- Four-node process diagrams reserve 24px tracks between equal-width nodes. Mobile diagrams stack vertically.
- The six-step framework uses numbered cards without arrows.
- Disclosure chevrons point down when closed and up when open. The entire summary is interactive; navigation and language controls are at least 44px.

## Profile interaction

Both controls toggle the background and research panels together. Research uses a simple keyword row rather than a second avatar or search-icon card. Desktop panels share grid tracks for aligned summaries and open bounds. On mobile, cards stack, and animated scroll compensation keeps the clicked control in place when the preceding card expands or collapses. User scrolling or keyboard input cancels compensation.

All disclosures start closed on fresh loads, including incoming fragment URLs. A tiny head script defers browser fragment handling to prevent automatic disclosure opening. Initial alignment lands at the enclosing career card when a target is hidden. A deliberate in-page case link opens the required ancestors and aligns the selected case below the sticky header.

## Language switching and motion

Language links remain ordinary real URLs. A native cross-document view transition holds the previous frame until the next page is ready, keeping the header visually stable. Supporting browsers cross-fade for 260ms; reduced-motion preferences disable the transition. Other browsers navigate immediately with a subtle arrival fade, without the previous fade-out delay. Target documents are prefetched on pointer hover or keyboard focus.

Temporary URL parameters carry only expanded disclosure IDs and section-relative reading position; they are removed on arrival. No personal or persistent storage is involved. Changing language preserves user-opened panels, while a later fresh load resets them. All local JS/CSS URLs use generated content hashes so an updated page cannot silently reuse stale behavior or styles.

## Verification

- English and Chinese desktop and 320/390px browser viewports: no document overflow.
- Both profile controls synchronize state; desktop bounds align. Mobile research-control movement measured below 1px after expansion and collapse.
- Fresh support fragment loads remain closed; deliberate support links open GTSP, agent, and study details.
- Language change retains the nested support case and clean URL at approximately 24px below navigation.
- Contact entry is visible; destinations remain disabled as specified.
- Locale generation, generated asset hashes, JS syntax, local asset references, nine-note coverage, and supplied metrics are checked by repository scripts.

Physical phones, a second browser engine, and OS-level reduced-motion settings are not covered by this browser session. Native view-transition support varies; the immediate-navigation fallback remains available. Publication must be verified separately against reviewed GitHub main.

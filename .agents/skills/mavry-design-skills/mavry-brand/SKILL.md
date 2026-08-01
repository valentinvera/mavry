---
name: mavry-brand
description: Use when creating or reviewing Mavry brand, product UI, landing pages, marketing materials, visual identity, UX writing, color usage, typography, layout, or design-system decisions. Triggers for Mavry brand, Mavry style, Mavry visual identity, product clarity, focused builders, MVP scope, roadmap, and decision-layer work.
---

# Mavry Brand Guidelines

Mavry is a product clarity system for builders turning messy ideas into focused, shippable products.

Use this skill to keep Mavry clear, sharp, calm, pragmatic, and product-led. Mavry should feel like a focused product partner that helps a builder know what to build now, what to cut, what to leave for later, and when to ship.

## Brand Core

| Area | Direction |
| ---- | --------- |
| Positioning | The decision layer for early-stage products |
| Short promise | Product clarity for focused builders |
| Product promise | Know what to build next, what to cut, and when to ship |
| Audience | Founders, indie hackers, builders, technical founders, small teams, and founders organizing scope before building |
| Primary feeling | Enter confused, leave knowing the next step |

## Core Colors

| Name | Hex |
| ---- | --- |
| Mavry Black | `#000000` |
| Mavry White | `#FDFDFD` |

Technical source of truth: use `@mavry/tokens` for design tokens in code. Web/Tailwind imports `@mavry/tokens/tailwind.css`; mobile/Uniwind imports `@mavry/tokens/uniwind.css`.

### Semantic Colors

| Scale | Background | Foreground | Usage |
| ----- | ---------- | ---------- | ----- |
| Gray | `#16171AEB` | `#FDFEFFA6` | Structure, hierarchy, and subtle separation |
| Red | `#FF173F2D` | `#FF9592` | Critical states, risk, cuts, and irreversible actions |
| Amber | `#FA820022` | `#FFCA16` | Caution, pending states, uncertainty, and scope warnings |
| Green | `#22FF991E` | `#46FEA5D4` | Success, readiness, completion, and validated decisions |
| Blue | `#0077FF3A` | `#70B8FF` | Interactive and informational elements |

## Typography

Use **Inter for everything** in Mavry: product UI, marketing, docs, headings, body text, labels, buttons, and code-like product surfaces unless a real code block requires the system monospace stack.

| Font | Role |
| ---- | ---- |
| **Inter** | Display, headings, titles, body, labels, navigation, product UI, and marketing copy |

### Typography Rules

- Use sentence case everywhere: headings, buttons, labels, and navigation.
- Use Inter for all brand and product typography.
- Use Inter weights intentionally: Regular, Medium, Semi Bold, and Bold.
- Use Bold only for strong hierarchy, not decoration.
- Never use decorative display fonts, multiple brand fonts, or novelty typefaces.
- Never use monospace for titles, body copy, labels, or marketing copy.
- Use monospace only for literal code, CLI commands, file paths, env names, or technical snippets.
- Keep letter spacing at `0` unless a specific production asset requires otherwise.
- Prefer concise, stable text that fits compact product UI.

### Typography Scale

**Display**

| Style | Font | Weight | Size/Line | Letter Spacing |
| ----- | ---- | ------ | --------- | -------------- |
| display/large | Inter | Bold | 88/92 | 0 |
| title | Inter | Semi Bold | 56/64 | 0 |
| small | Inter | Semi Bold | 64/72 | 0 |

**Body**

| Style | Font | Weight | Size/Line |
| ----- | ---- | ------ | --------- |
| xlarge | Inter | Regular/Medium | 24/32 |
| large | Inter | Regular/Medium | 18/28 |
| medium | Inter | Regular/Medium/Semi Bold | 16/24 |
| small | Inter | Regular/Medium | 14/20 |
| caption | Inter | Regular/Medium | 12/16 |
| code | System monospace | Regular | 14/20 |

## Logo

The Mavry logo system exists in two forms: primary wordmark and compact mark.

The final mark is the **circular rayfield**: an abstract, non-letter symbol made from a solid circle cut by three balanced, edge-to-edge diagonal lines. It represents scattered product ideas becoming a clear product direction. The mark should feel systematic, compact, monochrome, sharp, calm, and recognizable at small sizes.

Use the primary wordmark as the main expression of the brand wherever space allows. Use the compact mark in the lettermark slot for favicons, app icons, avatars, small navigation surfaces, or dense UI. Do not force the symbol to become a letter M.

### Wordmark

Use the wordmark as the default Mavry brand signature. It should appear in product navigation, landing pages, documentation, decks, social previews, and any surface where there is enough horizontal room.

- `assets/brand/mavry-logo.svg`
- `assets/brand/mavry-logo-black.svg`
- `assets/brand/mavry-logo-white.svg`

Use `mavry-logo.svg` when the surrounding UI controls the logo color through `currentColor`. Use the black version on light backgrounds and the white version on dark backgrounds.

### Lettermark

Use the lettermark/compact mark when the wordmark would be too small, too dense, or redundant. It is the correct asset for app icons, favicons, avatars, compact sidebar navigation, loading states, and small product surfaces.

- `assets/brand/mavry-lettermark.svg`
- `assets/brand/mavry-lettermark-black.svg`
- `assets/brand/mavry-lettermark-white.svg`

Use `mavry-lettermark.svg` when the surrounding UI controls the logo color through `currentColor`. Use the black version on light backgrounds and the white version on dark backgrounds.

### Symbol Aliases

The symbol aliases use the same geometry as the lettermark. Use them when a file should be named as a generic brand symbol rather than as a lettermark.

- `assets/brand/mavry-symbol.svg`
- `assets/brand/mavry-symbol-black.svg`
- `assets/brand/mavry-symbol-white.svg`

### Favicons And App Icons

Use these only for browser, PWA, iOS, Android, Expo, and installable app contexts. Do not use app-icon source art as a replacement for the wordmark in product UI.

- `assets/brand/mavry-favicon.svg`
- `assets/brand/mavry-favicon-black.svg`
- `assets/brand/mavry-favicon-white.svg`
- `assets/brand/mavry-favicon-16.png`
- `assets/brand/mavry-favicon-32.png`
- `assets/brand/mavry-favicon-48.png`
- `assets/brand/mavry-favicon-64.png`
- `assets/brand/mavry-favicon-black-16.png`
- `assets/brand/mavry-favicon-black-32.png`
- `assets/brand/mavry-favicon-black-48.png`
- `assets/brand/mavry-favicon-black-64.png`
- `assets/brand/mavry-favicon-white-16.png`
- `assets/brand/mavry-favicon-white-32.png`
- `assets/brand/mavry-favicon-white-48.png`
- `assets/brand/mavry-favicon-white-64.png`
- `assets/brand/mavry-touch-icon-180.png`
- `assets/brand/mavry-app-icon.svg`
- `assets/brand/mavry-app-icon-192.png`
- `assets/brand/mavry-app-icon-256.png`
- `assets/brand/mavry-app-icon-512.png`
- `assets/brand/mavry-app-icon-1024.png`
- `assets/brand/mavry-app-icon-foreground.svg`
- `assets/brand/mavry-app-icon-foreground.png`
- `assets/brand/mavry-app-icon-monochrome.svg`
- `assets/brand/mavry-app-icon-monochrome.png`

### Preview

- `assets/brand/mavry-logo-preview.svg`

### Guidelines

- `assets/brand/README.md`

### Product Integration

- Web public assets live in `apps/web/public/brand/`
- Web manifest lives in `apps/web/public/manifest.webmanifest`
- Mobile app icon copies live in `apps/mobile/assets/brand/`
- Mobile app icons are configured in `apps/mobile/app.json`

### Naming

Use `Mavry` as a single word with a capital `M`. Avoid `MAVRY`, `mavry`, `Mavry App`, `Mavry.app`, `Mavry AI`, `Mavry Product`, and descriptive extensions as formal names. Use the product name alone, then explain the product in nearby copy.

### Clearspace

Minimum clearspace equals `1/2` of the wordmark cap height on all sides. For compact mark usage, keep at least `1/4` of the mark's artboard width as clearspace on all sides.

Never place text, icons, badges, UI chrome, page edges, image edges, or other logos inside the clearspace.

### Minimum Size

- Preferred: 24px height
- Extreme cases: 16px height minimum
- Use the wordmark above 24px rendered height whenever horizontal space allows.
- Use the compact mark for 16px dense UI, favicons, app icons, metadata surfaces, and small navigation.
- If the internal diagonal cuts collapse visually, increase the rendered size.

### Logo Restrictions

Never:

- Rotate the mark or wordmark.
- Apply shadows, glows, outlines, strokes, textures, or gradients.
- Slant, stretch, compress, crop, or distort the geometry.
- Use multiple colors inside the logo.
- Use low-resolution exports when SVG is available.
- Combine the symbol and wordmark in custom layouts.
- Modify proportions, cutline spacing, line angle, line thickness, or circle radius.
- Replace the final circular rayfield mark with old concept variants.
- Put the logo on low-contrast, noisy, or visually busy backgrounds.

## Cube Element

Secondary brand symbol. Never use as: primary logo, navigation element, or with modified geometry/colors.

## Gradients

| Name | Value |
| ---- | ----- |
| Font gradient | `linear-gradient(97deg, #ffffff 30%, rgba(255,255,255,0.50) 100%)` |
| Smooth gradient | `linear-gradient(96deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.10) 100%)` |
| Border | `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)` |
| Rainbow border | `linear-gradient(90deg, rgba(2,252,239,0.44) 0%, rgba(255,181,43,0.44) 50%, rgba(160,43,254,0.44) 100%)` |

## Effects

| Name | Value |
| ---- | ----- |
| Glass blur | `backdrop-filter: blur(25px)` |

## Design Tokens

Shared product tokens live in `packages/tokens`.

- TypeScript tokens: `@mavry/tokens`
- Tailwind CSS v4 tokens: `@mavry/tokens/tailwind.css`
- Uniwind/Expo tokens: `@mavry/tokens/uniwind.css`

Do not redefine Mavry colors, typography, radius, spacing, shadows, blur, or semantic state colors directly inside apps. Add or change shared visual decisions in `@mavry/tokens`, then consume those tokens from web, mobile, and future product surfaces.

## Textures

No Mavry texture assets exist yet. Do not use or invent texture assets.

## Backgrounds

No Mavry background or wallpaper assets exist yet. Do not use or invent background asset URLs.

## Layout Patterns

| Name | Description |
| ---- | ----------- |
| Right Object Scene | Small label top-left, title top-left (2 lines), 3D object right |
| Interface Scene | Label top-left, title bottom-left (2 lines), UI screenshot background |
| Text Only Scene | Title top-left, 3D abstract scene fills background |
| Text Only Background | Large title centered, subtle texture/gradient background |
| Text Only Subtle | Small centered text (2 lines), minimal dark background |
| Big Number | Large display number centered, small label below |

**Common patterns:**

- Label/category always small, top-left or top-center.
- Titles use 2-line breaks for rhythm.
- Titles are never longer than 3 lines.
- Objects are positioned right, left, or as full background.
- Dark backgrounds with subtle depth.
- Product surfaces should prioritize real UI, roadmaps, decision logs, feature scope, MVP readiness, and product clarity.

## Layout And Composition Rules

Mavry product screens are decision workspaces, not decorative SaaS pages. Design every screen around the product decision it helps the builder make: what to build now, what to leave for later, what to cut, what is blocking launch, or what the next action is.

### Composition Before Components

- Start with the user question before choosing components.
- Do not default to "heading plus card grid" unless the information truly has peer items.
- Give each important screen one dominant object:
  - Project Home: next actions and current product risk.
  - MVP Scope: the Core, Support, Later, and No for now relationship.
  - Roadmap: Now, Next, Later, and Not doing sequence.
  - Launch Readiness: blockers, readiness status, and not-required-yet work.
  - Cut List: explicit decisions and reasons.
- Surround the dominant object with only the supporting context needed to act.
- If every section has equal visual weight, redesign the hierarchy before adding surfaces, color, icons, or borders.

### Decision Geometry

Use geometry to communicate product meaning:

- Priority or importance -> rank, position, or weight.
- Roadmap sequence -> ordered lanes, timeline, or clear vertical progression.
- Readiness -> distance from a threshold and visible blockers.
- Scope creep -> growth, heaviness, or expansion pressure.
- Cut decisions -> visible separation from MVP scope, not hidden deletion.
- Dependencies -> connection, sequence, or grouped adjacency.

Do not use charts, bars, or diagrams only because data exists. Use them only when they make the product decision faster to understand.

### Grid And Alignment

- Use a consistent page grid across web product surfaces.
- Align objects to shared edges, baselines, grid lines, or deliberate optical centers.
- Equivalent items must share structure: label position, value position, action alignment, row rhythm, and type role.
- Do not strand important boards, tables, or scope views in narrow tracks when available width would make scanning easier.
- Let dense product tools use the full content width when lookup, comparison, or drag/reorder behavior benefits from it.
- On mobile, recompose the layout before shrinking text or hiding useful context.

### Surfaces And Boundaries

- Treat the page as one continuous workspace by default.
- Use a card, panel, border, or separated surface only when it communicates a real grouping, selected state, warning, interaction zone, or contrast that spacing cannot express.
- Do not wrap every section, metric, feature, or roadmap item in a card.
- Do not put cards inside cards or panels inside panels.
- Do not use borders to compensate for weak hierarchy.
- Prefer spacing, alignment, density shifts, and typography before adding boxes.
- Keep radii restrained and consistent with Mavry tokens.

### Rhythm And Density

- Build spacing from relationships, not one uniform gap everywhere.
- Keep headings close to the content they introduce.
- Keep labels, values, details, and actions aligned consistently across peer rows.
- Use larger separation only when the user is moving to a new decision area.
- Empty space must help the dominant object stand out. Accidental holes, orphaned third columns, and underfilled split layouts are failures.
- Mavry can be dense because it is an operational product, but density must remain scannable and calm.

### Screen Structure

- Every section must answer a different product question.
- Remove repeated summaries that say the same thing with different components.
- Keep one home for each product claim or decision; do not duplicate the same readiness, recommendation, or cut reason at equal prominence.
- End product flows with a clear implication, saved decision, next action, or unresolved blocker.
- Mobile screens should optimize for capture, review, and quick classification. Web screens should optimize for deeper product work.

### Responsive Behavior

- Preserve readable type and tappable controls.
- Give grid and flex children `min-width: 0` so content can reflow safely.
- Reflow before truncating or shrinking important text.
- Long tables, ledgers, and boards may scroll locally when preserving lookup is more useful than forcing everything into stacked cards.
- Light and dark modes should preserve the same hierarchy, not merely invert colors.

### Motion

- Default to stillness.
- Use motion only to explain a state change, preserve continuity, or confirm an action.
- Do not use motion as decoration, suspense, or personality.
- Never gate reading behind animations.
- Respect reduced-motion preferences.

## Reject Patterns

Do not ship these patterns in Mavry:

- Generic centered hero copy followed by a card grid.
- Cards inside cards, panels inside panels, or nested bordered boxes.
- Border gradients, gradient text, glows, blobs, bokeh, glass effects, fake depth, decorative shadows, or ornamental textures.
- Decorative grid backgrounds, stripes, side rails, or noisy abstract backgrounds.
- Repeated metric cards when one composed relationship would explain the product state better.
- Badges, pills, or rounded capsules for ordinary labels, metadata, or every status.
- Icons as decoration, oversized icons, mixed icon styles, or arbitrary icon tiles.
- A dark rounded rectangle around every chart, board, or tool.
- Identical section silhouettes across unrelated product questions.
- Tiny muted copy used to make overcrowded UI fit.
- Tables or boards compressed into narrow columns while useful width is empty.
- Color-only meaning for status, risk, priority, or readiness.
- Fake product screenshots, stock imagery, generic AI illustrations, or visual assets that do not explain the product.
- Repeated recommendation, summary, rationale, and conclusion blocks that say the same thing.
- Authoring-process copy such as "this section shows" or "we organized this by".
- Visible theme toggles in formal marketing or brand pages unless the product context actually requires one.

## Design Principles

1. Dark-first design philosophy
2. Sharp contrast between black and light
3. Precision and focus over decoration
4. Accent colors communicate state, not style
5. Simple, stable, intentional forms

## Product Principles

Use these principles when shaping Mavry screens, flows, copy, and visuals:

1. Cutting is progress.
2. Focus before volume.
3. Decisions should be explicit.
4. The MVP validates a hypothesis.
5. Clarity beats false speed.
6. AI assists, but does not decide.

## Voice And Tone

Mavry writes directly, calmly, and without hype.

Use:

- Clear, short product language.
- Firm guidance without arrogance.
- Practical language for builders.
- Technical specificity when it helps.
- No emojis by default.
- Minimal humor.
- No generic AI-productivity language.

Avoid:

- "Unlock your full potential"
- "AI-powered productivity"
- Hype, motivational filler, or vague startup language
- Infantilized, overly colorful, or corporate tone

Preferred copy examples:

```text
This feature does not belong in your MVP.
```

```text
You have 12 new ideas. None are urgent yet.
```

```text
Your launch scope is getting heavier.
```

```text
Move this to Later and keep building.
```

## Experience Direction

Mavry should feel operational and focused:

- Onboarding clarifies the product hypothesis.
- Idea capture stays fast without turning every idea into a task.
- Backlogs ask why a feature matters.
- Scope creep is visible.
- Decisions keep a reason.
- Mobile supports quick capture and review.
- Web supports deeper product work.
- Dashboards stay useful, not decorative.

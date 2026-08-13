# Mavry Logo System

Mavry's logo system is built around the **decision aperture**: two product planes separated by a precise diagonal channel. The channel narrows at one explicit decision point, then opens into a focused direction.

The surrounding planes hold the broader product field while the negative space expresses the judgment that turns many possibilities into one next step. The shape is abstract by design. It is not a letter, arrow, checklist, filter, link, or task-management metaphor. The logo should feel sharp, calm, product-led, and systematic. Use it as a brand signature, not as decoration.

## Final Assets

| Asset | File | Use |
| ----- | ---- | --- |
| Primary wordmark | `mavry-logo.svg` | Default logo across product, marketing, documentation, and presentations |
| Black wordmark | `mavry-logo-black.svg` | Light backgrounds |
| White wordmark | `mavry-logo-white.svg` | Dark backgrounds |
| Compact mark / lettermark | `mavry-lettermark.svg` | Compact product surfaces, nav, avatars, favicons, app icons |
| Black compact mark | `mavry-lettermark-black.svg` | Light backgrounds |
| White compact mark | `mavry-lettermark-white.svg` | Dark backgrounds |
| Symbol alias | `mavry-symbol.svg` | Same geometry as the compact mark, named for brand-system usage |
| Black symbol alias | `mavry-symbol-black.svg` | Light backgrounds |
| White symbol alias | `mavry-symbol-white.svg` | Dark backgrounds |
| Browser favicon | `mavry-favicon.svg` | Browser tabs and web manifest icons |
| Black browser favicon | `mavry-favicon-black.svg` | Black favicon tile for explicit light-surface/browser usage |
| White browser favicon | `mavry-favicon-white.svg` | White favicon tile for explicit dark-surface/browser usage |
| Browser favicon PNG | `mavry-favicon-16.png` | 16px raster export for browser tabs |
| Browser favicon PNG | `mavry-favicon-32.png` | 32px raster export for environments that require PNG |
| Browser favicon PNG | `mavry-favicon-48.png` | 48px raster export for Windows/browser surfaces |
| Browser favicon PNG | `mavry-favicon-64.png` | 64px raster export for high-density browser surfaces |
| Black browser favicon PNG | `mavry-favicon-black-16.png` | 16px black favicon raster export |
| Black browser favicon PNG | `mavry-favicon-black-32.png` | 32px black favicon raster export |
| Black browser favicon PNG | `mavry-favicon-black-48.png` | 48px black favicon raster export |
| Black browser favicon PNG | `mavry-favicon-black-64.png` | 64px black favicon raster export |
| White browser favicon PNG | `mavry-favicon-white-16.png` | 16px white favicon raster export |
| White browser favicon PNG | `mavry-favicon-white-32.png` | 32px white favicon raster export |
| White browser favicon PNG | `mavry-favicon-white-48.png` | 48px white favicon raster export |
| White browser favicon PNG | `mavry-favicon-white-64.png` | 64px white favicon raster export |
| Apple touch icon | `mavry-touch-icon-180.png` | 180px iOS/iPadOS home-screen web clip |
| App icon source | `mavry-app-icon.svg` | Source artwork for iOS, Android, and installable app icons |
| App icon PNG | `mavry-app-icon-192.png` | 192px web app manifest icon |
| App icon PNG | `mavry-app-icon-256.png` | 256px product/app listing export |
| App icon PNG | `mavry-app-icon-512.png` | 512px web app manifest and Android listing export |
| App icon PNG | `mavry-app-icon-1024.png` | 1024px raster export for mobile/app-store pipelines |
| Android adaptive foreground | `mavry-app-icon-foreground.svg` | Transparent source for Android adaptive icons |
| Android adaptive foreground PNG | `mavry-app-icon-foreground.png` | 1024px transparent foreground for Expo Android adaptive icon |
| Android themed icon | `mavry-app-icon-monochrome.svg` | Transparent source for Android 13+ themed icons |
| Android themed icon PNG | `mavry-app-icon-monochrome.png` | 1024px transparent monochrome export for Expo Android themed icon |
| Preview sheet | `mavry-logo-preview.svg` | Human review of final wordmark and compact mark usage |

## Product Integration

Web app icon assets are copied into `apps/web/public/brand/` so the browser can serve them directly. `assets/brand` contains only the canonical source files without version suffixes; runtime copies may retain their configured filenames.

Mobile app icon assets are copied into `apps/mobile/assets/brand/` and configured in `apps/mobile/app.json`. The source-of-truth files in `assets/brand` always use the canonical names listed above.

## Naming

Use `Mavry` as a single word with a capital `M`.

Correct:

- `Mavry`
- `Mavry for web`
- `Mavry for mobile`
- `Mavry workspace`
- `Mavry project`

Avoid:

- `MAVRY`
- `mavry`
- `Mavry App`
- `Mavry.app`
- `Mavry AI`
- `Mavry Product`
- `Mavry Project Manager`

Use the product name alone when possible. Describe the product in nearby copy instead of extending the name.

## Usage

Use the primary wordmark wherever horizontal space allows. Use the compact mark only when the full wordmark would be too small, too dense, or redundant.

Use the black assets on light backgrounds and the white assets on dark backgrounds. The default `currentColor` assets are preferred inside code when the color is controlled by CSS or a design token.

## Clearspace

Minimum clearspace equals `1/2` of the wordmark cap height on all sides. For compact mark usage, keep at least `1/4` of the mark's artboard width as clearspace on all sides.

Do not place text, icons, badges, UI chrome, or image edges inside the clearspace.

## Minimum Size

Preferred minimum rendered height: `24px`.

Extreme minimum rendered height: `16px`, only for dense UI, favicons, and compact metadata surfaces.

If the diagonal aperture closes visually, use a larger size.

## Correct Use

- Use one color only.
- Keep the mark upright.
- Keep the original proportions.
- Use the wordmark as the default brand signature.
- Use the compact mark for app icons, favicons, avatars, dense navigation, and small product surfaces.
- Prefer high-contrast black/white usage.

## Incorrect Use

Never:

- Rotate the mark or wordmark.
- Stretch, slant, compress, or redraw the geometry.
- Apply shadows, glows, outlines, strokes, textures, or gradients.
- Use multiple colors inside the logo.
- Place the logo on low-contrast backgrounds.
- Combine the compact mark with the wordmark in custom layouts.
- Replace the Decision Aperture geometry inside any canonical asset.
- Modify the plane proportions, diagonal channel, center aperture, or internal spacing.

## Source Of Truth

The final symbol source is `mavry-symbol.svg`. Files in `assets/brand` use canonical names without version suffixes.

# Alapon design system

Direction: **Modern Bengal** - warm, editorial, playful; Bengali first. Not a SaaS dashboard, not an AI-startup gradient.

## Colour

Tailwind palette (`packages/config/tailwind-tokens.js`) plus semantic CSS variables in `apps/web/src/app/globals.css`.

| Role                                         | Tailwind                               | CSS variable       |
| -------------------------------------------- | -------------------------------------- | ------------------ |
| Primary (Bengal red, the interaction colour) | `sindoor-500` (`#bf2f3a`), hover `600` | `--alapon-primary` |
| Background (warm ivory)                      | `cream-50` (`#fffaf2`)                 | `--alapon-bg`      |
| Surface                                      | `cream-100`                            | `--alapon-surface` |
| Accent (muted gold: score, celebration)      | `marigold-400/500`                     | `--alapon-accent`  |
| Success (water-lily green)                   | `shapla-500`                           | `--alapon-success` |
| Text (deep charcoal)                         | `ink-900`                              | `--alapon-text`    |
| Muted (warm grey)                            | `ink-500`                              | `--alapon-muted`   |
| Lines                                        | `ink-100`                              | `--alapon-line`    |

Dark mode follows `prefers-color-scheme`; `ink-*` doubles as the dark ground. Contrast: body text and the red button on ivory meet WCAG AA; do not put `marigold` text on cream (use it for fills and rules).

## Typography

- Display / headings: **Noto Serif Bengali** (`font-bengaliDisplay`, helper `.display`). UI/body: **Noto Sans Bengali** (`font-bengali`). Latin: Inter (`font-latin`).
- Bengali needs generous leading: `body` is `line-height: 1.65`; long-form text uses `.reading` (1.75). Never clamp Bengali headings below 1.2.
- Eyebrow labels: `.eyebrow`. Big display numbers/words should scale with length (see `displaySize` in `LessonPlayer`) so long words never overflow at 320px.

## Spacing and radius

4/8px scale via Tailwind's default steps (`p-2`, `p-4`, `gap-4`, `py-10`...). Radius: `--alapon-radius-sm/md/lg` (0.5 / 0.875 / 1.25rem); `rounded-alpona` (1.25rem) is the signature large radius. Pills (`rounded-full`) only for buttons, chips and badges.

## Buttons (`.btn` family)

Defined once in `globals.css`; use `buttonClasses(variant, size, extra)` from `@alapon/ui` on links, or `<Button>` for buttons.

- Variants: `primary` (red fill), `secondary` (outlined ivory), `gold`, `ghost`, `text` (dotted underline link).
- Sizes: `sm` (36px), default (44px, the minimum touch target), `lg` (48px, page-level calls to action).
- Every button has a visible focus ring and a disabled state. Submitting buttons show `<Spinner>` and `aria-busy`.

## Cards (`<Card variant>`)

Use hierarchy, not identical boxes. Not every piece of information needs a border.

- `default` - plain bordered box (legacy/simple lists).
- `editorial` - open section with a red top rule; for reading content (Today, editorial).
- `game` - raised surface for playing areas.
- `discovery` - gold top rule, hover lift; for places/people/history.
- `learning` - soft green; for lessons and word learning.
- `result` - centred, red outline, celebratory; for results and completion.

## Motion

Framer Motion only where it clarifies: Daily 5 completion, score reveal, Word DNA reveal, passport progress, success states. Calm and short (<= 300ms). All motion respects `prefers-reduced-motion` (global CSS shortens animations; use `useReducedMotion` for framer).

## Voice

Warm, never punitive. Yes: "আজকের আলাপন সম্পূর্ণ।" "কাল আবার দেখা হবে।" No: "Don't lose your streak!"

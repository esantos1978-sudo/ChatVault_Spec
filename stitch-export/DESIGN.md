---
name: Obsidian Lumina
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#c0c1ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#8083ff'
  on-tertiary-container: '#0d0096'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets power users, AI engineers, researchers, and product teams requiring structured recall and collaborative prompt orchestration. The aesthetic pairs deep obsidian and slate surfaces with luminous, atmospheric violet and electric cyan accents.

The design philosophy combines **Glassmorphism** and **Technical Modernism**:
- Deep obsidian backdrop layers with subtle 1px translucent borders create high-density structural clarity.
- Directional violet and cyan backglows evoke raw computational energy and intelligent recall without visual clutter.
- High-contrast typography provides immediate legibility for dense prompts, metadata tokens, and hierarchical knowledge trees.

## Colors

The palette operates strictly in a calibrated dark mode:

- **Primary Violet (`#8B5CF6`) & Bright Lavender (`#A78BFA`):** Anchor key actions, glowing focal states, and active tool indicators.
- **Secondary Cyan (`#38BDF8`) & Electric Indigo (`#6366F1`):** Serve as accents for AI processing states, semantic prompt tags, and synthetic vector links.
- **Neutral Stack:**
  - Base Obsidian: `#090A0F`
  - Elevated Surface Layer 1: `#0F111A`
  - Interactive Container Surface 2: `#181B26`
  - High Surface / Hover Border: `#232738`
- **Text & Stroke Elements:** 
  - Primary text utilizes Crisp White (`#F8FAFC`).
  - Secondary text utilizes Slate Grey (`#94A3B8`).
  - Micro-borders utilize translucent white with violet tinting (`rgba(255, 255, 255, 0.08)` to `rgba(139, 92, 246, 0.25)`).

## Typography

The type scale combines **Plus Jakarta Sans** for clear, high-impact marketing headings, **Inter** for sustained technical reading, and **JetBrains Mono** for prompt parameters, model specs, and badge metadata.

- Keep headlines tight with negative tracking (`-0.02em` to `-0.03em`) to create a solid, confident rhythm.
- Hero headlines should pair bold primary text with a soft radial highlight or subtle gradient fill toward lavender on key focus words.
- Monospace tokens are restricted to badge labels, system status indicators, code snippets, and variable chips.

## Layout & Spacing

A 12-column fluid grid system with a maximum centered container width of `1280px` anchors hero sections and dashboard previews.

- **Desktop (>= 1024px):** 12 columns, `1.5rem` (24px) gutters, and `2rem` (32px) margins. Hero content splits cleanly into 7 columns (copy, trust proofs, conversion trigger) and 5 columns (live interactive library preview).
- **Tablet (768px - 1023px):** 8 columns, `1rem` (16px) gutters, and `1.5rem` (24px) margins. Cards wrap into 2-column matrices.
- **Mobile (< 768px):** 4 columns, `0.75rem` (12px) gutters, and `1rem` (16px) margins. Columns collapse to a single stack with touch targets expanding to full-width actions.

## Elevation & Depth

Visual hierarchy uses layered dark surfaces, crisp micro-borders, and targeted spectral glows rather than traditional murky drop shadows:

- **Level 0 (Canvas Base):** Solid `#090A0F`. Non-interactive background with large, subtle radial gradient glows (`120px` to `200px` blur, 8% opacity violet/cyan) positioned behind interactive cards and hero screenshots.
- **Level 1 (Cards & Panels):** Solid `#0F111A` or semi-opaque `rgba(15, 17, 26, 0.75)` with `16px` backdrop-blur. Framed by a 1px border of `rgba(255, 255, 255, 0.08)`.
- **Level 2 (Active Floating Modules & Menus):** Background `#181B26` with a dual border: an inner 1px border of `rgba(255, 255, 255, 0.12)` and an outer glow shadow of `0 8px 32px -4px rgba(139, 92, 246, 0.25)`.
- **Level 3 (Modal Overlays & Popovers):** Background `#232738` with `0 16px 48px -8px rgba(0, 0, 0, 0.85)` and a subtle top-edge gradient border highlight (`linear-gradient(90deg, #8B5CF6, transparent)`).

## Shapes

The design system uses balanced geometric curves (`roundedness: 2`):

- **Standard Containers, Code Blocks, and Cards:** `0.75rem` (12px) to `1rem` (16px) corner radius.
- **Buttons and Inputs:** `0.5rem` (8px) corner radius for focused, technical utility.
- **Badges and Notification Pills:** Fully rounded pill shapes (`9999px`) to create an immediate visual contrast against geometric card grids.

## Components

### Buttons
- **Primary CTA:** Solid vibrant violet (`#8B5CF6`) with white text (`#FFFFFF`), `0.5rem` radius, subtle top-highlight glow, and a faint diffused purple aura on hover (`0 0 20px rgba(139, 92, 246, 0.4)`).
- **Secondary CTA:** Semi-transparent dark surface (`#181B26`), 1px border (`#232738`), high-contrast text (`#F8FAFC`). On hover, the border brightens to `rgba(255, 255, 255, 0.25)`.
- **Icon / Ghost Action:** Zero background, secondary text color, shifting to white with a cyan glowing icon upon hover.

### Badges & Pill Tags
- **Micro-Announcements:** Pill shape with translucent violet background (`rgba(139, 92, 246, 0.12)`), a fine 1px border (`rgba(139, 92, 246, 0.3)`), a glowing status indicator dot, and monospace label typography.
- **Model Badges (e.g., GPT-4o, Claude 3.5, Gemini):** Charcoal background (`#181B26`), `label-sm` font, subtle monochrome borders.

### Cards & Knowledge Blocks
- **Feature Cards:** Dark obsidian (`#0F111A`) with glassmorphism, 1px border (`rgba(255, 255, 255, 0.08)`), containing an accent icon seated inside an indigo/violet tinted tile (`rgba(99, 102, 241, 0.15)`).
- **Prompt Library Preview Container:** Multi-column layout simulating a real IDE or library workspace. Uses column dividers (`#181B26`), muted placeholder bars (`#232738`), and glowing accent tags to highlight active nodes.

### Inputs & Search Bars
- **Command / Search Field:** Deep slate background (`#0F111A`), inset 1px border (`#232738`), paired with keyboard shortcut chips (e.g., `⌘K`) in monospace. Focus state introduces an electric cyan border outline (`#38BDF8`) with a matching `2px` focus ring.

### Feature Checklists
- Displayed below hero CTAs with vivid emerald (`#34D399`) or bright cyan (`#38BDF8`) checkmarks, accompanied by compact secondary text (`#94A3B8`).
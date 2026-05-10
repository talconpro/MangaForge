---
name: Digital Technical Aesthetic
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#bacbbe'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#859589'
  outline-variant: '#3b4a41'
  surface-tint: '#21e199'
  primary: '#45f6ac'
  on-primary: '#003823'
  primary-container: '#00d992'
  on-primary-container: '#005939'
  inverse-primary: '#006c47'
  secondary: '#bdc8d5'
  on-secondary: '#27313c'
  secondary-container: '#3d4853'
  on-secondary-container: '#abb6c3'
  tertiary: '#dadada'
  on-tertiary: '#2f3131'
  tertiary-container: '#bdbebe'
  on-tertiary-container: '#4b4d4d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#51ffb4'
  primary-fixed-dim: '#21e199'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#005234'
  secondary-fixed: '#d9e4f1'
  secondary-fixed-dim: '#bdc8d5'
  on-secondary-fixed: '#121d26'
  on-secondary-fixed-variant: '#3d4853'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered for high-performance technology environments, evoking a sense of precision, innovation, and digital trust. It targets a tech-savvy audience that values clarity and efficiency in data-rich interfaces. 

The aesthetic is a fusion of **Modern Minimalism** and **Technical Dark Mode**. It utilizes a deep, nocturnal foundation punctuated by vibrant, high-energy accents. The interface focuses on high-contrast readability and a clean, systematic arrangement of elements, ensuring that functional components remain the primary focus while maintaining a sleek, futuristic edge.

## Colors

The color palette centers on a high-contrast relationship between a deep charcoal-black foundation and a luminous neon green. 

- **Primary Green (#00D992):** Used exclusively for high-priority actions, success states, and critical brand highlights. It provides a striking "glow" effect against the dark background.
- **Neutral Deep (#0B0E14):** Serves as the primary canvas. It reduces eye strain and provides a premium, technical backdrop for data.
- **Secondary Slate (#A8B3C0):** Utilized for secondary text, metadata, and non-interactive decorative elements, ensuring hierarchy without competing with primary information.
- **Absolute White (#FFFFFF):** Reserved for primary headings and critical readability elements to maximize contrast.

## Typography

This design system utilizes **Inter** for all typographic roles to maintain a utilitarian, systematic feel. The type scale is strictly hierarchical, using bold weights and tighter letter-spacing for headings to create a modern, "display" quality. 

Body text is optimized for readability against dark backgrounds with a generous line height. Labels and metadata utilize uppercase styling or increased letter spacing to differentiate themselves from interactive body content. For mobile screens, large display headings scale down to preserve the layout's structural integrity.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** approach for desktop views to maintain a structured, dashboard-like density, transitioning to a **Fluid Grid** for mobile devices. 

A 12-column system is used for desktop (1200px max-width), while a 4-column system is used for mobile. Spacing is governed by a strict 8px base unit, ensuring all margins and paddings are multiples of this unit. This geometric consistency reinforces the technical, engineered nature of the design system. Vertical rhythm is maintained through standardized gaps between sections (xl) and components (md).

## Elevation & Depth

Depth is achieved through **Tonal Layering** rather than traditional heavy shadows. As the canvas is near-black, elevation is communicated by slightly lightening the surface color of the element.

- **Level 0 (Background):** #0B0E14
- **Level 1 (Cards/Surfaces):** A slightly lighter tint of the neutral base to create subtle separation.
- **Outlines:** Low-contrast, 1px borders using the Secondary Slate at 20% opacity are preferred over shadows for defining container boundaries.
- **Focus States:** A subtle outer glow using the Primary Green (15% opacity) is used for active inputs or featured cards to simulate a digital "on" state.

## Shapes

The shape language is consistently **Rounded**, striking a balance between approachable software and rigid technical tools.

A standard radius of 0.5rem (8px) is applied to buttons, input fields, and small UI components. Larger containers, such as cards or modals, utilize 1rem (16px) or 1.5rem (24px) for a softer, more modern silhouette. This intentional rounding softens the high-contrast color palette, making the interface feel sophisticated rather than aggressive.

## Components

### Buttons
- **Primary:** Solid #00D992 background with #0B0E14 text. No border. 
- **Secondary:** Transparent background with a 1px #A8B3C0 border and #FFFFFF text.
- **Tertiary:** Text-only with an underline effect on hover using the primary color.

### Input Fields
Inputs use a slightly lighter background than the main canvas. Borders are invisible by default, appearing as 1px #00D992 only upon focus. Placeholder text uses #A8B3C0 at 60% opacity.

### Cards
Cards are the primary container. They feature a 1px border (#A8B3C0 at 20% opacity) and a subtle background lift. Headers within cards should be separated by a thin horizontal rule.

### Chips & Tags
Small, pill-shaped indicators with low-opacity #00D992 backgrounds and solid #00D992 text. These are used for status indicators (e.g., "Active," "New").

### Lists
Interactive lists use a hover state that slightly lightens the background of the row, providing immediate tactile feedback without changing the text color.
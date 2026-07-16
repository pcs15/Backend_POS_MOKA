---
name: Botanical Precision
colors:
  surface: '#f9faf7'
  surface-dim: '#d9dad8'
  surface-bright: '#f9faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f1'
  surface-container: '#edeeeb'
  surface-container-high: '#e7e8e6'
  surface-container-highest: '#e2e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#424842'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#f0f1ee'
  outline: '#727972'
  outline-variant: '#c2c8c0'
  surface-tint: '#45664d'
  primary: '#0c2d19'
  on-primary: '#ffffff'
  primary-container: '#23432d'
  on-primary-container: '#8cb093'
  inverse-primary: '#abcfb2'
  secondary: '#3a6847'
  on-secondary: '#ffffff'
  secondary-container: '#bbefc4'
  on-secondary-container: '#406e4c'
  tertiary: '#052d1a'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e432f'
  on-tertiary-container: '#88b095'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6eccd'
  primary-fixed-dim: '#abcfb2'
  on-primary-fixed: '#01210e'
  on-primary-fixed-variant: '#2d4e37'
  secondary-fixed: '#bbefc4'
  secondary-fixed-dim: '#a0d2aa'
  on-secondary-fixed: '#00210d'
  on-secondary-fixed-variant: '#215031'
  tertiary-fixed: '#c3eccf'
  tertiary-fixed-dim: '#a7d0b4'
  on-tertiary-fixed: '#002111'
  on-tertiary-fixed-variant: '#294e39'
  background: '#f9faf7'
  on-background: '#191c1b'
  surface-variant: '#e2e3e0'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 57px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-tablet: 24px
---

## Brand & Style

The design system is engineered for high-end hospitality environments, specifically tailored for Android-based point-of-sale hardware. The brand personality is grounded, organic, and exceptionally efficient. It balances the warmth of a boutique coffee shop with the rigorous performance requirements of a fast-paced retail environment.

The visual style follows a **Modern Professional** aesthetic with heavy influences from **Material Design 3**, utilizing expansive soft surfaces and generous touch targets. By employing a "Botanical" color palette, the UI reduces eye strain for baristas during long shifts while maintaining a premium, editorial feel that aligns with high-quality artisanal coffee brands. The emotional response is one of calm reliability and tactile precision.

## Colors

The palette is anchored by deep forest greens and soft sage tones to create a sophisticated, natural atmosphere.

- **Primary (#23432D):** Used for key action buttons, active states, and brand-heavy elements.
- **Secondary (#4D7C59):** Used for tonal variations in the UI, such as category filters or secondary navigation items.
- **Accent (#8EB69B):** A softer green used for decorative elements, subtle highlights, and low-priority toggle states.
- **Background (#F7F8F5):** A warm, off-white neutral that eliminates the harsh glare of pure white, essential for mobile POS use.
- **Surface (#FFFFFF):** Pure white is reserved for high-elevation components like cards, modals, and the "Order Summary" tray to create clear container boundaries.

## Typography

This design system utilizes **Plus Jakarta Sans** for its modern, geometric clarity and friendly curves, which complement the rounded corner strategy.

For POS environments, readability at arm's length is critical. Headline styles are bold and tight to ensure menu items are instantly recognizable. Labels utilize a slightly heavier weight (`600`) to remain legible against colorful backgrounds in high-activity areas like the cart or modifier lists. For mobile interfaces, use the `mobile` variants to ensure text fits within constrained horizontal layouts without excessive wrapping.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with high-density padding. Because this is a mobile-first POS, the 8dp grid system is strictly enforced to ensure touch targets never fall below 48x48dp.

- **Mobile:** 4-column grid with 16px margins. Content is typically stacked vertically.
- **Tablet (Landscape):** 12-column grid. The "Cart/Checkout" area is pinned to the right (spanning 4 columns) while the "Product Grid" remains fluid on the left.
- **Rhythm:** Use `md` (16px) for standard spacing between related elements and `lg` (24px) to separate distinct sections of the UI, such as the category header from the product list.

## Elevation & Depth

In accordance with Material 3 principles, this design system uses **Tonal Layers** as the primary method of showing depth, supplemented by soft, low-intensity shadows.

1.  **Level 0 (Background):** Used for the main canvas (`#F7F8F5`). No shadow.
2.  **Level 1 (Cards/Surface):** Used for product tiles. 1dp elevation with a very soft, diffused shadow (Blur: 4px, Y: 2px, Opacity: 4% Black).
3.  **Level 2 (Modals/Overlays):** Used for item modification sheets. 6dp elevation with a larger shadow (Blur: 12px, Y: 4px, Opacity: 8% Primary Color Tinted).
4.  **Active State:** When an item is selected or pressed, it should use a subtle inner stroke of the primary color rather than a deep shadow to maintain the clean, modern aesthetic.

## Shapes

The design system is defined by its **Extremely Rounded** aesthetic. This softness communicates a welcoming, modern atmosphere characteristic of high-end cafes.

- **Standard Containers:** Use 28dp (`rounded-xl` / Pill-shaped logic) for all main cards, buttons, and input fields.
- **Small Elements:** Use 12dp for smaller utility chips or status indicators.
- **Bottom Sheets:** Use 28dp for the top-left and top-right corners to maintain consistency with the hardware's physical bezel curves.

## Components

### Buttons
- **Primary:** Solid `#23432D` with white text. 28dp corner radius. Height: 56dp for main actions.
- **Secondary:** Tonal surface using `#8EB69B` at 20% opacity with `#23432D` text.
- **Icons:** Always use **Material Symbols Rounded** to match the UI’s softness.

### Product Cards
- Surface: `#FFFFFF`. Elevation: Level 1.
- Layout: Large image (top) with 16dp padding for the title and price below.
- Corner Radius: 28dp.

### Input Fields
- Filled style with a very light tint of the primary color.
- No bottom line; instead, use a full 28dp rounded container.
- Focused state: 2px solid border using Primary color.

### Chips (Categories)
- Unselected: Background `#F7F8F5` with a 1px stroke of `#8EB69B`.
- Selected: Solid `#4D7C59` with white text.

### List Items (Order Summary)
- High-density layout. Use `body-md` for modifiers and `label-lg` for item names.
- Dividers: 1px solid `#F7F8F5` with 16px horizontal margins.

### Checkout Tray
- Fixed at the bottom of the screen. 
- Use a slight elevation (Level 2) or a thick 28dp rounded top-edge to differentiate from the product grid.
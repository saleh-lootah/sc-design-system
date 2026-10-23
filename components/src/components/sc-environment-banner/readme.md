# sc-environment-banner

Marks a build that is not the live service: development, QA, UAT, staging or training (Standard CHR-13). Spec: `specs/sc-environment-banner.md`. For public messages such as planned maintenance, use `sc-announcement-bar`.

## CSS only

Not a registered custom element; `sc.css` styles it. Render it from the environment's configuration, never in production.

## Usage

```html
<sc-environment-banner>
  <section aria-label="Test version">
    <p><strong>QA</strong>This is a test version of Dubai Now. Don't enter real personal or payment details.</p>
  </section>
</sc-environment-banner>
```

Put it first on the page, after the skip link and before the official banner. It is not dismissible and not sticky.

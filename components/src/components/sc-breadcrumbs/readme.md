# sc-breadcrumbs

Where this page sits in the channel's hierarchy, on channel pages outside a transaction, in the hero of inner pages (CHR-07). Never inside a journey: use `sc-back-link` there.

## v2: CSS only

`sc-breadcrumbs` is not a registered custom element (like `sc-container`). `sc.css` styles the tag and the markup inside it, so it needs no JavaScript and works with scripting off (PERF-04).

## Usage

```html
<sc-breadcrumbs>
  <nav aria-label="Breadcrumb">
    <ol>
      <li><a href="/en">Home</a></li>
      <li><a href="/en/vehicles">Vehicles</a></li>
      <li aria-current="page">Renew your vehicle registration</li>
    </ol>
  </nav>
</sc-breadcrumbs>
```

- Name the `<nav>` "Breadcrumb" (Arabic "مسار التنقل").
- The last item is the current page, as text with `aria-current="page"`: Bold, never underlined.
- Ancestor links are underlined in every state (R6), with 44 × 44 targets (B2). Chevrons sit between items and mirror in Arabic.
- Below 600px only the parent shows, as one "Back to {parent}" link (Arabic "رجوع إلى {parent}"). To change the words, set `--sc-breadcrumbs-back`, for example `style="--sc-breadcrumbs-back: 'Return to '"`.

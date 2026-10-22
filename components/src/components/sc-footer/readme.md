# sc-footer

The page footer: support and legal links on every page (Standard CHR-06). Two variants: `simple` (transaction pages, one row of links) and `grouped` (channel sites: the channel's brand, all seven channels, Helpful information and Legal).

## v2: CSS only

`sc-footer` is not a registered custom element (like `sc-container`). `sc.css` styles the tag and the plain markup inside it, so it needs no JavaScript, is at its final size at first paint and works with scripting off (PERF-04). Write every link and line in the page language.

## Usage

### Simple

```html
<sc-footer>
  <footer>
    <nav aria-label="Support links"><ul>
      <li><a href="/en/help">Help and contact</a></li>
      <li><a href="/en/accessibility">Accessibility statement</a></li>
      <li><a href="/en/privacy">Privacy and cookies</a></li>
      <li><a href="/en/terms">Terms of use</a></li>
    </ul></nav>
    <p>Government of Dubai</p>
  </footer>
</sc-footer>
```

### Grouped (channel sites)

```html
<sc-footer variant="grouped">
  <footer>
    <div class="sc-footer__brand">
      <p>Dubai Now</p>
      <p>Government services for everyone who lives in Dubai, in one place.</p>
    </div>
    <section class="sc-footer__channels" aria-labelledby="footer-channels">
      <h2 id="footer-channels">Channels</h2>
      <ul>
        <li><a href="/en/" hreflang="en" aria-current="true">Dubai Now</a></li>
        <li><a href="https://transport.example/en/" hreflang="en">Dubai Transport</a></li>
        <!-- … all seven, in the Standard 3.1 order -->
      </ul>
    </section>
    <section aria-labelledby="footer-helpful">
      <h2 id="footer-helpful">Helpful information</h2>
      <ul>
        <li><a href="/en/about">About Dubai Now</a></li>
        <li><a href="/en/help">Help and contact</a></li>
        <li><a href="/en/accessibility">Accessibility statement</a></li>
        <li><a href="/en/sitemap">Sitemap</a></li>
      </ul>
    </section>
    <section aria-labelledby="footer-legal">
      <h2 id="footer-legal">Legal</h2>
      <ul>
        <li><a href="/en/privacy">Privacy and cookies</a></li>
        <li><a href="/en/terms">Terms of use</a></li>
      </ul>
    </section>
    <div class="sc-footer__lower">
      <p>Government of Dubai · Last updated 12 October 2026</p>
      <p>Dubai Now is run by the Government of Dubai</p>
    </div>
  </footer>
</sc-footer>
```

- The `<footer>` is the `contentinfo` landmark and the content box: grid margins, the 1280px cap, a 1px rule above.
- Links are label-medium in `on-surface`, underlined in every state (R6), 2px on hover, at least 44px tall.
- The current channel is the item with `aria-current="true"`: Bold, with a 3px `channel-action` bar at its inline start (R10). A channel without a link is a `<span>`.
- In Arabic, write the same in Arabic: روابط الدعم، القنوات، معلومات مفيدة، المعلومات القانونية، حكومة دبي. See `specs/sc-footer.md` for every standard label.

| Attribute | Values | Default |
| --- | --- | --- |
| `variant` | `simple`, `grouped` | `simple` |
| `hidden` | | |

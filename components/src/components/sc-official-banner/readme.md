# sc-official-banner

The first thing on every page: "An official website of the Government of Dubai", with a "How to check" disclosure that explains how to tell an official, secure website (Standard CHR-12). Spec: `specs/sc-official-banner.md`.

## CSS only

`sc-official-banner` is not a registered custom element. `sc.css` styles the tag and a native `<details>` inside it, so it needs no JavaScript and opens with the keyboard on its own. Write the words in the page language.

## Usage

```html
<sc-official-banner>
  <section aria-label="Official website of the Government of Dubai">
    <details>
      <summary><span>An official website of the Government of Dubai</span> <span>How to check</span></summary>
      <div>
        <p class="sc-official-banner__domain"><strong>Official websites use <sc-ltr>.gov.ae</sc-ltr></strong>An address that ends in .gov.ae means the website belongs to a government organisation in the UAE.</p>
        <p class="sc-official-banner__https"><strong>Secure websites use <sc-ltr>HTTPS</sc-ltr></strong>A lock or https:// before the address means your connection is secure. Share personal or payment details only on official, secure websites.</p>
      </div>
    </details>
  </section>
</sc-official-banner>
```

Place it after the skip link (and the environment banner on test builds), before the announcement bar and the header.

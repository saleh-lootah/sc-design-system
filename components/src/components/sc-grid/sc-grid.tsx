import { Component, Host, Prop, h } from '@stencil/core';

/**
 * The layout grid: 4 columns on phones, 8 from 600px and 12 from 1024px, with gutters from
 * the layout tokens (16, 20, 24px). Each child is a grid item.
 *
 * Item widths are set once for all children with `span`, `span-medium` and `span-expanded`
 * (each falls back to the smaller one, and is capped at the number of columns), or per
 * child with the `--sc-grid-span` custom property, e.g. `style="--sc-grid-span: 8"`.
 *
 * Service cards three to a row on desktop, two on tablets and one on phones:
 * `<sc-grid span-medium="4" span-expanded="4">`.
 *
 * @slot - Grid items.
 *
 * @part grid - The grid element.
 */
@Component({
  tag: 'sc-grid',
  styleUrl: 'sc-grid.css',
  shadow: true,
})
export class ScGrid {
  /** Columns each item spans on phones (4 columns). Defaults to the full width. */
  @Prop() span?: number;

  /** Columns each item spans from 600px (8 columns). Defaults to `span`. */
  @Prop() spanMedium?: number;

  /** Columns each item spans from 1024px (12 columns). Defaults to `span-medium`. */
  @Prop() spanExpanded?: number;

  private clean(n: unknown): number | undefined {
    const v = Math.round(Number(n));
    return Number.isFinite(v) && v >= 1 ? Math.min(v, 12) : undefined;
  }

  render() {
    const s = this.clean(this.span) ?? 12;
    const m = this.clean(this.spanMedium) ?? s;
    const x = this.clean(this.spanExpanded) ?? m;
    return (
      <Host style={{ '--_span-compact': String(s), '--_span-medium': String(m), '--_span-expanded': String(x) }}>
        <div class="grid" part="grid">
          <slot />
        </div>
      </Host>
    );
  }
}

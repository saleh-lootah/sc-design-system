import { Component, Host, Prop, h } from '@stencil/core';

export type ContainerWidth = 'page' | 'reading';

/**
 * Centres content and sets the page's outer margins from the layout tokens: 20px on
 * phones, 32px from 600px, 48px from 1024px and 80px from 1440px, with content capped at
 * `--sc-container-max` (1280px). `width="reading"` caps it at the 680px reading width instead,
 * for question pages and running text.
 *
 * @slot - The page content.
 *
 * @part inner - The width-capped wrapper inside the margins.
 */
@Component({
  tag: 'sc-container',
  styleUrl: 'sc-container.css',
  shadow: true,
})
export class ScContainer {
  /** `page` (default) caps content at 1280px; `reading` caps it at 680px and keeps it at the start, aligned with page content. */
  @Prop({ reflect: true }) width: ContainerWidth = 'page';

  render() {
    return (
      <Host>
        <div class="inner" part="inner">
          <slot />
        </div>
      </Host>
    );
  }
}

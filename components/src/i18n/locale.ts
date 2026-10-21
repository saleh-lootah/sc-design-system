/**
 * LEGACY (v1) locale controller over the merged dictionary in ./strings.ts. v1 components
 * keep using it unchanged until their family agent migrates them; v2 components use
 * ./controller.ts with their own strings file, so they never bundle every component's text.
 */
import { ComponentInterface } from '@stencil/core';
import { LocaleController as Base, resolveDir, resolveLang } from './controller';
import { strings } from './strings';
import type { Dictionary } from './strings';

export { resolveDir, resolveLang };

export class LocaleController extends Base<Dictionary> {
  constructor(component: ComponentInterface) {
    super(component, strings);
  }
}

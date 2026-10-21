/**
 * The icons `sc-empty-state`'s `icon` property can name. Anything else goes in `slot="icon"`.
 */
import { FunctionalComponent, h } from '@stencil/core';
import type { IconProps } from './svg';
import { Inbox, Search } from './common';
import { CheckCircle, Info, Warning, AlertCircle, Schedule } from './status';

const set = {
  'inbox': Inbox,
  'search': Search,
  'check-circle': CheckCircle,
  'info': Info,
  'warning': Warning,
  'alert-circle': AlertCircle,
  'schedule': Schedule,
};

export type EmptyStateIconName = keyof typeof set;

/** Renders an empty-state icon by name; nothing for a name outside the set. */
export const EmptyStateIcon: FunctionalComponent<IconProps & { name?: string }> = ({ name, ...rest }) => {
  const Icon = name ? set[name as EmptyStateIconName] : undefined;
  return Icon ? <Icon {...rest} /> : null;
};

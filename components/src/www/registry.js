/*
 * Playground page registry. ONE LINE PER PAGE; append yours at the end, order doesn't matter
 * (the sidebar sorts by group, then title). From the components folder:
 *
 *   echo "page('Feedback and status', 'sc-callout', 'Callout');" >> src/www/registry.js
 *
 * page(group, id, title): the page body is src/www/pages/<id>.html.
 * Groups: 'Foundations', 'Actions and navigation', 'Form fields', 'Feedback and status', 'Content and layout'.
 */
var scPlaygroundPages = (window.scPlaygroundPages = window.scPlaygroundPages || []);
function page(group, id, title) { scPlaygroundPages.push({ group: group, id: id, title: title }); }
page('Foundations', 'foundations', 'Foundations');
page('Actions and navigation', 'sc-button', 'Button');
page('Actions and navigation', 'sc-link', 'Link');
page('Actions and navigation', 'sc-back-link', 'Back link');
page('Actions and navigation', 'sc-app-bar', 'App bar');
page('Actions and navigation', 'sc-language-switch', 'Language switch');
page('Actions and navigation', 'sc-skip-link', 'Skip link');
page('Content and layout', 'sc-card', 'Card');
page('Content and layout', 'sc-summary-list', 'Summary list');
page('Content and layout', 'sc-service-card', 'Service card');
page('Content and layout', 'sc-channel-hero', 'Channel hero');
page('Content and layout', 'sc-search', 'Search');
page('Content and layout', 'sc-page', 'Page shell');
page('Content and layout', 'sc-container', 'Container');
page('Content and layout', 'sc-grid', 'Grid');
page('Content and layout', 'sc-footer', 'Footer');
page('Feedback and status', 'sc-error-summary', 'Error summary');
page('Feedback and status', 'sc-callout', 'Callout');
page('Feedback and status', 'sc-status-tag', 'Status tag');
page('Feedback and status', 'sc-channel-chip', 'Channel chip');
page('Feedback and status', 'sc-step-progress', 'Step progress');
page('Feedback and status', 'sc-spinner', 'Spinner');
page('Form fields', 'sc-text-input', 'Text input');
page('Form fields', 'sc-textarea', 'Textarea');
page('Form fields', 'sc-select', 'Select');
page('Form fields', 'sc-radio-group', 'Radio group');
page('Form fields', 'sc-checkbox-group', 'Checkbox group');
page('Form fields', 'sc-date-input', 'Date input');
page('Content and layout', 'sc-table', 'Table');
page('Form fields', 'sc-date-range', 'Date range');
page('Form fields', 'sc-filter-chips', 'Filter chips');

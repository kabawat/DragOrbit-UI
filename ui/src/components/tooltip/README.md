# Tooltip

Import `Tooltip` from `@dragorbit/ui` for non-interactive hover hints. It preserves the trigger's element, ref, layout, and event handlers.

```jsx
<Tooltip content="Pin column">
  <button aria-label="Pin column">...</button>
</Tooltip>
```

Shared `Button` automatically displays its `title` with this component:

```jsx
<Button title="Add entry (Alt + N)" aria-keyshortcuts="Alt+n">
  Add entry
</Button>
```

- `content`: tooltip text or non-interactive React content; empty content disables the tooltip.
- `side`: `top` (default) or `bottom`; flips and clamps to the viewport when needed.
- `delay`: hover delay in milliseconds (default: 350); keyboard focus opens immediately.
- Children must be a single native element or a component that forwards HTML pointer/focus handlers and `aria-describedby` to its element.

Colors and font follow the trigger, including scoped themes. Content renders in a portal to avoid clipping inside tables, drawers, and modals. Escape dismisses the tooltip, and only one tooltip is shown at a time. Keep explicit accessible names on icon-only controls; tooltip text supplements the control's label.

Use chart-specific tooltips for chart data, and popovers for interactive content.

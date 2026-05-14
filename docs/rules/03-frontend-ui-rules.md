# Frontend UI Rules

## General UI

- Match the existing color scheme and component language.
- Prefer existing design system primitives and local patterns.
- Do not build marketing-style landing pages when the request is for a usable app, admin screen, or tool.
- Use icons from `lucide-react` when an icon exists.
- Use familiar icon buttons for common tools instead of text-only controls where appropriate.
- Keep card radius restrained, generally `8px` or less unless the existing component requires otherwise.
- Do not put cards inside cards.
- Avoid decorative gradient orbs, bokeh blobs, and one-note palettes.
- Ensure text fits its container on mobile and desktop.
- Do not scale font size with viewport width.
- Letter spacing should remain `0`, not negative.

## Admin UI

- Admin screens are operational tools, not marketing pages.
- Prioritize clear labels, compact spacing, predictable grouping, and fast scanning.
- Use form controls that map directly to editor tasks.
- Avoid raw JSON, technical enum-only labels, and hidden behavior.

## Public Project UI

- Project cards should be clickable when they open a preview.
- Multiple project images should autoplay on hover in the project list.
- Project modal and detail page carousels should use the documented carousel behavior and timing.
- Carousel thumbnails should indicate selected state by keeping the selected image clear and blurring/fading unselected images.
- Carousel autoplay interval is `4s` unless a future feature changes it.
- Slide direction must match navigation direction.

## Contact UI

- Contact form fields must have visible labels.
- Required fields must be marked.
- Placeholders should be sample inputs, not field names.
- Message input must be a textarea with enough starting height and auto-adjusting height.


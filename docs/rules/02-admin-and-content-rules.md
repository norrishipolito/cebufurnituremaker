# Admin And Content Rules

## Editable Content

- Editable content must have runtime default fallbacks for an empty database.
- Defaults live in `src/lib/default-site-content.ts`.
- Public pages should read database-backed content first and fall back to defaults.
- Admin content editing must use friendly form controls, not raw JSON.
- Placeholder text and image URLs must be clearable after content is saved.
- Do not force defaults back into saved empty fields.
- Navigation is fixed site structure and must not be exposed in the content editor unless a future feature explicitly reopens that scope.

## Admin UX

- The admin UI should be practical, dense, and editor-friendly.
- Use labels that describe the actual editable field.
- Use example placeholders where helpful.
- Content sections are expandable/collapsible and collapsed by default.
- The admin header includes a persistent dark mode toggle.
- Authenticated admin pages show sticky header/sidebar and a visible sign-out action.
- `/admin/login` must not show admin chrome.
- The admin Documentation page must stay authenticated and include page-by-page workflow guidance.

## Projects

- Projects have full CRUD in the admin UI.
- Project grouping/type controls are retired from the editor and public UI; saved projects are shown together as one `Projects` collection.
- The existing `projects.group` database column is an internal compatibility field and should default to `projects` for new editor writes.
- Project visibility uses a checkbox labeled `Show in Projects section`.
- Project sorting is drag-based. Do not expose numeric sort-order inputs to editors.
- Project images are uploaded from the Projects page, not the Media page.
- Project create/edit forms must support selecting multiple image files.
- Uploaded project images attach through `project_assets`.
- Admin project rows should show attached image thumbnails and allow detaching images from the project without deleting the media asset.
- Public project cards, modals, and detail pages must support multiple images.

## Contact

- The contact section content is editable from `/admin/content`.
- Editable contact fields include title, description, email, email card description, project inquiry title/value/description, phone, phone card description, address, address card description, hours title, and workshop hours.
- The public contact form uses visible labels, required indicators, sample placeholders, and an auto-growing message textarea.

## Footer

- Footer content is editable from `/admin/content`.
- The footer content editor should group brand copy, social links, footer columns, and a compact preview into friendly form controls.
- Footer social links are Facebook, Instagram, and Twitter only unless a future feature explicitly adds another platform.
- Footer link columns are repeatable editor-controlled rows.

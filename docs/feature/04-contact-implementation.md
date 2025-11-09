# Contact Feature Implementation

## Overview

The Contact feature is a contact form section that allows visitors to get in touch with Cebu Furniture Maker. It includes a compact contact form and contact information display in a two-column layout. The form is designed to fit within the section height while maintaining usability. The implementation follows the component architecture rules, with the main component in `_components/` and sub-components in `features/`.

## Architecture

### File Structure

```
src/
├── app/(landing-page)/
│   └── _components/
│       └── contact.tsx                    # Main Contact component (page layout)
│
└── features/home/contact/
    └── components/
        ├── contact-header.tsx               # Header with title and description
        ├── contact-form.tsx                # Contact form component
        ├── contact-info.tsx                 # Contact information display
        └── index.ts                         # Component exports
```

## Component Breakdown

### Main Component: `contact.tsx`

**Location**: `src/app/(landing-page)/_components/contact.tsx`

**Purpose**: Orchestrates all contact sub-components and provides the main layout structure.

**Responsibilities**:
- Imports and composes sub-components
- Provides section container with full-height layout
- Manages two-column responsive grid layout

**Key Features**:
- Full-height section (`min-h-screen`)
- Two-column layout (form + info)
- Responsive design (stacks on mobile)
- Dark mode support

**Code Example**:
```tsx
"use client";

import { ContactHeader } from "@/features/home/contact/components/contact-header";
import { ContactForm } from "@/features/home/contact/components/contact-form";
import { ContactInfo } from "@/features/home/contact/components/contact-info";

export function Contact() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-5xl w-full">
        <ContactHeader />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <ContactForm />
          </div>
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Sub-Components

#### 1. ContactHeader

**Location**: `src/features/home/contact/components/contact-header.tsx`

**Purpose**: Displays the section header with title and description.

**Features**:
- Animated entrance with Framer Motion
- Responsive typography
- Centered text layout
- Dark mode support
- Staggered text animations

**Animation**:
- Container: Initial `opacity: 0, y: 20` → Animate `opacity: 1, y: 0`
- Title: Delay 0.1s
- Description: Delay 0.2s
- Duration: 0.6s
- Viewport: `once: true` (animates only once when scrolled into view)

**Content**:
- Title: "Get in Touch"
- Description: "Have a project in mind? Let's discuss how we can bring your furniture vision to life."

#### 2. ContactForm

**Location**: `src/features/home/contact/components/contact-form.tsx`

**Purpose**: Renders the contact form with input fields and submit button.

**Features**:
- Form state management with React hooks
- Multiple input fields (name, email, phone, inquiry type, message)
- Select dropdown for inquiry type
- Form validation (required fields)
- Submit button with icon
- Compact spacing for section height fit
- Animated entrance

**Form Fields**:
1. **Name** (required) - Text input
2. **Email** (required) - Email input
3. **Phone** (optional) - Tel input
4. **Inquiry Type** (optional) - Select dropdown:
   - Custom Furniture
   - Catalog Items
   - Design Consultation
   - Other
5. **Message** (required) - Text input

**Layout**:
- Grid layout: `grid-cols-1 sm:grid-cols-2` for responsive fields
- Compact spacing: `space-y-4`
- Input height: `h-11` for consistency

**Animation**:
- Initial: `opacity: 0, y: 20`
- Animate: `opacity: 1, y: 0`
- Delay: 0.3s
- Duration: 0.6s

#### 3. ContactInfo

**Location**: `src/features/home/contact/components/contact-info.tsx`

**Purpose**: Displays contact information with icons.

**Features**:
- Three contact information items
- Icon-based layout
- Animated entrance with staggered delays
- Dark mode support

**Contact Items**:
1. **Email**: `info@cebufurnituremaker.com` (Mail icon)
2. **Phone**: `+63 32 123 4567` (Phone icon)
3. **Address**: `Cebu City, Philippines` (MapPin icon)

**Layout**:
- Vertical stack: `space-y-6`
- Each item: Flex row with icon and text
- Icon container: `w-10 h-10` with colored background
- Staggered animations: 0.5s, 0.6s, 0.7s delays

**ContactInfoItem Component**:
- Icon display in colored container
- Title (small, muted text)
- Value (larger, bold text)
- Slide-in animation from left

## Design Features

### Layout

- **Section**: Full-height (`min-h-screen`) with centered content
- **Padding**: `py-24` (vertical), `px-4 sm:px-6 lg:px-8` (horizontal)
- **Max Width**: `max-w-5xl` (1024px)
- **Grid Gap**: `gap-12 lg:gap-16` (48px mobile, 64px desktop)
- **Background**: `bg-white dark:bg-gray-950`

### Typography

- **Header Title**: `text-4xl font-bold` (mobile), `sm:text-5xl` (desktop)
- **Header Description**: `text-lg` with max-width constraint
- **Form Labels**: Implicit (via placeholder text)
- **Info Title**: `text-sm font-medium`
- **Info Value**: `text-base font-semibold`

### Colors

- **Text**: `text-gray-900 dark:text-white` (headings)
- **Description**: `text-gray-600 dark:text-gray-400`
- **Info Title**: `text-gray-500 dark:text-gray-400`
- **Icon Background**: `bg-primary/10 dark:bg-primary/20`
- **Icon Color**: `text-primary`
- **Background**: `bg-white dark:bg-gray-950`

### Form Styling

- **Input Height**: `h-11` (44px) for consistency
- **Input Spacing**: `space-y-4` (16px vertical gap)
- **Grid Layout**: Responsive 2-column on desktop, 1-column on mobile
- **Button**: Full-width with icon

### Icons

All icons are from `lucide-react`:
- `Send` - Submit button icon
- `Mail` - Email contact info
- `Phone` - Phone contact info
- `MapPin` - Address contact info

### Animations

1. **Header Animation**:
   - Fade in from bottom
   - Staggered text elements
   - Triggers once when scrolled into view

2. **Form Animation**:
   - Fade in from bottom
   - Delay: 0.3s
   - Smooth entrance

3. **Info Animation**:
   - Slide in from left
   - Staggered delays (0.5s, 0.6s, 0.7s)
   - Smooth entrance

## Usage

### Basic Usage

```tsx
import { Contact } from "./_components/contact";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Testimonials />
      <Contact />
    </>
  );
}
```

### Customization

#### Modifying Form Fields

Edit `contact-form.tsx`:

```tsx
// Add new field
<div>
  <Input
    type="text"
    placeholder="Company Name"
    value={formData.company}
    onChange={(e) => handleChange("company", e.target.value)}
    className="h-11"
  />
</div>
```

#### Adding Inquiry Options

Edit `contact-form.tsx`:

```tsx
<SelectContent>
  <SelectItem value="custom">Custom Furniture</SelectItem>
  <SelectItem value="catalog">Catalog Items</SelectItem>
  <SelectItem value="consultation">Design Consultation</SelectItem>
  <SelectItem value="repair">Furniture Repair</SelectItem>
  <SelectItem value="other">Other</SelectItem>
</SelectContent>
```

#### Modifying Contact Information

Edit `contact-info.tsx`:

```tsx
<ContactInfoItem
  icon={Mail}
  title="Email"
  value="your-email@example.com"
  delay={0.5}
/>
```

#### Changing Form Layout

Edit `contact.tsx`:

```tsx
// Single column layout
<div className="max-w-2xl mx-auto">
  <ContactForm />
  <ContactInfo />
</div>

// Different grid ratio
<div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
  <div className="lg:col-span-2">
    <ContactForm />
  </div>
  <div>
    <ContactInfo />
  </div>
</div>
```

#### Adjusting Section Height

Edit `contact.tsx`:

```tsx
// Remove full-height
<section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">

// Custom height
<section className="min-h-[600px] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
```

#### Customizing Form Spacing

Edit `contact-form.tsx`:

```tsx
// More compact
<motion.form className="space-y-3">

// More spacious
<motion.form className="space-y-6">
```

## Props and Interfaces

### ContactInfoItemProps

```typescript
interface ContactInfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  delay: number;
}
```

## Form State Management

The form uses React's `useState` hook to manage form data:

```typescript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  inquiry: "",
  message: "",
});
```

### Form Submission

Currently, the form logs data to console. To implement actual submission:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Send to API endpoint
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  
  // Handle response
  if (response.ok) {
    // Show success message
    // Reset form
  }
};
```

## Dependencies

- **framer-motion**: For animations and scroll-triggered effects
- **lucide-react**: For icons (Send, Mail, Phone, MapPin)
- **@radix-ui/react-select**: For select dropdown (via shadcn)
- **@radix-ui/react-slot**: For button component (via shadcn)
- **class-variance-authority**: For component variants (via shadcn)
- **tailwindcss**: For styling and responsive design

## Performance Considerations

1. **Form State**: Uses local state management (no external libraries)
2. **Animations**: Only trigger once when scrolled into view
3. **Image Optimization**: Not applicable (no images in form)
4. **Component Splitting**: Sub-components allow for code splitting
5. **Form Validation**: Client-side validation with HTML5 attributes

## Responsive Behavior

### Mobile (< 1024px)
- Single column layout (form stacks above info)
- Full-width form fields
- Reduced spacing
- Stacked contact info items

### Desktop (> 1024px)
- Two-column layout (form left, info right)
- Two-column form fields where appropriate
- Maximum content width (1024px)
- Generous spacing

## Accessibility

- Semantic HTML (`<section>`, `<form>`, proper input types)
- Form labels (via placeholder text and implicit association)
- Required field indicators (HTML5 `required` attribute)
- Keyboard navigation support
- Screen reader friendly
- Proper contrast ratios
- Focus states on interactive elements
- Form validation feedback

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript for form functionality
- Requires CSS Grid support
- HTML5 form validation support

## Form Validation

### Client-Side Validation

- **Required Fields**: Name, Email, Message
- **Email Format**: Validated by browser (HTML5 `type="email"`)
- **Phone Format**: Optional, validated by browser (HTML5 `type="tel"`)

### Server-Side Validation

To implement server-side validation, create an API route:

```tsx
// app/api/contact/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Validate data
  if (!data.name || !data.email || !data.message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  
  // Process and send email
  // ...
  
  return Response.json({ success: true });
}
```

## Future Enhancements

Potential improvements:
- [ ] Add form validation with error messages
- [ ] Implement success/error toast notifications
- [ ] Add loading state during submission
- [ ] Integrate with email service (SendGrid, Resend, etc.)
- [ ] Add reCAPTCHA for spam protection
- [ ] Implement form field auto-save
- [ ] Add file upload for design references
- [ ] Create form analytics tracking
- [ ] Add multi-step form wizard
- [ ] Implement form field dependencies

## Related Documentation

- [Component Architecture Rules](../01-component-architecture-rules.md)
- [Application Architecture](../00-application-architecture.md)
- [Hero Implementation](./00-hero-implementation.md)
- [Projects Implementation](./01-projects-implementation.md)
- [About Implementation](./02-about-implementation.md)
- [Testimonials Implementation](./03-testimonials-implementation.md)
- [ShadcnBlocks Contact1](https://www.shadcnblocks.com/block/contact1)

## Troubleshooting

### Form Not Submitting

1. **Check Console**: Verify form data is logged
2. **API Route**: Ensure API route exists if implementing server-side
3. **Network**: Check network tab for errors
4. **Validation**: Verify required fields are filled

### Select Dropdown Not Working

1. **Radix UI**: Ensure @radix-ui/react-select is installed
2. **Import**: Verify Select components are imported correctly
3. **State**: Check if value and onValueChange are properly set

### Animations Not Working

1. **Framer Motion**: Ensure framer-motion is installed
2. **Client Component**: Verify component has `"use client"` directive
3. **Viewport**: Check if element is in viewport

### Layout Issues

1. **Grid**: Verify Tailwind classes are correct
2. **Container**: Check max-width constraints
3. **Responsive**: Test on different screen sizes
4. **Height**: Verify section height fits content

## Example: Adding Form Validation

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  }
  
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }
  
  if (!formData.message.trim()) {
    newErrors.message = "Message is required";
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    // Submit form
  }
};
```

## Code Examples

### Custom Form Field

```tsx
// Add textarea for longer messages
<div>
  <textarea
    placeholder="Your Message"
    value={formData.message}
    onChange={(e) => handleChange("message", e.target.value)}
    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    required
  />
</div>
```

### Adding Contact Info Item

```tsx
// Add social media link
<ContactInfoItem
  icon={Instagram}
  title="Instagram"
  value="@cebufurnituremaker"
  delay={0.8}
/>
```

### Form with Success State

```tsx
const [isSubmitted, setIsSubmitted] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Submit logic
  setIsSubmitted(true);
};

if (isSubmitted) {
  return <SuccessMessage />;
}
```

This documentation provides a comprehensive guide for understanding, maintaining, and extending the Contact feature.


# Heritage Christian Academy — Website

A complete static website for a Christian homeschool high school (grades 9–12). Built with plain HTML, CSS, and vanilla JavaScript. Deploy-ready for Netlify.

---

## Files

| File | Page |
|---|---|
| `index.html` | Homepage |
| `about.html` | About Us — Mission, Story, Values, Statement of Faith |
| `academics.html` | Academics — Courses, Graduation Requirements, Diploma Tracks |
| `admissions.html` | Admissions — Enrollment Process, Application Form, Tuition |
| `resources.html` | Resources — Transcript Requests, Parent & Student Guides, Downloads |
| `contact.html` | Contact — Contact Form, Map, Info Request Form |
| `faq.html` | FAQ — Accordion by category |
| `calendar.html` | School Calendar — Interactive JS calendar with event popups |
| `styles.css` | All styles |
| `script.js` | All JavaScript (navbar, calendar, FAQ, forms) |
| `netlify.toml` | Netlify deploy configuration |

---

## Setup — Replace All Placeholders

Search the project for each placeholder and replace with real content:

| Placeholder | Replace With |
|---|---|
| `[SCHOOL NAME]` | Your school's official name |
| `[PHONE NUMBER]` | School phone number (e.g. `(555) 123-4567`) |
| `[EMAIL ADDRESS]` | School email address |
| `[SCHOOL ADDRESS]` | Street address |
| `[CITY, STATE ZIP]` | City, state, and ZIP code |
| `[TUITION AMOUNT]` | Annual full-time tuition (used in admissions.html) |
| `[COURSE FEE]` | Per-course enrollment fee |
| `[AMOUNT]` | Enrollment/registration fee |

**Quick replace in VS Code:** `Ctrl+Shift+H` → search for `[SCHOOL NAME]` → replace all.

---

## Customization

### School Name in JS
The `script.js` calendar events use `Heritage Christian Academy` in the event descriptions. Search for and replace those strings if needed.

### Calendar Events
Open `script.js` and find the `EVENTS` object (around line 124). Edit, add, or remove events as needed. Keys are `YYYY-MM-DD` strings. Each event has:
```js
'2026-08-12': {
  text: 'First Day of School',
  type: 'academic',          // academic | holiday | deadline | graduation
  desc: 'Longer description shown in the popup.'
}
```

### Colors
All colors are CSS custom properties in `styles.css` (lines ~12–30):
```css
--navy:  #1B2A4A;
--gold:  #C8A45C;
--cream: #FAF7F2;
--sage:  #6B8F71;
```

### Fonts
Loaded from Google Fonts: **Playfair Display** (headings) + **Source Sans 3** (body). Change in the `<link>` tag in each HTML file and in `styles.css` font-family declarations.

### Hero Images
Hero background images use Unsplash URLs. Replace with your own hosted images:
```html
<!-- Before -->
<div class="page-hero-bg" style="background-image:url('https://images.unsplash.com/...')"></div>
<!-- After -->
<div class="page-hero-bg" style="background-image:url('images/your-photo.jpg')"></div>
```

### Map
In `contact.html`, find the `<div class="map-placeholder">` section and replace it with an embedded Google Maps `<iframe>`.

### Logo
The navbar uses an inline SVG cross/shield logo. Replace with your own `<img>` tag or SVG if desired.

---

## Forms (Netlify)

All forms use [Netlify Forms](https://docs.netlify.com/forms/setup/). They work automatically when deployed to Netlify — no backend needed.

Forms included:
- `enrollment` — Full student enrollment application (admissions.html)
- `transcript-request` — Official transcript request (resources.html)
- `contact` — General contact form (contact.html)
- `inquiry` — Information request form (contact.html)

**Local preview:** Forms will show a simulated success message when opened via `file://` or `localhost` (handled in script.js). On Netlify, they submit to your Netlify dashboard.

---

## Deployment (Netlify)

1. Push this folder to a GitHub repository
2. Log in to [netlify.com](https://netlify.com) and click **Add new site → Import an existing project**
3. Connect your GitHub repo
4. Build settings: leave blank (static site, no build command needed)
5. Publish directory: `.` (or leave blank)
6. Click **Deploy**

Or drag-and-drop the entire folder to [app.netlify.com/drop](https://app.netlify.com/drop) for instant deployment.

---

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `IntersectionObserver` (no IE11 support needed).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static portfolio website** built with vanilla HTML, CSS, and JavaScript. No build tools or package managers are used - it's designed for direct deployment to GitHub Pages at https://lhg1006.github.io/.

## Development Commands

Since this is a static website with no build process, development is done by:

1. **Local Development**: Open `index.html` directly in a browser or use any local HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if globally installed)
   npx serve .
   ```

2. **Testing Changes**: 
   - Refresh browser after making changes
   - Test on mobile devices/responsive mode
   - Test both language modes (Korean/English)
   - Test both themes (light/dark mode)

3. **Deployment**: 
   - Push to `main` branch
   - GitHub Pages automatically serves the site

## Architecture Overview

### Core Systems

1. **Internationalization (i18n)**
   - Translation files: `js/i18n/ko.json` and `js/i18n/en.json`
   - Uses nested object structure (e.g., `about.intro.p1`)
   - Language switching preserves fullPage.js state
   - Stored in localStorage as user preference

2. **Theme Management**
   - CSS custom properties in `css/base.css` for theming
   - Dark/light mode with system preference detection
   - Theme stored in localStorage
   - All components support both themes

3. **fullPage.js Integration**
   - Progressive enhancement - disabled on mobile (≤768px)
   - 4 main sections: About, Experience, Projects, Skills
   - Custom tooltips with i18n support
   - Responsive fallback for mobile users

### File Organization

```
css/
├── base.css           # CSS variables, themes, global styles
├── layout.css         # Header and navigation layout
├── components.css     # Reusable UI components
├── responsive.css     # Media queries and mobile optimizations
└── sections/          # Section-specific styles
    ├── about.css
    ├── experience.css
    ├── skills.css
    ├── projects.css
    ├── certifications.css
    └── contact.css

js/
├── main.js           # Core application logic
└── i18n/             # Translation files
    ├── ko.json       # Korean translations
    └── en.json       # English translations
```

### Key Components

1. **Experience Slider** (`main.js`): Manual carousel with touch support
2. **Projects Slider** (`main.js`): Responsive cards (1 mobile, 3 desktop)
3. **Skills Progress Bars**: Intersection Observer triggered animations
4. **Language Toggle**: Real-time switching with fullPage.js reinitialization
5. **Theme Toggle**: Instant theme switching with CSS custom properties

## Important Technical Details

### Adding New Content

1. **For bilingual content**: Update both `ko.json` and `en.json` with matching keys
2. **For new sections**: Add CSS file in `sections/` and import in `index.html`
3. **For new components**: Add styles to `components.css`

### Responsive Behavior

- Mobile-first approach with progressive enhancement
- fullPage.js automatically disabled on mobile devices
- All components have mobile-optimized layouts
- Touch gestures supported for sliders

### Performance Considerations

- Images use lazy loading with Intersection Observer
- Animations use `requestAnimationFrame`
- External libraries loaded via CDN
- Minimal JavaScript footprint for fast loading

### Accessibility Features

- Semantic HTML structure throughout
- ARIA labels and roles properly implemented
- Skip navigation for keyboard users
- High contrast support in both themes
- Proper focus management

## External Dependencies

All loaded via CDN (no package management):
- fullPage.js 4.0.15 (page scrolling)
- Font Awesome 6.0.0 (icons)
- Chart.js 3.9.1 (skills visualization - if used)

## Content Management

Professional portfolio content includes:
- **Current Role**: GPTKorea Inc. (2024.07-Present) - Lead Developer
- **Previous Role**: Yeoboya Inc. (2022.05-2023.12) - Full Stack Developer
- **Tech Stack**: Java, Spring Boot, React, Next.js, PostgreSQL, MySQL
- **Languages**: Korean (native), English (business level)

All content is maintained in the i18n JSON files for easy updates and translation management.
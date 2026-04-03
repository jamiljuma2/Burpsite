# Dashboard Background Image Setup

This guide explains how to configure the circuit board background image for the Burpsite dashboard.

## Setup Instructions

### 1. Place the Background Image

Save the circuit board image file as `dashboard-bg.jpg` in the public folder:

```
frontend/public/dashboard-bg.jpg
```

**Image Specifications:**
- Format: JPEG, PNG, or WebP
- Recommended resolution: 1920x1080 or higher
- File size: Optimized (under 1MB for best performance)
- The image will be displayed with brightness and contrast filters applied

### 2. How It Works

The dashboard background uses a layered approach:

1. **Base Image Layer** - Your circuit board image positioned at the center
   - Brightness filter: 1.25x (brighter)
   - Contrast filter: 1.15x (enhanced)
   - Opacity: 90% (visible but not overwhelming)

2. **Overlay Gradient** - Dark overlay with accent lights
   - Dark shade: 45% opacity (semi-transparent dark overlay)
   - Red accent glow: 15% opacity at top-left
   - Blue accent glow: 15% opacity at bottom-right

3. **Glassmorphism Cards** - Content cards with frosted glass effect
   - Background opacity: 80-85%
   - Blur effect: 12px (backdrop blur)
   - Border: Subtle light border for definition

### 3. Responsive Design

The dashboard background automatically adapts to different screen sizes:
- Mobile (< 640px): Maintains full background coverage with adjusted padding
- Tablet (640px - 1024px): Optimized spacing and card layout
- Desktop (> 1024px): Full width with maximum content width of 80rem

### 4. Visual Effects

**Card Effects:**
- Smooth hover animations with slight elevation
- Glassmorphism effect with backdrop blur
- Enhanced shadows on interaction
- Color transitions for visual feedback

**Entrance Animation:**
- Cards slide up smoothly on page load
- 0.5s animation duration with ease-out timing
- Staggered appearance for visual interest

### 5. CSS Customization

To adjust the background appearance, edit `frontend/src/styles/dashboardPages.css`:

```css
/* Adjust brightness */
filter: brightness(1.25) contrast(1.15);  /* Change these values */

/* Adjust overlay opacity */
background-image: linear-gradient(rgba(15, 23, 42, 0.45), ...);  /* Change 0.45 */

/* Adjust card glass effect */
background: rgba(20, 28, 45, 0.8);  /* Change 0.8 for more/less transparency */
backdrop-filter: blur(12px);  /* Change blur amount */
```

### 6. Fallback Behavior

If the image file is missing:
- The gradient overlay and accent lights remain visible
- Content is still readable and properly styled
- No build errors occur (image is optional)

### 7. Testing Locally

Before deploying, test the dashboard locally:

```bash
cd frontend
npm start
```

Navigate to the dashboard after login to verify:
- Background image displays correctly
- Cards have proper glassmorphism effect
- Text is readable on the background
- Hover effects work smoothly
- Mobile layout is responsive

### 8. Deployed Version

Once you place the image and push to GitHub:

1. Frontend automatically rebuilds on Vercel
2. Image is deployed to the public folder
3. Dashboard loads with full background styling
4. No additional deployment configuration needed

## Image Recommendations

For the circuit board aesthetic:
- High contrast with bright neon colors
- Technology/digital theme
- Dark background with light accent colors
- Vertical or diagonal flow patterns encourage visual movement

The brightness and contrast filters will enhance detail visibility even if the image is subtle.

## Troubleshooting

**Image not showing:**
- Check file is at `frontend/public/dashboard-bg.jpg`
- Verify file format is supported (JPG, PNG, WebP)
- Clear browser cache and reload
- Check browser console for any 404 errors

**Image too bright/dark:**
- Adjust `brightness()` value in `dashboardPages.css`
- Range: 1.0 (normal) to 1.5 (very bright)

**Cards are hard to read:**
- Increase the overlay opacity value (0.45 → 0.55)
- Increase card background opacity (0.8 → 0.9)
- Both changes make content more opaque

**Performance issues:**
- Optimize image file size (use JPEG compression)
- Ensure file is under 1MB
- Consider using WebP format for faster loading

# Adding Background Image to Login/Register Pages

## Image Placement

The background image referenced in the CSS is `public/binary-bg.jpg`. 

**Steps to add the image:**

1. Save the binary code background image as `binary-bg.jpg`
2. Place it in: `frontend/public/binary-bg.jpg`
3. Rebuild the frontend: `npm run build`
4. Deploy to Vercel (auto-detects changes)

## Current Styling Applied

- ✅ Background image support (when file is placed)
- ✅ Dark overlay for readability (85% opacity)
- ✅ Glassmorphism card effect with backdrop blur
- ✅ Gradient accent layers (red/blue)
- ✅ Smooth entrance animation
- ✅ Responsive mobile design
- ✅ Fixed background (parallax effect on scroll)

## File Structure

```
frontend/
├── public/
│   └── binary-bg.jpg          ← Add your image here
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx      ✓ Updated
│   │   └── RegisterPage.jsx   ✓ Updated
│   └── styles/
│       └── authPages.css      ✓ Created
```

## Image Specifications

- **Format**: JPG or PNG
- **Recommended Size**: 1920x1080 or larger
- **File Size**: Keep under 500KB for performance
- **Theme**: Digital/Binary/Code-themed (blue, dark, tech aesthetic)

## Testing

After adding the image:
1. Navigate to `/login` and `/register` pages
2. Verify background image displays
3. Check on mobile devices (should scale properly)
4. Ensure text is readable over the background

## Fallback

If the image is not found, the page will fall back to a solid dark gradient background (no functionality lost).

# Mobile Responsiveness Guide

## Overview
OverTeX now includes comprehensive mobile support with adaptive layouts for phones and tablets.

---

## 📱 Responsive Breakpoints

### Breakpoint System
- **Mobile**: `< 768px` (phones)
- **Desktop**: `≥ 768px` (tablets and larger)

### Detection
- Automatic detection via window width
- Updates on window resize
- Auto-adjusts layout on orientation change

---

## 🎨 Mobile-Specific Features

### 1. **Adaptive Layout**

**Desktop (≥768px)**:
```
┌────────────────────────────────────────┐
│ Menubar (Full menus)                   │
├────────┬───────────────────────────────┤
│Sidebar │     PDF Viewer                │
│        │  (Resizable panels)           │
│        ├───────────────────────────────┤
│        │     Logs Panel                │
└────────┴───────────────────────────────┘
```

**Mobile (<768px)**:
```
┌────────────────────────────────────────┐
│ Mobile Menubar (Compact)               │
├────────────────────────────────────────┤
│                                        │
│      PDF Viewer OR Logs                │
│      (Full screen, toggle)             │
│                                        │
└────────────────────────────────────────┘
```

### 2. **Mobile Menubar**
- Hamburger menu icon to open sidebar sheet
- App branding (OverTeX logo + name)
- Quick build button with spinning animation
- Toggle logs button
- Compact design (no dropdowns)

### 3. **Sidebar Sheet**
- Opens from left edge (80% viewport width)
- Smooth slide animation
- Contains full sidebar functionality:
  - Build button
  - File tabs (Files, History, Settings)
  - Source file info
- Touch-friendly close button
- Backdrop overlay

### 4. **Stacked Content**
- PDF viewer and logs don't share screen
- Toggle between PDF view and logs view
- Full-height panels for better visibility
- No resizable handles (fixed layout)

### 5. **Touch-Friendly UI**
- **Minimum touch targets**: 44x44px (Apple HIG standard)
- Larger tap areas for all buttons
- Adequate spacing between interactive elements
- No hover-dependent features

### 6. **Responsive Components**

#### Status Bar
- Hides extra info on small screens
- Shows only essential status
- Compact spacing
- Abbreviated version number

#### Log Viewer
- Icon-only buttons on mobile (Copy, Clear)
- Text labels hidden, shown on desktop
- Touch-optimized scroll area
- Larger touch targets

#### PDF Viewer
- Optimized empty/error states
- Touch-specific instructions
- Pinch-to-zoom support (native browser)
- Swipe navigation (if multi-page)

---

## 💡 Mobile UX Patterns

### Navigation Flow

**Opening Sidebar:**
1. Tap hamburger menu (☰) in top-left
2. Sidebar slides in from left
3. Tap backdrop or close to dismiss

**Building PDF:**
1. Option A: Tap build icon in menubar
2. Option B: Open sidebar → Tap "Build PDF" button
3. Toast notification confirms action

**Viewing Logs:**
1. Tap terminal icon in menubar
2. View switches to logs panel
3. Tap again to return to PDF

**Toggling Views:**
- PDF ↔ Logs: Tap terminal icon
- Sidebar: Tap menu icon

### Gesture Support
- **Swipe**: Sheet drawer can be swiped closed
- **Tap**: Standard touch interactions
- **Pinch-zoom**: PDF viewer supports native zoom
- **Scroll**: Touch-friendly smooth scrolling

---

## 🎯 Mobile-Specific Optimizations

### Performance
```css
/* Touch scrolling optimization */
* {
  -webkit-overflow-scrolling: touch;
}

/* Prevent zoom on input focus */
input, select, textarea {
  font-size: 16px; /* Prevents iOS zoom */
}
```

### Viewport Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### CSS Media Queries
```css
/* Desktop-only features */
@media (min-width: 768px) {
  /* Custom scrollbars */
  /* Hover effects */
  /* Resizable panels */
}

/* Mobile-only features */
@media (max-width: 767px) {
  /* Touch scrolling */
  /* Larger touch targets */
  /* Simplified layout */
}
```

---

## 📋 Component Behavior

### Menubar Component
| Feature | Desktop | Mobile |
|---------|---------|--------|
| Menus | Full dropdowns | Hidden |
| Build button | With text | Icon only |
| Settings | Full menu | Icon only |
| Width | Full width | Full width |
| Height | ~40px | ~48px |

### Sidebar Component
| Feature | Desktop | Mobile |
|---------|---------|--------|
| Display | Always visible (toggleable) | Sheet drawer |
| Width | 15-35% resizable | 80vw fixed |
| Position | Fixed left | Overlay |
| Tabs | Visible | Visible |
| Close | Toggle button | Swipe or button |

### PDF Viewer
| Feature | Desktop | Mobile |
|---------|---------|--------|
| Controls | Browser toolbar | Touch gestures |
| Zoom | Mouse scroll | Pinch |
| Navigate | Click | Swipe |
| Empty state | Desktop instructions | Mobile instructions |

### Logs Panel
| Feature | Desktop | Mobile |
|---------|---------|--------|
| Position | Bottom split | Full screen toggle |
| Height | Resizable (15-50%) | 100% when active |
| Buttons | With labels | Icon only |
| Toggle | View menu | Icon button |

---

## 🚀 Testing Mobile Responsiveness

### Browser DevTools
1. Open Chrome DevTools (`F12`)
2. Click device toggle icon (`Ctrl+Shift+M`)
3. Select device preset or custom size
4. Test at various widths:
   - iPhone SE: 375px
   - iPhone 12/13: 390px
   - Pixel 5: 393px
   - iPad Mini: 768px
   - iPad Pro: 1024px

### Real Device Testing
```bash
# Start dev server
npm run dev

# Get local IP
hostname -I  # Linux
ipconfig     # Windows

# Access from mobile device
http://<your-ip>:5173
```

### Responsive Test Checklist
- [ ] Sidebar opens as sheet on mobile
- [ ] Build button works in mobile menubar
- [ ] Logs toggle works on mobile
- [ ] PDF viewer scales properly
- [ ] Touch targets are at least 44px
- [ ] No horizontal scrolling
- [ ] Status bar adapts to screen size
- [ ] Toast notifications display correctly
- [ ] Sheet drawer closes with swipe
- [ ] Orientation change handled smoothly

---

## 🐛 Mobile-Specific Known Issues

### iOS Safari
- **Issue**: PDF rendering may lag on older devices
- **Workaround**: Use lower resolution PDFs or fewer pages

### Android Chrome
- **Issue**: Sheet animation may stutter on low-end devices
- **Workaround**: Reduce animation complexity in production

### General
- **Issue**: Landscape mode on small phones may feel cramped
- **Recommendation**: Portrait mode recommended for phones

---

## 🎨 Customizing Mobile Layout

### Adjusting Breakpoint
```typescript
// In App.vue
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024  // Change to 1024 for tablet-as-mobile
}
```

### Changing Sheet Width
```vue
<!-- In App.vue -->
<SheetContent side="left" class="w-[90vw] p-0">  <!-- Change 80vw to 90vw -->
```

### Modifying Touch Target Sizes
```css
/* In App.vue styles */
@media (max-width: 767px) {
  button, a {
    min-height: 48px;  /* Increase from 44px */
    min-width: 48px;
  }
}
```

---

## 📱 PWA Capabilities (Future)

### Add to Home Screen
- Already includes mobile web app meta tags
- Can be installed as PWA with manifest.json
- Full-screen app experience on mobile

### Offline Support
- Service worker can cache assets
- Work offline with previously compiled PDFs
- Sync when connection restored

---

## 🎯 Best Practices

### Do's ✅
- Test on real devices regularly
- Keep touch targets ≥ 44px
- Use system fonts for better performance
- Minimize animations on mobile
- Provide clear visual feedback for touches
- Support both portrait and landscape

### Don'ts ❌
- Don't rely on hover states
- Don't use tiny touch targets
- Don't assume fast network
- Don't ignore device capabilities
- Don't forget accessibility
- Don't use fixed pixel widths

---

## 📚 Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Touch Target Size](https://material.io/design/usability/accessibility.html#layout-typography)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Mobile Best Practices](https://web.dev/mobile/)

---

**Mobile-first, responsive everywhere! 📱💻**

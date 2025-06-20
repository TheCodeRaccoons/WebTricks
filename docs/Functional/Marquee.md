# Marquee

## Version
Current Version: 1.0.0

## Description
Marquee is a modern implementation of scrolling content that provides smooth, continuous movement in any direction. It automatically handles content repetition and supports both horizontal and vertical scrolling with configurable speed.

## Functionality
- Smooth scrolling animation
- Multi-directional support (left, right, top, bottom)
- Automatic content duplication
- Dynamic gap handling
- Responsive design support
- Performance optimized with transform3d
- Automatic resize handling
- Continuous loop effect

## Usage
Add the script to your project and include the required attributes on your marquee container.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/Marquee.min.js"></script>
```

### Required Attributes
- `wt-marquee-element="container"` - Applied to the main marquee container

### Optional Attributes
- `wt-marquee-speed="50"` - Animation speed in milliseconds (default: 50)
- `wt-marquee-direction="left"` - Scroll direction (default: left)
  - Supported values: `left`, `right`, `top`, `bottom`

## Considerations
1. **Content Duplication**: Automatically duplicates content to ensure continuous scrolling
2. **Gap Handling**: Respects CSS gap property between elements
3. **Performance**: Uses GPU-accelerated animations via transform3d
4. **Responsiveness**: Automatically adjusts to container size changes
5. **Memory Management**: Efficiently reuses DOM elements

## Examples

### Basic Horizontal Marquee
```html
<div wt-marquee-element="container">
    <div class="marquee-item">Item 1</div>
    <div class="marquee-item">Item 2</div>
    <div class="marquee-item">Item 3</div>
</div>
```

### Vertical Marquee with Custom Speed
```html
<div wt-marquee-element="container" 
     wt-marquee-direction="top" 
     wt-marquee-speed="30">
    <div class="marquee-item">Vertical Item 1</div>
    <div class="marquee-item">Vertical Item 2</div>
    <div class="marquee-item">Vertical Item 3</div>
</div>
```

### Common Use Cases
1. News tickers
2. Announcement banners
3. Product showcases
4. Image galleries
5. Content rotation displays

### Styling Tips
```css
/* Container styling */
[wt-marquee-element="container"] {
    gap: 20px; /* Space between items */
    overflow: hidden; /* Hide overflow */
}

/* Item styling */
.marquee-item {
    flex-shrink: 0; /* Prevent items from shrinking */
}
```

## Best Practices
1. Keep content items similar in size for smooth scrolling
2. Use the gap property for consistent spacing
3. Ensure parent container has a defined size
4. Use flex-shrink: 0 on items to maintain dimensions
5. Consider using will-change: transform for performance
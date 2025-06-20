# CopyToClipboard

## Version
Current Version: 1.0.0

## Description
CopyToClipboard is a utility script that enables copying text to clipboard with visual feedback. It supports custom success messages, styling, and timeout durations for the feedback display.

## Functionality
- One-click text copying
- Customizable success messages
- Visual feedback through classes
- Configurable feedback duration
- Separate text target support
- Automatic state reset
- Multiple instances support

## Usage
Add the script to your project and include the required attributes on your copy elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/CopyToClipboard.min.js"></script>
```

### Required Attributes
- `wt-copycb-element="container"` - Applied to the container element
- `wt-copycb-element="trigger"` - Applied to the click trigger element
- `wt-copycb-element="target"` - Applied to the element containing text to copy

### Optional Attributes
- `wt-copycb-message="Copied!"` - Custom success message
- `wt-copycb-active="is-copy"` - CSS class for active state
- `wt-copycb-timeout="2000"` - Duration to show success state (ms)
- `wt-copycb-element="texttarget"` - Element within trigger to update with success message

## Considerations
1. **Clipboard API**: Uses modern navigator.clipboard API
2. **State Management**: Automatically resets to original state
3. **Visual Feedback**: Supports both text and class-based feedback
4. **Multiple Instances**: Supports multiple copy buttons on the same page
5. **Performance**: Lightweight with minimal DOM manipulation

## Examples

### Basic Implementation
```html
<div wt-copycb-element="container">
    <button wt-copycb-element="trigger">Copy Text</button>
    <div wt-copycb-element="target">Text to be copied</div>
</div>
```

### Advanced Implementation
```html
<div wt-copycb-element="container">
    <button wt-copycb-element="trigger"
            wt-copycb-message="Copied!"
            wt-copycb-active="is-active"
            wt-copycb-timeout="3000">
        <span wt-copycb-element="texttarget">Copy to Clipboard</span>
        <i class="icon"></i>
    </button>
    <div wt-copycb-element="target">
        Complex text that needs to be copied
    </div>
</div>
```

### CSS Styling Example
```css
/* Default state */
[wt-copycb-element="trigger"] {
    transition: all 0.3s ease;
}

/* Active state */
.is-copy {
    background-color: #4CAF50;
    color: white;
}
```

### Common Use Cases
1. Code snippet copying
2. Share link buttons
3. Reference number copying
4. Contact information copying
5. Form field duplication

### Best Practices
1. Always provide visual feedback for copy action
2. Use clear and concise success messages
3. Consider mobile touch interactions
4. Maintain original styling during state changes
5. Include fallback for unsupported browsers
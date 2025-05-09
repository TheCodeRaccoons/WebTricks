# MirrorClick

## Version
Current Version: 1.0.0

## Description
MirrorClick is a Webflow-specific script that allows you to mirror click events from one element to another. When a trigger element is clicked, it automatically triggers a click event on a corresponding target element. This is particularly useful for creating synchronized interactions or controlling multiple elements with a single click.

## Functionality
- Mirrors click events from trigger elements to target elements
- Supports multiple trigger-target pairs
- Automatic initialization on page load
- Error handling and graceful degradation
- No interference with other click handlers

## Usage
Add the script to your Webflow project and include the required attributes on your trigger and target elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/WebflowOnly/MirrorClick.min.js"></script>
```

### Required Attributes
For a single pair:
- `wt-mirrorclick-element="trigger"` - Applied to the element that will trigger the click
- `wt-mirrorclick-element="target"` - Applied to the element that will receive the mirrored click

For multiple pairs:
- `wt-mirrorclick-element="trigger-1"` - Applied to the first trigger element
- `wt-mirrorclick-element="target-1"` - Applied to the first target element
- `wt-mirrorclick-element="trigger-2"` - Applied to the second trigger element
- `wt-mirrorclick-element="target-2"` - Applied to the second target element
(And so on for additional pairs)

## Considerations
1. **Event Propagation**: The mirrored click is a genuine click event on the target element
2. **Error Handling**: Gracefully handles missing or incorrect target elements
3. **Multiple Instances**: Supports multiple trigger-target pairs on the same page
4. **Performance**: Lightweight event handling with minimal overhead
5. **Initialization**: Automatically initializes when the DOM is ready

## Examples

### Basic Implementation
```html
<!-- Single pair example -->
<button wt-mirrorclick-element="trigger">Click Me</button>
<div wt-mirrorclick-element="target">Target Element</div>
```

### Multiple Pairs Implementation
```html
<!-- Multiple pairs example -->
<button wt-mirrorclick-element="trigger-1">Trigger 1</button>
<button wt-mirrorclick-element="trigger-2">Trigger 2</button>

<div wt-mirrorclick-element="target-1">Target 1</div>
<div wt-mirrorclick-element="target-2">Target 2</div>
```

### Common Use Cases
1. Synchronized tab switching
2. Multiple button controls
3. Hidden element triggering
4. Form submission from multiple locations
5. Modal/popup controls